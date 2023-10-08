<template>
    <div>
        <slot name="external-table-title-bar">
            <TableTitleBar
                data-test="row-actions/table-title-bar"
                :bulk-action-bar-active="selectedRows && selectedRows.size > 0"
                :bulk-actions="userActions"
                :selected-count="selectedRows && selectedRows.size"
                :page-size="pageSize"
                :current-page="currentPage"
                :total-rows="totalRows"
                :selected-rows-data="[...(selectedRows && selectedRows.values())]"
                @deselect-all="$emit('deselect-all')"
            >
                <template #pagination>
                    <PaginationComponent :list-view-module="listViewModule" data-test="row-actions/pagination" />
                </template>
            </TableTitleBar>

            <!-- User Actions -Update Details -->
            <UpdateDetails
                v-if="showUpdateDetails"
                data-test="row-actions/update-details"
                :list-view-type="listViewType"
                :selected-rows="selectedRows"
                @update-details-closed="closeUpdateDetails"
                @update-details="$emit('details-success')"
            />

            <SendDeliverOrders
                v-if="showSendPlanConfirmation"
                data-test="row-actions/send-do"
                :list-view-type="listViewType"
                :selected-rows="selectedRows"
                @send-do-closed="showSendPlanConfirmation = false"
                @send-do="sendDeliveryOrders"
            />
        </slot>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { TableTitleBar } from '@scm-ui/table-title-bar';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import PaginationComponent from '@/components/pagination/pagination.vue';
import { getUserActions } from '@/components/user-actions/static';
import UpdateDetails from '@/components/user-actions/components/update-details/update-details.vue';
import SendDeliverOrders from '@/components/user-actions/components/send-plan/send-plan.vue';
import { ListViewTypeEnum } from '@/static';
import { ListGetterEnum } from '@/store/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'row-actions',

    components: {
        TableTitleBar,
        UpdateDetails,
        SendDeliverOrders,
        PaginationComponent,
    },

    props: {
        listViewModule: {
            type: String,
            required: true,
        },
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            required: true,
        },
    },

    data() {
        return {
            showUpdateDetails: false,
            showSendPlanConfirmation: false,
            actions: [],
        };
    },

    methods: {
        closeUpdateDetails() {
            this.showUpdateDetails = false;
        },
        sendDeliveryOrders() {
            this.$emit('send-do-success');
        },
    },

    computed: {
        selectedRows() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_SELECTED_ROWS}`];
        },
        userActions() {
            return getUserActions({
                $store: this.$store,
                listViewType: this.listViewType,
                listViewModule: this.listViewModule,
                renderComponent: this,
                router: this.$router,
                selectedRows: this.selectedRows,
            });
        },
        currentPage() {
            return this.$store.getters[`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGE}`];
        },
        pageSize() {
            return this.$store.getters[`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_LIMIT}`];
        },
        totalRows() {
            const list = this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_LIST}`];
            return list?.resultTotalCount || 0;
        },
    },
});
</script>
