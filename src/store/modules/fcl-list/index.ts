import { Module } from 'vuex';
import axios from 'axios';
import { clone } from 'lodash';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';
import { getConsigneesBECode } from 'destination/utilities';
import { ListGetterEnum, ListMutationEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import { NAMESPACE as QUICK_FILTERS_NAMESPACE, QuickFilterGetterEnum } from '@/store/modules/quick-filters/static';
import quickFilter from '../quick-filters';
import filter from '../filter';
import tableConfiguration from '../table-configuration';
import sorting from '../sorting';
import pagination from '../pagination';
import api from '@/data/api';
import { IFclList, IFclListItem } from '@/interfaces';
import { parseFinalDeliveryLocationFromApiResponse } from '@/utilities';
import { NAMESPACE as FILTER_NAMESPACE, FilterGetterEnum } from '@/store/modules/filter/static';
import { getDeliveryPlanId } from '@/logic';
import { ListViewTypeEnum } from '@/static';

const parseFinalDeliveryLocations = (data: any): void => {
    return data?.result?.map((item: any) => ({
        ...item,
        finalDeliveryLocations: parseFinalDeliveryLocationFromApiResponse(item.customerFinalPlaceOfDeliveryFacilityDetails),
    }));
};

const fclList: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        list: {
            isFetching: false,
            cancelToken: null,
            result: [],
            resultTotalCount: 0,
        },
        importExportAnExcel: {
            isExporting: false,
            isImporting: false,
            isFileImported: false,
        },
        selectedRows: new Map(),
    }),

    getters: {
        [ListGetterEnum.GET_LIST](state): {
            isFetching: boolean;
            result: Array<IFclListItem>;
            resultTotalCount: number;
        } {
            return state.list;
        },
        [ListGetterEnum.GET_IMPORT_EXCEL](state): {
            isImporting: boolean;
            isFileImported: boolean;
        } {
            return state.importExportAnExcel;
        },
        [ListGetterEnum.GET_SELECTED_ROWS](state) {
            return state.selectedRows;
        },
    },

    mutations: {
        [ListMutationEnum.FETCH_LIST.STARTED](state) {
            if (state.list.cancelToken !== null) {
                state.list.cancelToken.cancel();
            }

            state.list.isFetching = true;
            state.list.cancelToken = axios.CancelToken.source();
        },
        [ListMutationEnum.FETCH_LIST.SUCCEEDED](state, response: IFclList) {
            state.list = {
                isFetching: false,
                cancelToken: null,
                result: response.result,
                resultTotalCount: response.resultTotalCount,
            };
        },
        [ListMutationEnum.FETCH_LIST.FAILED](state) {
            state.list.isFetching = false;
            state.list.cancelToken = null;
        },
        [ListMutationEnum.ADD_TO_SELECTED_ROWS](state, { rows }: { rows: Array<IFclListItem> }) {
            rows.forEach((row) => {
                const deliveryPlanId = getDeliveryPlanId(ListViewTypeEnum.fcl, row);
                if (state.selectedRows.has(deliveryPlanId)) {
                    return;
                }

                state.selectedRows.set(deliveryPlanId, row);
            });
            state.selectedRows = clone(state.selectedRows);
        },
        [ListMutationEnum.REMOVE_FROM_SELECTED_ROWS](state, { rows }: { rows: Array<IFclListItem> }) {
            rows.forEach((row) => {
                const deliveryPlanId = getDeliveryPlanId(ListViewTypeEnum.fcl, row);
                if (!state.selectedRows.has(deliveryPlanId)) {
                    return;
                }

                state.selectedRows.delete(deliveryPlanId);
            });
            state.selectedRows = clone(state.selectedRows);
        },
        [ListMutationEnum.CLEAR_SELECTED_ROWS](state) {
            state.selectedRows = new Map();
        },
        [ListMutationEnum.IMPORT_AN_EXCEL.STARTED](state) {
            state.importExportAnExcel.isImporting = true;
            state.importExportAnExcel.isFileImported = false;
        },
        [ListMutationEnum.IMPORT_AN_EXCEL.SUCCEEDED](state, data) {
            state.importExportAnExcel.isImporting = false;
            state.importExportAnExcel.isFileImported = true;
        },
        [ListMutationEnum.IMPORT_AN_EXCEL.FAILED](state) {
            state.importExportAnExcel.isImporting = false;
            state.importExportAnExcel.isFileImported = false;
        },
        [ListMutationEnum.CLEAR_IMPORT_FILES](state) {
            state.importExportAnExcel.isImporting = false;
            state.importExportAnExcel.isFileImported = false;
        },
        [ListMutationEnum.EXPORT_EXCEL.STARTED](state) {
            state.importExportAnExcel.isExporting = true;
        },
        [ListMutationEnum.EXPORT_EXCEL.SUCCEEDED](state) {
            state.importExportAnExcel.isExporting = false;
        },
        [ListMutationEnum.EXPORT_EXCEL.FAILED](state) {
            state.importExportAnExcel.isExporting = false;
        },
    },

    actions: {
        async [ListActionEnum.FETCH_LIST]({ state, commit, getters }) {
            try {
                commit(ListMutationEnum.FETCH_LIST.STARTED);
                const allConsigneesBECode: Array<string> = getConsigneesBECode();
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = getters[`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const appliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTERS}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const headers = {
                    customers: appliedFilters?.Consignee?.join() || allConsigneesBECode?.join() || undefined,
                };

                const data = await api.fcl.getFclList({
                    headers,
                    params: {
                        ...paginationParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        sort: sortParams,
                    },
                    cancelToken: state.list.cancelToken?.token,
                });
                const parsedData = {
                    ...data,
                    result: parseFinalDeliveryLocations(data),
                };

                commit(ListMutationEnum.FETCH_LIST.SUCCEEDED, parsedData);
            } catch (error: any) {
                if (!axios.isCancel(error)) {
                    commit(ListMutationEnum.FETCH_LIST.FAILED, error?.message);
                    throw error;
                }
            }
        },
        [ListActionEnum.ADD_TO_SELECTED_ROWS]({ commit }, { rows }) {
            commit(ListMutationEnum.ADD_TO_SELECTED_ROWS, { rows });
        },
        [ListActionEnum.REMOVE_FROM_SELECTED_ROWS]({ commit }, { rows }) {
            commit(ListMutationEnum.REMOVE_FROM_SELECTED_ROWS, { rows });
        },
        [ListActionEnum.CLEAR_SELECTED_ROWS]({ commit }) {
            commit(ListMutationEnum.CLEAR_SELECTED_ROWS);
        },
        [ListActionEnum.IMPORT_AN_EXCEL]: async ({ commit, getters }, file) => {
            try {
                commit(ListMutationEnum.IMPORT_AN_EXCEL.STARTED);
                const data = await api.fcl.importServicePlan(file);
                commit(ListMutationEnum.IMPORT_AN_EXCEL.SUCCEEDED, data);
                return data;
            } catch (e) {
                commit(ListMutationEnum.IMPORT_AN_EXCEL.FAILED, e);
                throw e;
            }
        },
        async [ListActionEnum.EXPORT_CSA_BULK_UPDATE](
            { commit, getters, rootGetters },
            { page, deliveryPlanId, shouldExportGasCheckDetailsOnly }: { page: number; deliveryPlanId?: string; shouldExportGasCheckDetailsOnly: boolean },
        ) {
            try {
                commit(ListMutationEnum.EXPORT_EXCEL.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const data = await api.fcl.getCSAExportExcelForBulkEdit({
                    params: {
                        sort: sortParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        page,
                        deliveryPlanId,
                        shouldExportGasCheckDetailsOnly,
                    },
                });
                commit(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
                return data;
            } catch (error: any) {
                commit(ListMutationEnum.EXPORT_EXCEL.FAILED, error?.message);
                throw error;
            }
        },
        async [ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE]({ commit, getters }, { page, deliveryPlanId }: { page: number; deliveryPlanId?: string }) {
            try {
                commit(ListMutationEnum.EXPORT_EXCEL.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const data = await api.fcl.getConsigneeExportExcelForBulkEdit({
                    params: {
                        sort: sortParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        page,
                        deliveryPlanId,
                    },
                });
                commit(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
                return data;
            } catch (error: any) {
                commit(ListMutationEnum.EXPORT_EXCEL.FAILED, error?.message);
                throw error;
            }
        },
        async [ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS](
            { commit, getters },
            { uiId, page, deliveryPlanId }: { uiId: string; page: number; deliveryPlanId?: string },
        ) {
            try {
                commit(ListMutationEnum.EXPORT_EXCEL.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const data = await api.fcl.getCSAExportExcelForSelectedColumns({
                    params: {
                        sort: sortParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        includeUserPreferences: true,
                        uiId,
                        page,
                        deliveryPlanId,
                    },
                });
                commit(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
                return data;
            } catch (error: any) {
                commit(ListMutationEnum.EXPORT_EXCEL.FAILED, error?.message);
                throw error;
            }
        },
        async [ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS]({ commit, getters }, { page, deliveryPlanId }: { page: number; deliveryPlanId?: string }) {
            try {
                commit(ListMutationEnum.EXPORT_EXCEL.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const data = await api.fcl.getCSAExportExcelForAllColumns({
                    params: {
                        sort: sortParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        page,
                        deliveryPlanId,
                    },
                });
                commit(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
                return data;
            } catch (error: any) {
                commit(ListMutationEnum.EXPORT_EXCEL.FAILED, error?.message);
                throw error;
            }
        },
        async [ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS]({ commit, getters }, { page, deliveryPlanId }: { page: number; deliveryPlanId?: string }) {
            try {
                commit(ListMutationEnum.EXPORT_EXCEL.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const resolvedAppliedFilters = getters[`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const resolvedAppliedQuickFilters = getters[`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS}`];

                const data = await api.fcl.getConsigneeExportExcelForAllColumns({
                    params: {
                        sort: sortParams,
                        ...resolvedAppliedFilters,
                        ...resolvedAppliedQuickFilters,
                        page,
                        deliveryPlanId,
                    },
                });
                commit(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
                return data;
            } catch (error: any) {
                commit(ListMutationEnum.EXPORT_EXCEL.FAILED, error?.message);
                throw error;
            }
        },
    },

    modules: {
        filter,
        pagination,
        sorting,
        tableConfiguration,
        quickFilter,
    },
};

export default fclList;
