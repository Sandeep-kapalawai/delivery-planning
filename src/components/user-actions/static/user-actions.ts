/* istanbul ignore file */
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { isEmpty } from 'lodash';
import i18n from '@/i18n';
import { validateAccessForUserGroupsV3, userHasRequiredPermissionV3 } from 'destination/utilities';
import { IUserAction } from '../interfaces';
import { ListViewTypeEnum, PlanningStatusEnum, UserPermissionUserGroupNameEnum, UserPermissionV3BusinessCapabilityEnum, UserPermissionV3Enum } from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { RouteNameEnum } from '@/router/routes';
import { listViewTypeSpecificAction, getDeliveryPlanId, isDeliveryPlanModifiedByUser } from '@/logic';
import { getExportExcelOptions } from '@/components/list-view/components/table-actions-top/components/import-export/static';

/**
 * Rules for Action buttons
 *
 * Update Details:
 * - User should have permission (For UAM V3): 'Edit' for 'Destination (Delivery Planning)'
 * - Hide the update details section when more than one equipment is selected which is not as same as consignee or carrier
 *
 * Send Plan
 * - Send plan should be displayed for only plan that has status PLANNING_IN_PROGRESS or PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED
 **/

export function getUserActions({
    $store,
    listViewType,
    listViewModule,
    renderComponent,
    router,
    selectedRows,
}: {
    $store: Store<any>;
    listViewType: ListViewTypeEnum;
    listViewModule: string;
    renderComponent: any;
    router: VueRouter;
    selectedRows: Map<number, IFclListItem | ILclListItem>;
}): Array<IUserAction> {
    if (isEmpty(listViewType) || isEmpty(selectedRows)) {
        return [];
    }

    const firstSelectedRow: IFclListItem | ILclListItem = selectedRows.values().next()?.value;

    const userActions: Array<IUserAction> = [
        {
            id: 'update-details',
            label: i18n.t('FIELD.UPDATE_DETAILS').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Edit,
            actionMethod() {
                renderComponent.showUpdateDetails = !renderComponent.showUpdateDetails; //display updatedetails
            },
            customLogic: {
                common: ({ currentRow }) => {
                    const selectedRowItems = [...selectedRows.values()];
                    if (selectedRowItems.length === 1) {
                        return true;
                    }

                    const firstRowItem = selectedRowItems[0];
                    return currentRow.consigneeBECode === firstRowItem.consigneeBECode && currentRow.maerskCarrierCode === firstRowItem.maerskCarrierCode;
                },
            },
        },
        {
            id: 'create-edit-plan',
            label: isDeliveryPlanModifiedByUser(firstSelectedRow) ? i18n.t('EDIT_PLAN').toString() : i18n.t('CREATE_PLAN').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Edit,
            actionMethod() {
                const routeName = listViewTypeSpecificAction<string>(listViewType, {
                    [ListViewTypeEnum.fcl]: () => RouteNameEnum.FCL_DETAILS,
                    [ListViewTypeEnum.lcl]: () => RouteNameEnum.LCL_DETAILS,
                });
                const routeId = getDeliveryPlanId(listViewType, firstSelectedRow);

                router.push({ name: routeName, params: { id: routeId as string } });
            },
            customLogic: {
                common: () => {
                    return selectedRows.size === 1;
                },
            },
        },
        {
            id: 'send-plan',
            label: i18n.t('SEND_PLAN').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Edit,
            actionMethod() {
                renderComponent.showSendPlanConfirmation = !renderComponent.showSendPlanConfirmation; //display sendplan
            },
            customLogic: {
                common: () => {
                    const selectedRowItems = [...selectedRows.values()];
                    return selectedRowItems.every(
                        (row) =>
                            row.planningStatus === PlanningStatusEnum.PLANNING_IN_PROGRESS ||
                            row.planningStatus === PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED,
                    );
                },
            },
        },
    ];

    const exportExcelOptions = getExportExcelOptions({ $store, listViewType, listViewModule, selectedRows });
    if (exportExcelOptions.length) {
        userActions.push({
            id: 'export-excel',
            label: i18n.t('EXPORT_EXCEL.EXPORT').toString(),
            icon: 'chevron-down',
            type: 'dropdown',
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionList: exportExcelOptions,
        });
    }

    for (const row of selectedRows.values()) {
        userActions.forEach((action) => {
            if (action.isHidden) {
                return;
            }

            const commonCustomLogic = action.customLogic?.common;
            const listViewTypeCustomLogic = action.customLogic?.[listViewType];
            const customLogicParams = { selectedRows, currentRow: row };
            if (!validateAccessForUserGroupsV3(action.allowAccessForUserGroups)) {
                action.isHidden = true;
            } else if (!userHasRequiredPermissionV3(UserPermissionV3BusinessCapabilityEnum.Destination_Delivery_Planning, action.requiredUserPermissionV3)) {
                action.isHidden = true;
            } else if (typeof commonCustomLogic === 'function' && !commonCustomLogic(customLogicParams)) {
                action.isHidden = true;
            } else if (typeof listViewTypeCustomLogic === 'function' && !listViewTypeCustomLogic(customLogicParams)) {
                action.isHidden = true;
            }
        });

        if (userActions.every((action) => action.isHidden === true)) {
            break;
        }
    }

    return userActions.filter((action) => !action.isHidden);
}
