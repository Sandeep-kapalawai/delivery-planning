<template>
    <div class="transport-plans">
        <mc-loading-indicator v-if="isLoading" class="destination_mc-loading-indicator" />
        <mc-c-accordion class="transport-plans-accordian">
            <mc-c-accordion-item
                :title="accordianTitle"
                id="1"
                :expanded="toggleAccordianitems"
                :fit="mdsComponentFit.accordion"
                class="accordian-title"
                data-spec="transport-plans/accordian"
            >
                <div v-if="row.newOrders.length" class="transport-plans-item" :title="$t('FIELD.NEW_ORDERS')">
                    <span class="order-type"> {{ $t('FIELD.NEW_ORDERS') }}</span>
                    <TableComponent
                        :table-id="tableId"
                        :is-loading="isLoading"
                        :stripes="false"
                        :row-lines="3"
                        :suppress-drag-leave-hides-columns="true"
                        :default-col-def="defaultColDef"
                        :column-defs="columnDefs"
                        :row-data="newOrders"
                        data-spec="transport-plans/new-orders"
                        @cell-value-blurred="onCommentChange"
                        @cell-value-changed="onReasonCodeChange"
                        @multiple-values-cell-see-more="handleSeeMoreClick"
                    >
                    </TableComponent>
                </div>

                <div v-if="row.revisedOrders.length" class="transport-plans-item" :title="$t('FIELD.REVISED_ORDERS')">
                    <span class="order-type"> {{ $t('FIELD.REVISED_ORDERS') }}</span>
                    <TableComponent
                        :table-id="tableId"
                        :is-loading="isLoading"
                        :stripes="false"
                        :row-lines="2"
                        :suppress-drag-leave-hides-columns="true"
                        :default-col-def="defaultColDef"
                        :column-defs="columnDefs"
                        :row-data="revisedOrders"
                        data-spec="transport-plans/revised-orders"
                        @cell-value-blurred="onCommentChange"
                        @cell-value-changed="onReasonCodeChange"
                        @multiple-values-cell-see-more="handleSeeMoreClick"
                    >
                    </TableComponent>
                </div>

                <div v-if="row.cancelledOrders.length" class="transport-plans-item" :title="$t('FIELD.CANCELLED_ORDERS')">
                    <span class="order-type">{{ $t('FIELD.CANCELLED_ORDERS') }} </span>
                    <TableComponent
                        :table-id="tableId"
                        :is-loading="isLoading"
                        :stripes="false"
                        :row-lines="2"
                        :suppress-drag-leave-hides-columns="true"
                        :default-col-def="defaultColDef"
                        :column-defs="columnDefs"
                        :row-data="cancelledOrders"
                        data-spec="transport-plans/cancelled-orders"
                        @cell-value-blurred="onCommentChange"
                        @cell-value-changed="onReasonCodeChange"
                        @multiple-values-cell-see-more="handleSeeMoreClick"
                    >
                    </TableComponent>
                </div>
            </mc-c-accordion-item>
        </mc-c-accordion>
        <preview-panel :is-open="isPreviewPanelOpen" :title="selectedColumn" panel-width="600px" @close-panel="isPreviewPanelOpen = false">
            <slot>
                <div v-for="(item, index) in previewPanelLinks" :key="index">
                    <span class="multiple-value-cell__item">
                        {{ item.value }}
                    </span>
                </div>
            </slot>
        </preview-panel>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-loading-indicator';
import Vue, { PropType } from 'vue';
import { Table as TableComponent } from '@scm-ui/table';
import { PreviewPanel } from '@scm-ui/preview-panel';
import i18n from '@/i18n';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { clone } from 'lodash';
import {
    DeliveryOrdersActionEnum,
    DeliveryOrdersGetterEnum,
    DeliveryOrdersMutationEnum,
    NAMESPACE as DELIVERY_ORDERS_NAMESPACE,
} from '@/store/modules/delivery-orders/static';
import { ListViewTypeEnum, MDS_COMPONENT_FIT, NotificationComponentEnum } from '@/static';
import { getFormattedDateTime, getNotificationMessageFromAPIErrors, addNotification, removeNotification } from 'destination/utilities';
import {
    TableConfigurationGetterEnum,
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
} from '@/store/modules/table-configuration/static';
import { getColumnDefs, getDefaultColDef, getColumnDefsforMultiSelect } from './static/table-config';
import { IDeliveryPlan, IReasonCodes, ITransportplanItems } from '@/interfaces';

import './styles/transport-plans.scss';

enum NOTIFICATION_ID {
    FETCH_REASON_CODES = 'DP_FETCH_REASON_CODES',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'transport-plans',

    i18n,

    components: {
        TableComponent,
        PreviewPanel,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            required: true,
        },
        selectedItems: {
            type: Array as PropType<Array<number>>,
            required: false,
            default: () => [],
        },
        transportPlans: {
            type: Array,
            required: true,
            default: () => [],
        },
        row: {
            type: Object as PropType<ITransportplanItems>,
            required: true,
            default: {} as ITransportplanItems,
        },
    },

    data() {
        return {
            isPreviewPanelOpen: false,
            previewPanelLinks: [],
            selectedColumn: '',
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isLoading() {
            return this.deliveryOrdersInfo.isFetching || this.reasonCodes?.isFetching;
        },
        deliveryOrdersInfo() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS}`];
        },
        tableId() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_TABLE_ID}`];
        },
        defaultColDef() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF}`];
        },
        columnDefs() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_COLUMN_DEFS}`];
        },
        reasonCodes() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersGetterEnum.GET_REASON_CODES}`];
        },
        renderColumnDefs() {
            return this.selectedItems?.length > 1
                ? getColumnDefsforMultiSelect({ listViewType: this.listViewType })
                : getColumnDefs({ listViewType: this.listViewType });
        },
        newOrders() {
            return this.row.newOrders.map((row: IDeliveryPlan, index: number) => this.mapRow(row, index));
        },
        revisedOrders() {
            return this.row.revisedOrders.map((row: IDeliveryPlan, index: number) => this.mapRow(row, index));
        },
        cancelledOrders() {
            return this.row.cancelledOrders.map((row: IDeliveryPlan, index: number) => this.mapRow(row, index));
        },
        toggleAccordianitems() {
            return this.transportPlans?.length <= 2;
        },
        accordianTitle() {
            return `${this.row.transportProviderName} (${this.row.transportProviderCode})`;
        },
        updateReasonCodes() {
            return this.reasonCodes.result.map((row: IReasonCodes) => this.mappedReasonCodes(row));
        },
    },

    async created() {
        this.initializeTableConfiguration();
        this.fetchReasonCodes();
    },

    methods: {
        initializeTableConfiguration() {
            this.$store.dispatch(`${DELIVERY_ORDERS_NAMESPACE}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.INITIALIZE}`, {
                tableId: 'transport-plans-table',
                defaultColDef: getDefaultColDef({ listViewType: this.listViewType }),
                columnDefs: this.renderColumnDefs,
            });
        },
        async fetchReasonCodes() {
            removeNotification(NotificationComponentEnum.DP_SEND_PLAN, NOTIFICATION_ID.FETCH_REASON_CODES);

            try {
                await this.$store.dispatch(`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersActionEnum.FETCH_REASON_CODES}`);
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_SEND_PLAN, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_REASON_CODES, error }));
            }
        },
        mapRow(row, index) {
            return {
                ...row,
                id: index,
                title:'test',
                reasonCodes: {
                    selectedValue: '',
                    dropdownOptions: this.updateReasonCodes,
                },
                reasonCodeId: '',
                comment: '',
                transportModes: row.transportModeType?.split(',').map((element:string) => {
                    return { value: element };
                }),
                deliveryDateTimes: row.plannedDeliveryDateTimes.map((ele, _) => {
                    return {
                        value: getFormattedDateTime({
                            date: ele.dateTime,
                            timeZone: ele.timeZone,
                        }),
                    };
                }),
            };
        },
        mappedReasonCodes(row) {
            return {
                ...row,
                value: row.reasonCodeId,
                label: row.reasonCodeName,
            };
        },
        onReasonCodeChange(data) {
            const { column, newValue, data: rowData } = data;
            if (column === 'reasonCodes') {
                const keysToDelete = ['comment', 'reasonCodes', 'reasonCodeId', 'deliveryDateTimes', 'id', 'transportModes'];
                const updatedOrder = {} as any;;

                for (const key of Object.keys(rowData)) {
                    if (!keysToDelete.includes(key)) {
                        updatedOrder[key] = rowData[key];
                    }
                }
                this.$store.commit(`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_REASON_CODE}`, {
                    order: clone(updatedOrder),
                    reasonCodeId: newValue.selectedValue,
                });
            }
        },
        onCommentChange(data) {
            const { column, value, data: rowData } = data;
            if (column === 'comments') {
                const keysToDelete = ['comment', 'reasonCodes', 'reasonCodeId', 'deliveryDateTimes', 'id', 'transportModes'];
                const updatedOrder = {} as any;;

                for (const key of Object.keys(rowData)) {
                    if (!keysToDelete.includes(key)) {
                        updatedOrder[key] = rowData[key];
                    }
                }

                this.$store.commit(`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_COMMENT}`, {
                    order: clone(updatedOrder),
                    comment: value,
                });
            }
        },
        handleSeeMoreClick(data, field) {
            if (this.isPreviewPanelOpen) {
                this.isPreviewPanelOpen = false;
            } else {
                this.previewPanelLinks = field === 'transportModes' ? data.transportModes : data.deliveryDateTimes;
                this.selectedColumn = field === 'transportModes' ? i18n.t('FIELD.TRANSPORT_MODE').toString() : i18n.t('FIELD.PLANNED_DATE_TIME').toString();
                this.isPreviewPanelOpen = true;
            }
        },
    },
});
</script>
