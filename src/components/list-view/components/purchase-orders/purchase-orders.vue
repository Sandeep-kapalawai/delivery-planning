<template>
    <div class="purchase-orders-section">
        <DestinationNotifications :component="NotificationComponentEnum.DP_PO_DETAILS" :position="NotificationPositionEnum.absolute" :top="65" />

        <div class="summary-section">
            <Row :gutter="28" class="summary_row">
                <Column :xs="12" :md="3" :lg="3" class="header-section_column_container">
                    {{ $t('FIELD.PACKAGES') }}: <span class="summary-value"> {{ totalPackages }}</span>
                </Column>
                <Column :xs="12" :md="3" :lg="3" class="header-section_column_container">
                    {{ $t('FIELD.QUANTITY') }}: <span class="summary-value"> {{ totalQuantity }}</span>
                </Column>
                <Column :xs="12" :md="3" :lg="3" class="header-section_column_container">
                    {{ $t('FIELD.WEIGHT') }}: <span class="summary-value"> {{ totalGrossWeight }}</span>
                </Column>
                <Column :xs="12" :md="3" :lg="3" class="header-section_column_container">
                    {{ $t('FIELD.VOLUME') }}: <span class="summary-value">{{ totalVolume }} </span>
                </Column>
            </Row>
        </div>

        <div class="table-wrapper">
            <SCMTable
                :table-id="tableId"
                :column-defs="columnDefs"
                :default-col-def="defaultColDef"
                :is-loading="(list && list.isFetching) || false"
                :row-data="rowData"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import i18n from '@/i18n';
import { Row, Column } from '@scm-ui/grid-system';
import { Table as SCMTable } from '@scm-ui/table';
import DestinationNotifications from 'destination/components/notifications';
import { getNotificationMessageFromAPIErrors, addNotification, removeNotification } from 'destination/utilities';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { getDefaultColDef, getColumnDefs, getChildTableColumnDefs } from './static';
import { ListViewTypeEnum, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { ICargoStuffingDetails, IFclListItem, ILclListItem, StockKeepingUnitData } from '@/interfaces';
import { getDeliveryPlanId, getDeliveryPlanIdQueryParam } from '@/logic';
import { ListGetterEnum, ListActionEnum } from '@/store/static';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationGetterEnum,
    TableConfigurationActionEnum,
} from '@/store/modules/table-configuration/static';
import { NAMESPACE as PO_LIST_NAMESPACE } from '@/store/modules/purchase-orders/static';

import './styles/purchase-orders.scss';

enum NOTIFICATION_ID {
    FETCH_PURCHASE_ORDERS = 'FETCH_PURCHASE_ORDERS',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'PurchaseOrders',

    i18n,

    components: {
        Row,
        Column,
        SCMTable,
        DestinationNotifications,
    },

    props: {
        notificationComponent: {
            type: String as PropType<NotificationComponentEnum>,
            default: NotificationComponentEnum.DP_PO_DETAILS,
        },
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        listViewModule: {
            type: String,
            required: true,
        },
        selectedRow: {
            type: Object as PropType<ILclListItem | IFclListItem | ICargoStuffingDetails>,
            required: true,
        },
    },

    data() {
        return {
            NotificationComponentEnum: NotificationComponentEnum,
            NotificationPositionEnum: NotificationPositionEnum,
            rowData: [],
        };
    },

    computed: {
        tableId() {
            return this.$store.getters[`${PO_LIST_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_TABLE_ID}`];
        },
        defaultColDef() {
            return this.$store.getters[`${PO_LIST_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF}`];
        },
        columnDefs() {
            return this.$store.getters[`${PO_LIST_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_COLUMN_DEFS}`];
        },
        list() {
            return this.$store.getters[`${PO_LIST_NAMESPACE}/${ListGetterEnum.GET_LIST}`];
        },
        skuSummary() {
            return this.list.stockKeepingUnitDataSummary;
        },
        totalPackages() {
            return this.skuSummary?.packagesWithUnitType?.join(', ');
        },
        totalQuantity() {
            return this.skuSummary?.quantitiesWithUnitType?.join(', ');
        },
        totalGrossWeight() {
            return this.skuSummary?.grossWeightsWithUnitType?.join(', ');
        },
        totalVolume() {
            return this.skuSummary?.volumesWithUnitType?.join(', ');
        },
    },

    watch: {
        list() {
            this.rowData = this.list.poskUs?.map((row: any, index: number) => ({
                ...row,
                grossWeightsWithUnitType: row.grossWeightsWithUnitType[0], //Returns an array with one element every time from backend
                packagesWithUnitType: row.packagesWithUnitType[0],
                quantitiesWithUnitType: row.quantitiesWithUnitType[0],
                stockKeepingUnitData: row.stockKeepingUnitData[0],
                volumesWithUnitType: row.volumesWithUnitType[0],
                columnDefs: getChildTableColumnDefs({ listViewType: this.listViewType }),
                rowData: row?.stockKeepingUnitData.map((ele: StockKeepingUnitData[]) => ele),
            }));
        },
    },

    async created() {
        this.initializeTableConfiguration();
        this.fetchList();
    },

    destroyed() {
        removeNotification(this.notificationComponent, NOTIFICATION_ID.FETCH_PURCHASE_ORDERS);
    },

    methods: {
        initializeTableConfiguration() {
            this.$store.dispatch(`${PO_LIST_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.INITIALIZE}`, {
                tableId: 'purchase-orders-list-table',
                defaultColDef: getDefaultColDef({ listViewType: this.listViewType }),
                columnDefs: getColumnDefs({ listViewType: this.listViewType }),
            });
        },
        async fetchList() {
            removeNotification(this.notificationComponent, NOTIFICATION_ID.FETCH_PURCHASE_ORDERS);

            try {
                const deliveryPlanId = getDeliveryPlanId(this.listViewType, this.selectedRow);
                const params = getDeliveryPlanIdQueryParam(this.listViewType, deliveryPlanId);
                await this.$store.dispatch(`${PO_LIST_NAMESPACE}/${ListActionEnum.FETCH_LIST}`, params);
            } catch (error: any) {
                addNotification(this.notificationComponent, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_PURCHASE_ORDERS, error }));
            }
        },
    },
});
</script>
