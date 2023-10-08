<template>
    <div class="list-view-table">
        <transition v-if="selectedRows && selectedRows.size" name="row-actions">
            <div class="table-container_row-actions-wrapper">
                <RowActions
                    data-test="list-view/row-actions"
                    :list-view-type="listViewType"
                    :list-view-module="listViewModule"
                    @details-success="onUserActionClose('update-details')"
                    @send-do-success="onUserActionClose('send-do')"
                    @deselect-all="clearSelectionUpdateRows()"
                />
            </div>
        </transition>
        <div v-show="!selectedRows || !selectedRows.size">
            <TableActionsTop :list-view-type="listViewType" :list-view-module="listViewModule" />
        </div>

        <div class="table-wrapper">
            <TableComponent
                :table-id="tableId"
                :is-loading="(list && list.isFetching) || false"
                :auto-height="false"
                :stripes="false"
                :row-lines="2"
                :suppress-drag-leave-hides-columns="true"
                :default-col-def="defaultColDef"
                :column-defs="columnDefs"
                :row-data="data"
                :table-theme="tableTheme"
                :is-row-selectable="isRowSelectable"
                :placeholder-checkbox="true"
                @column-moved="onColumnMoved"
                @sort-order-changed="onSortOrderChanged"
                @selection-changed="onSelectionChange"
                @multiple-values-cell-see-more="onCellSeeMoreClick" 
            >
            </TableComponent>

            <PreviewPanel :is-open="previewPanelFDLIsOpen" :title="$t('FIELD.FDL')" @close-panel="closePreviewPanelFDL">
                <FinalDeliveryLocations :cargo-stuffing-number="cargoStuffingNumber" :locations="locations" />
            </PreviewPanel>

            <PreviewPanel :is-open="previewPanelPOIsOpen" panel-width="1200px" :title="$t('FIELD.PURCHASE_ORDER(S)')" @close-panel="closePreviewPanelPO">
                <PurchaseOrders :selected-row="selectedRow" :list-view-type="listViewType" :list-view-module="listViewModule" />
            </PreviewPanel>

            <PreviewPanel :is-open="previewPanelBLIsOpen" :title="$t('FIELD.BL_NUMBERS')" @close-panel="closePreviewPanelBL">
                <BlDetailsSection :selected-row="selectedRow" :list-view-type="listViewType" :list-view-module="listViewModule" />
            </PreviewPanel>

            <PreviewPanel :is-open="previewPanelTransportProviderIsOpen" :title="$t('FILTERS.TRANSPORT_PROVIDERS')" @close-panel="closePreviewPanelTransportProvider">
                <TransportProviderDetails :selected-row="selectedRow" />
            </PreviewPanel>
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-notification';

import Vue, { PropType } from 'vue';
import i18n from '@/i18n';
import { debounce } from 'lodash';
import { PreviewPanel } from '@scm-ui/preview-panel';
import { Table as TableComponent } from '@scm-ui/table';
import {
    getNotificationMessageFromAPIErrors,
    addNotification,
    getFormattedDate,
    formatValueIfEmpty,
    validateAccessForUserGroupsV3,
} from 'destination/utilities';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { PLANNING_STATUSES, SHIPMENT_STATUSES, PRIORITY_GROUPS, getDefaultColDef, getColumnDefs } from './static';
import { getFieldNameForSorting, getRowsToAddAndRemove } from './logic';
import TableActionsTop from './components/table-actions-top/table-actions-top.vue';
import {
    TNT_UI_URL,
    AEM_UI_URL,
    FavouritesComponentNameEnum,
    getSecondaryPlanningStatusDisplayName,
    ListViewTypeEnum,
    MDS_COMPONENT_FIT,
    NotificationComponentEnum,
    getPrimaryExecutiveStatusDisplayName,
    UserPermissionUserGroupNameEnum,
    getDemurrageAndDetentionStatusName,
    NotificationAppearanceEnum,
    DemurrageAndDetentionStatusEnum,
} from '@/static';
import { getDeliveryPlanId, listViewTypeSpecificAction } from '@/logic';
import { IFclListItem, ILclListItem, IFees, SCMTableColDef, ILegDetails } from '@/interfaces';
import { EventBus, EventBusEventName } from '@/utilities';
import { RouteNameEnum } from '@/router/routes';
import { ListGetterEnum, ListActionEnum } from '@/store/static';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
    TableConfigurationGetterEnum,
} from '@/store/modules/table-configuration/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum, PaginationActionEnum } from '@/store/modules/pagination/static';
import { NAMESPACE as QUICK_FILTERS_NAMESPACE, QuickFilterGetterEnum } from '@/store/modules/quick-filters/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterGetterEnum } from '@/store/modules/filter/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingActionEnum, SortingGetterEnum, SortingTypeEnum } from '@/store/modules/sorting/static';
import FinalDeliveryLocations from './components/final-delivery-locations/final-delivery-locations.vue';
import PurchaseOrders from '../list-view/components/purchase-orders/purchase-orders.vue';
import BlDetailsSection from '../list-view/components/bl-details/bl-details.vue';
import TransportProviderDetails from '../list-view/components/transport-provider-details/transport-provider-details.vue';
import RowActions from './components/row-actions/row-actions.vue';

import './styles/list-view.scss';


export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'ListView',
    i18n,
    components: {
        TableComponent,
        PreviewPanel,
        TableActionsTop,
        FinalDeliveryLocations,
        PurchaseOrders,
        BlDetailsSection,
        RowActions,
        TransportProviderDetails,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        listViewModule: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            previewPanelFDLIsOpen: false,
            previewPanelPOIsOpen: false,
            previewPanelBLIsOpen: false,
            previewPanelTransportProviderIsOpen:false,
            locations: [],
            cargoStuffingNumber: '',
            selectedRow: {},
            data: [],
            messageType: '',
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        tableId() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_TABLE_ID}`];
        },
        defaultColDef() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF}`];
        },
        columnDefs() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_COLUMN_DEFS}`];
        },
        list() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_LIST}`];
        },
        rowData() {
            return this.list.result.map((row: IFclListItem | ILclListItem) => this.mapRow(row));
        },
        appliedPagination() {
            return this.$store.getters[`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
        },
        appliedFilters() {
            return this.$store.getters[`${this.listViewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTERS}`];
        },
        appliedQuickFilters() {
            return this.$store.getters[`${this.listViewModule}/${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];
        },
        appliedSort() {
            return this.$store.getters[`${this.listViewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
        },
        selectedRows() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_SELECTED_ROWS}`];
        },
        selectedCargoStuffingIDs() {
            const selectedItems = Array.from(this.selectedRows.values());
            return selectedItems.map((obj: any) => obj.cargoStuffingNumber).join(', ');
        },
        tableTheme() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_THEME}`];
        },
    },

    watch: {
        appliedPagination() {
            this.fetchList();
        },
        appliedFilters() {
            this.fetchList(true);
        },
        appliedSort() {
            this.fetchList(true);
        },
        appliedQuickFilters() {
            this.fetchList(true);
        },
        rowData() {
            this.data = this.rowData.map((row: IFclListItem | ILclListItem) => ({
                ...row,
                selected: this.selectedRows.has(getDeliveryPlanId(this.listViewType, row)),
            }));
        },

  
    },

    created() {
        EventBus.$on(EventBusEventName.FETCH_LIST, (resetPageNumber?: boolean) => this.fetchList(resetPageNumber));

        this.initializeTableConfiguration();
        this.initializeSorting();
        this.fetchList();
    },

    destroyed() {
        EventBus.$off(EventBusEventName.FETCH_LIST);

        this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.CLEAR_SELECTED_ROWS}`);
    },

    methods: {
        initializeTableConfiguration() {
            this.$store.dispatch(`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.INITIALIZE}`, {
                saveUserPreferencesEnabled: true,
                tableId: listViewTypeSpecificAction<string>(this.listViewType, {
                    [ListViewTypeEnum.fcl]: () => FavouritesComponentNameEnum.FCL_List_TableConfiguration,
                    [ListViewTypeEnum.lcl]: () => FavouritesComponentNameEnum.LCL_List_TableConfiguration,
                }),
                defaultColDef: getDefaultColDef({ listViewType: this.listViewType }),
                columnDefs: getColumnDefs({ listViewType: this.listViewType }),
                theme: { spacing: 'default' },
            });
        },
        initializeSorting() {
            this.$store.dispatch(`${this.listViewModule}/${SORTING_NAMESPACE}/${SortingActionEnum.INITIALIZE}`, {
                field: 'estimatedTimeOfArrivalDateTimeLocal',
                direction: SortingTypeEnum.asc,
            });
        },
        async fetchList(resetPageNumber?: boolean) {
            if (resetPageNumber) {
                this.$store.dispatch(`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationActionEnum.SET_PAGE}`, { page: 1 });
            }

            try {
                await this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.FETCH_LIST}`);
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_LIST_PAGE, getNotificationMessageFromAPIErrors({ error }));
            }
        },
        isRowSelectable: (row: any) => {
            return row.data.shipmentStatus?.key === 'CANCELLED' && row.data.deliveryOrderCount === 0 ? false : true;
        },
        onColumnMoved: debounce(function (this: any, columnDefs: Array<SCMTableColDef>) {
            this.$store.dispatch(`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.REARRANGE_COLUMN_DEFS}`, {
                columnDefs,
            });
        }, 150),
        onSortOrderChanged(direction: SortingTypeEnum | null, field: string) {
            this.$store.dispatch(`${this.listViewModule}/${SORTING_NAMESPACE}/${SortingActionEnum.SET_SORT}`, {
                field: getFieldNameForSorting(field),
                direction,
            });
        },
        mapPriority(row) {
            const priority = PRIORITY_GROUPS.get(row.cargoStuffingPriorityLevel?.toString());

            return priority
                ? {
                      text: `${row.cargoStuffingPriorityDisplayName} (P${row.cargoStuffingPriorityLevel})`,
                      category: priority.category,
                      secondaryText: row.cargoStuffingPriorityProgramName,
                  }
                : row.cargoStuffingPriorityLevel;
        },
        getPlanningStatus(row) {
            const primaryPlanningStatus =
                row.shipmentStatus !== 'CANCELLED' ? PLANNING_STATUSES.get(row.planningStatus) : SHIPMENT_STATUSES.get(row.shipmentStatus);

            return { ...primaryPlanningStatus, secondaryText: getSecondaryPlanningStatusDisplayName(row.planningStatus) };
        },
        getGasCheckDetails(gasCheckDetails) {
            let gasCheckRequired = '';
            let gasCheckResult = '';

            if (gasCheckDetails) {
                if (typeof gasCheckDetails.gasCheckRequired == 'boolean') {
                    gasCheckRequired = (
                        gasCheckDetails.gasCheckRequired ? i18n.t('GAS_CHECK_REQUIRED_OPTIONS.YES') : i18n.t('GAS_CHECK_REQUIRED_OPTIONS.NO')
                    ) as string;
                }
                if (gasCheckDetails.gasCheckResult) {
                    gasCheckResult = i18n.t(`GAS_CHECK_RESULT_OPTIONS.${gasCheckDetails.gasCheckResult.toUpperCase()}`) as string;
                }
            }
            return {
                gasCheckRequired,
                gasCheckResult,
            };
        },
        mapRow(row) {
            const isInternalLogin = validateAccessForUserGroupsV3({
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            });
            const deliveryPlanId = getDeliveryPlanId(this.listViewType, row);
            const gasCheckDetails = this.getGasCheckDetails(row.gasCheckDetails);

            const result = {
                ...row,
                id: deliveryPlanId,
                transportDocumentNumbers:
                    row.haveMultipleTransportDocuments === true
                        ? `${row.transportDocumentNumber} ` + i18n.t('MORE').toString()
                        : `${row.transportDocumentNumber}`,
                shipmentStatus: SHIPMENT_STATUSES.get(row.shipmentStatus) || row.shipmentStatus,
                planningStatus: this.getPlanningStatus(row),
                priorityShipment: this.mapPriority(row),
                primaryTextActionFDL: () => this.openPreviewPanelFDL(row),
                primaryTextActionPO: () => this.openPreviewPanelPO(row),
                primaryTextActionBLNo: () => this.openPreviewPanelBl(row),
                gasCheckRequired: gasCheckDetails.gasCheckRequired,
                gasCheckResult: gasCheckDetails.gasCheckResult,
                locations:
                    row.finalDeliveryLocations?.length > 1
                        ? `${row.finalDeliveryLocations[0]?.name} +${row.finalDeliveryLocations.length - 1} ` + i18n.t('MORE').toString()
                        : row.finalDeliveryLocations[0]?.name,
                /* Using the PrimaryTextAction for status and DND colmuns, currently we have limitation with formatting the field (primaryExecutiveStatus) /DND last free date using dataFormatterFieldPrimary,
                this will be removed after the request (ISCMLP-25702) for the table is done after EE team is fixed */
                primaryExecutiveStatus: getPrimaryExecutiveStatusDisplayName(row.primaryExecutiveStatus),
                demurrageFeeLastFreeDate: formatValueIfEmpty(getFormattedDate({ date: row?.fees?.demurrage?.lastFreeDateTimeLocal })),
                demurrageFeeStatus: formatValueIfEmpty(getDemurrageAndDetentionStatusName(row?.fees?.demurrage?.status, row?.fees?.demurrage?.numberOfDays)),
                detentionFeeLastFreeDate: formatValueIfEmpty(getFormattedDate({ date: row?.fees?.detention?.lastFreeDateTimeLocal })),
                detentionFeeStatus: formatValueIfEmpty(getDemurrageAndDetentionStatusName(row?.fees?.detention?.status, row?.fees?.detention?.numberOfDays)),
                 /* Using multiple type value of col def currently we have limitation with formatting the field (transportProviderDetails)using dataFormatterFieldPrimary,
                this will be removed after the request (ISCMLP-36769) for the table is done after EE team is fixed */
                transportProviderDetails: formatValueIfEmpty(this.getTransportProviderDetails(row)),
            };

            if (isInternalLogin) {
                result.navigateToDetailsPage = () => {
                    const routeName = listViewTypeSpecificAction<string>(this.listViewType, {
                        [ListViewTypeEnum.fcl]: () => RouteNameEnum.FCL_DETAILS,
                        [ListViewTypeEnum.lcl]: () => RouteNameEnum.LCL_DETAILS,
                    });
                    this.$router.push({ name: routeName, params: { id: deliveryPlanId as string } });
                };

                result.navigateToTNT = () => {
                    window.open(`${TNT_UI_URL}/${row.cargoStuffingNumber}?transportDocNumber=${row.transportDocumentNumber}`, '_blank');
                };

                const demurrage: IFees = row?.fees?.demurrage;
                if (
                    demurrage?.alertNumber &&
                    (demurrage.status === DemurrageAndDetentionStatusEnum.INCURRING || demurrage.status === DemurrageAndDetentionStatusEnum.INCURRED)
                ) {
                    result.navigateToAEMforDemurrageFee = () => {
                        window.open(`${AEM_UI_URL}/${demurrage.alertNumber}?consigneeMdmCode=${row.consigneeBECode}`, '_blank');
                    };
                }

                const detention: IFees = row?.fees?.detention;
                if (
                    detention?.alertNumber &&
                    (detention.status === DemurrageAndDetentionStatusEnum.INCURRING || detention.status === DemurrageAndDetentionStatusEnum.INCURRED)
                ) {
                    result.navigateToAEMforDetentionFee = () => {
                        window.open(`${AEM_UI_URL}/${detention.alertNumber}?consigneeMdmCode=${row.consigneeBECode}`, '_blank');
                    };
                }
            }

            return result;
        },
        openPreviewPanelFDL(row) {
            this.previewPanelFDLIsOpen = true;
            this.locations = row.finalDeliveryLocations;
            this.cargoStuffingNumber = row.cargoStuffingNumber;
        },
        openPreviewPanelPO(row) {
            this.previewPanelPOIsOpen = true;
            this.selectedRow = row;
        },
        openPreviewPanelBl(row) {
            this.previewPanelBLIsOpen = true;
            this.selectedRow = row;
        },
        closePreviewPanelFDL() {
            this.previewPanelFDLIsOpen = false;
        },
        closePreviewPanelPO() {
            this.previewPanelPOIsOpen = false;
            this.selectedRow = {};
        },
        closePreviewPanelBL() {
            this.previewPanelBLIsOpen = false;
            this.selectedRow = {};
        },
        closePreviewPanelTransportProvider(){
            this.previewPanelTransportProviderIsOpen = false;
            this.selectedRow = {};
        },
        onSelectionChange(selectedRows: Array<{ data: IFclListItem | ILclListItem }>) {
            const { rowsToAdd, rowsToRemove } = getRowsToAddAndRemove(this.listViewType, selectedRows, this.list.result);
            this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.ADD_TO_SELECTED_ROWS}`, { rows: rowsToAdd });
            this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.REMOVE_FROM_SELECTED_ROWS}`, { rows: rowsToRemove });
            rowsToRemove.forEach((r: any) => (r.selected = false));
            rowsToAdd.forEach((r: any) => (r.selected = true));
            selectedRows.forEach((r: any) => (r.data.selected = true));
        },
        onUserActionClose(type) {
            this.fetchList();
            if (type === 'send-do') {
                addNotification(NotificationComponentEnum.DP_LIST_PAGE, {
                    appearance: NotificationAppearanceEnum.success,
                    heading: i18n.t('MESSAGE.DELIVERY_PLAN_SEND_FOR_EQUIPMENT_SUCCCESS', { number: this.selectedCargoStuffingIDs }).toString(),
                });
            } else {
                addNotification(NotificationComponentEnum.DP_LIST_PAGE, {
                    appearance: NotificationAppearanceEnum.success,
                    heading: i18n.t('MESSAGE.UPDATE_DETAILS_SUCCESS_WITH_NUMBER', { number: this.selectedCargoStuffingIDs }).toString(),
                });
            }
            this.clearSelectionUpdateRows();
        },
        clearSelectionUpdateRows() {
            this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.CLEAR_SELECTED_ROWS}`);
            this.data = this.rowData.map((row: IFclListItem | ILclListItem) => ({
                ...row,
                selected: false,
            }));
        },
        onCellSeeMoreClick(row) {
            if(this.previewPanelTransportProviderIsOpen){
                this.previewPanelTransportProviderIsOpen = false;
            }
            else {
                this.previewPanelTransportProviderIsOpen = true;
                this.selectedRow = row;
            }
        },

        getTransportProviderDetails(row){
             return row?.legDetails ? row.legDetails.map((leg:ILegDetails) => ({
                    ...leg,
                    value: leg.transportProvider,
                    interactive: true,
                })):'';
        },
    },
});
</script>
