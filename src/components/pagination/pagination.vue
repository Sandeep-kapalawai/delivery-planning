<template>
    <div class="pagination">
        <SCMPagination
            :data-test="`pagination/${tableId}`"
            :page-size-options="pageSizeOptions"
            :current-page="currentPage"
            :page-size="pageSize"
            :total-rows="totalRows"
            @update-current-page="onUpdateCurrentPage"
            @update-page-size="onUpdatePageSize"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Pagination as SCMPagination } from '@scm-ui/pagination';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { ListGetterEnum } from '@/store/static';
import { NAMESPACE as TABLE_CONFIGURATION_NAMESPACE, TableConfigurationGetterEnum } from '@/store/modules/table-configuration/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum, PaginationActionEnum } from '@/store/modules/pagination/static';

import './styles/pagination.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'pagination-component',

    components: {
        SCMPagination,
    },

    props: {
        listViewModule: {
            type: String,
            required: true,
        },
    },

    computed: {
        tableId() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_TABLE_ID}`];
        },
        pageSizeOptions() {
            return this.$store.getters[`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGE_SIZE_OPTIONS}`];
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

    methods: {
        onUpdateCurrentPage(page: number) {
            this.$store.dispatch(`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationActionEnum.SET_PAGE}`, { page });
        },
        onUpdatePageSize(limit: number) {
            this.$store.dispatch(`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationActionEnum.SET_LIMIT}`, { limit });
            this.$store.dispatch(`${this.listViewModule}/${PAGINATION_NAMESPACE}/${PaginationActionEnum.SET_PAGE}`, { page: 1 });
        },
    },
});
</script>
