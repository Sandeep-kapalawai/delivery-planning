/* istanbul ignore file */
import { Store } from 'vuex';
import {
    validateAccessForUserGroupsV3,
    userHasRequiredPermissionV3,
    getFormattedDate,
    getNotificationMessageFromAPIErrors,
    addNotification,
    removeNotification,
    downloadXlsx,
} from 'destination/utilities';
import { ExportExcelTypeEnum } from './export-excel-type';
import { IExportExcelOption } from '../interfaces';
import i18n from '@/i18n';
import {
    UserPermissionUserGroupNameEnum,
    UserPermissionV3Enum,
    UserPermissionV3BusinessCapabilityEnum,
    ListViewTypeEnum,
    NotificationComponentEnum,
} from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { ListActionEnum } from '@/store/static';

async function downloadExcelFile({
    option,
    $store,
    action,
    params,
}: {
    option: IExportExcelOption;
    $store: Store<any>;
    action: string;
    params: { [key: string]: any };
}) {
    removeNotification(NotificationComponentEnum.DP_LIST_PAGE, option.key);

    try {
        const todayDate: string = getFormattedDate({ date: new Date() });
        const response = await $store.dispatch(action, params);
        downloadXlsx(`${option.fileName} - ${todayDate}`, response);
    } catch (error) {
        addNotification(NotificationComponentEnum.DP_LIST_PAGE, getNotificationMessageFromAPIErrors({ id: option.key, error }));
    }
}

export function getExportExcelOptions({
    $store,
    listViewType,
    listViewModule,
    selectedRows,
}: {
    $store: Store<any>;
    listViewType: ListViewTypeEnum;
    listViewModule: string;
    selectedRows: Map<number, IFclListItem | ILclListItem>;
}): Array<IExportExcelOption> {
    const deliveryPlanIds = Array.from(selectedRows.values()).map((item) => item.deliveryPlanId);
    const deliveryPlanId = deliveryPlanIds.length ? deliveryPlanIds.join() : undefined;

    return [
        {
            key: ExportExcelTypeEnum.CSA_BULK_UPDATE,
            isExporting: false,
            fileName: 'Destination Delivery Planning Bulk Upload Template',
            label: i18n.t('EXPORT_EXCEL.BULK_UPDATE').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CSA_BULK_UPDATE}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                        shouldExportGasCheckDetailsOnly: false,
                    },
                });
            },
        },
        {
            key: ExportExcelTypeEnum.CONSIGNEE_BULK_UPDATE,
            isExporting: false,
            fileName: 'Destination Delivery Planning Bulk Upload Template',
            label: i18n.t('EXPORT_EXCEL.BULK_UPDATE').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
                validateForInternalUsers: true,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                    },
                });
            },
        },
        {
            key: ExportExcelTypeEnum.CSA_GAS_CHECK,
            isExporting: false,
            fileName: 'Destination Gas check Bulk Upload Template',
            label: i18n.t('EXPORT_EXCEL.GAS_CHECK').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CSA_BULK_UPDATE}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                        shouldExportGasCheckDetailsOnly: true,
                    },
                });
            },
        },
        {
            key: ExportExcelTypeEnum.CSA_WITH_CURRENT_COLUMNS,
            isExporting: false,
            fileName: 'Destination Delivery Planning SELECTED',
            label: i18n.t('EXPORT_EXCEL.WITH_CURRENT_COLUMNS').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                        uiId: listViewType === ListViewTypeEnum.fcl ? 'FCLList' : 'LCLList',
                    },
                });
            },
        },
        {
            key: ExportExcelTypeEnum.CSA_WITH_ALL_COLUMNS,
            isExporting: false,
            fileName: 'Destination Delivery Planning ALL',
            label: i18n.t('EXPORT_EXCEL.WITH_ALL_COLUMNS').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                    },
                });
            },
        },
        {
            key: ExportExcelTypeEnum.CONSIGNEE_WITH_ALL_COLUMNS,
            isExporting: false,
            fileName: 'Destination Delivery Planning ALL',
            label: i18n.t('EXPORT_EXCEL.WITH_ALL_COLUMNS').toString(),
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
                validateForInternalUsers: true,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            actionMethod() {
                downloadExcelFile({
                    option: this,
                    $store,
                    action: `${listViewModule}/${ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS}`,
                    params: {
                        page: 1,
                        deliveryPlanId,
                    },
                });
            },
        },
    ].filter((option: IExportExcelOption) => {
        if (!validateAccessForUserGroupsV3(option.allowAccessForUserGroups)) {
            return false;
        } else if (!userHasRequiredPermissionV3(UserPermissionV3BusinessCapabilityEnum.Destination_Delivery_Planning, option.requiredUserPermissionV3)) {
            return false;
        }

        return true;
    });
}
