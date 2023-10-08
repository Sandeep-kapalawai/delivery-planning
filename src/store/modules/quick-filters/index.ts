import { Module } from 'vuex';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';

import { QuickFilterMutationEnum, QuickFilterActionEnum, QuickFilterGetterEnum } from './static';
import { NAMESPACE as FILTER_NAMESPACE, FilterGetterEnum } from '@/store/modules/filter/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import { NAMESPACE as QUICK_FILTERS_NAMESPACE } from '@/store/modules/quick-filters/static';


import { DEMURRAGE_DETENTION_STATUSES, PLANNING_STATUSES_QUICK_FILTERS, PRIORITY_GROUPS, EXECUTION_STATUSES } from '@/components/list-view/static';
import api from '@/data/api';
import { getplanningStatusTiles, getUpdatedStatus, mapAppliedFiltersToResolvedgroupedQuickFilters } from './logic/quick-filters';
import { cloneDeep } from 'lodash';
import { IGroupedQuickFilters, IExecutionStatusGroup, ILastFreeDaysGroup, IPlanningStatusGroup, IPriorityLevelsStatusGroup } from '@/interfaces';
import { setBrowserQueryParams } from 'destination/utilities';
import { mapBrowserQueryParamsToAppliedQuickFilters } from './logic/quick-filters/browser-query-mapping';

function updateQuickFilters(filters: any) {
    return filters.map((filter: any) => {
        return {
            ...filter,
            isSelected: false,
        };
    });
}

const quickFilters: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        quickFilters: {
            planningStatus: {
                isFetching: false,
                errorMessage: '',
                result: [],
            },
            executionStatusGroups: {
                isFetching: false,
                errorMessage: '',
                result: [],
            },
            priorityLevelGroups: {
                isFetching: false,
                errorMessage: '',
                result: [],
            },
            lastFreeDaysGroups: {
                isFetching: false,
                errorMessage: '',
                result: [],
            },
        },
        groupedQuickFilters: {} as IGroupedQuickFilters,
        appliedQuickFilters: [] as Array<IGroupedQuickFilters>,
    }),

    getters: {
        [QuickFilterGetterEnum.GET_PLANNING_STATUS](state): any {
            return state.quickFilters.planningStatus;
        },
        [QuickFilterGetterEnum.GET_EXECUTION_STATUS](state): any {
            return state.quickFilters.executionStatusGroups;
        },
        [QuickFilterGetterEnum.GET_LAST_FREE_DAYS_GROUPS](state): any {
            return state.quickFilters.lastFreeDaysGroups;
        },
        [QuickFilterGetterEnum.GET_PRIORITY_LEVEL_GROUPS](state): any {
            return state.quickFilters.priorityLevelGroups;
        },
        [QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS](state) {
            return state.appliedQuickFilters;
        },
        [QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS](state): IGroupedQuickFilters {
            return state.groupedQuickFilters;
        },
    },
    mutations: {
        [QuickFilterMutationEnum.FETCH_PLANNING_STATUS.STARTED](state) {
            state.quickFilters.planningStatus.isFetching = true;

            state.quickFilters.planningStatus.errorMessage = '';
        },
        [QuickFilterMutationEnum.FETCH_PLANNING_STATUS.SUCCEEDED](state, response: any) {
            state.quickFilters.planningStatus = {
                isFetching: false,
                result: response,
                errorMessage: '',
            };
        },
        [QuickFilterMutationEnum.FETCH_PLANNING_STATUS.FAILED](state, message: string) {
            state.quickFilters.planningStatus.isFetching = false;

            state.quickFilters.planningStatus.errorMessage = message;
        },

        [QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.STARTED](state) {
            state.quickFilters.executionStatusGroups.isFetching = true;

            state.quickFilters.executionStatusGroups.errorMessage = '';
        },
        [QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.SUCCEEDED](state, response: any) {
            state.quickFilters.executionStatusGroups = {
                isFetching: false,
                result: response,
                errorMessage: '',
            };
        },
        [QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.FAILED](state, message: string) {
            state.quickFilters.executionStatusGroups.isFetching = false;

            state.quickFilters.executionStatusGroups.errorMessage = message;
        },

        [QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.STARTED](state) {
            state.quickFilters.lastFreeDaysGroups.isFetching = true;

            state.quickFilters.lastFreeDaysGroups.errorMessage = '';
        },
        [QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.SUCCEEDED](state, response: any) {
            state.quickFilters.lastFreeDaysGroups = {
                isFetching: false,
                result: response,
                errorMessage: '',
            };
        },
        [QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.FAILED](state, message: string) {
            state.quickFilters.lastFreeDaysGroups.isFetching = false;

            state.quickFilters.lastFreeDaysGroups.errorMessage = message;
        },
        [QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.STARTED](state) {
            state.quickFilters.priorityLevelGroups.isFetching = true;

            state.quickFilters.priorityLevelGroups.errorMessage = '';
        },
        [QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.SUCCEEDED](state, response: any) {
            state.quickFilters.priorityLevelGroups = {
                isFetching: false,
                result: response,
                errorMessage: '',
            };
        },
        [QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.FAILED](state, message: string) {
            state.quickFilters.priorityLevelGroups.isFetching = false;
            state.quickFilters.priorityLevelGroups.errorMessage = message;
        },

        [QuickFilterMutationEnum.SET_SELECTED_QUICK_FILTERS](state: any, { index, type }: { index: number; type: string }) {
            console.log(index,type,"typos");
            state.quickFilters[type].result[index].isSelected = true;
        },
        [QuickFilterMutationEnum.SET_DESELECT_QUICK_FILTERS](state: any, { index, type }: { index: number; type: string }) {
            state.quickFilters[type].result[index].isSelected = false;
        },
        [QuickFilterMutationEnum.CLEAR_ALL_QUICK_FILTERS](state: any) {
            Object.keys(state.quickFilters).forEach((type) => {
                const quickFiltersState = state.quickFilters[type];
                const updatedQuickFilters = updateQuickFilters(quickFiltersState.result);
                state.quickFilters[type].result = updatedQuickFilters;
            });
        },

        [QuickFilterMutationEnum.RESET_QUICK_FILTER_TYPE](state: any, type: string) {
            const quickFiltersState = state.quickFilters[type];
            const updatedQuickFilters = updateQuickFilters(quickFiltersState.result);

            state.quickFilters[type].result = updatedQuickFilters;
        },
        [QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS](state) {
            const { result: planningStatus } = state.quickFilters?.planningStatus;
            const { result: executionStatusGroups } = state.quickFilters.executionStatusGroups;
            const { result: lastFreeDaysGroups } = state.quickFilters.lastFreeDaysGroups;
            const { result: priorityLevelGroups } = state.quickFilters.priorityLevelGroups;
            // console.log(appliedFilters,'appliedfilters ')
            const updatedQuickFilters = [
                ...planningStatus
                    ?.filter((ele: IPlanningStatusGroup) => ele.isSelected)
                    .map((ele: IPlanningStatusGroup) => ({
                        id: 'planningStatus',
                        value: ele.planningStatus,
                    })),
                ...executionStatusGroups
                    ?.filter((ele: IExecutionStatusGroup) => ele.isSelected)
                    .map((ele: IExecutionStatusGroup) => ({
                        id: 'executionStatusGroups',
                        value: ele.executionStatus,
                    })),

                ...priorityLevelGroups
                    ?.filter((ele: IPriorityLevelsStatusGroup) => ele.isSelected)
                    .map((ele: IPriorityLevelsStatusGroup) => ({
                        id: 'priorityGroups',
                        value: ele.priorityLevel,
                    })),

                ...lastFreeDaysGroups
                    ?.filter((ele: ILastFreeDaysGroup) => ele.isSelected)
                    .map((ele: any) => ({
                        id: 'lastFreeDayGroups',
                        value: ele.lastFreeDaysRange,
                    })),
            ];

            console.log(updatedQuickFilters, 'updatedQuickFilters ');

            state.appliedQuickFilters = updatedQuickFilters;
        },

        [QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS](state, groupedQuickFilters: IGroupedQuickFilters) {
            state.groupedQuickFilters = cloneDeep(groupedQuickFilters);
        },
    },
    actions: {


        [QuickFilterActionEnum.INITIALIZE_APPLIED_QUICK_FILTERS]: async ({ state, commit, dispatch, rootGetters }, { listViewTypeId }: { listViewTypeId: string }) => {
          
            const resolvedAppliedFilters = rootGetters[`${listViewTypeId}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
             dispatch(QuickFilterActionEnum.FETCH_PLANNING_STATUS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_EXECUTION_STATUS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS, {listViewTypeId});
            await commit(QuickFilterMutationEnum.SET_SELECTED_QUICK_FILTERS, { index:0, type:'executionStatusGroups'});
            await commit(QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS);
           const groupedQuickFilters = mapAppliedFiltersToResolvedgroupedQuickFilters(resolvedAppliedFilters);
           await dispatch(QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS, groupedQuickFilters);     
        },

        // [QuickFilterActionEnum.INITIALIZE_APPLIED_FILTERS]: async (
        //     { state, dispatch, commit },
        //     { browserQueryParams, listViewTypeId }: { browserQueryParams: any; listViewTypeId: string },
        // ) => {
        //     debugger;
        //     console.log(browserQueryParams, 'browserQueryParams from init applied fiters');
          
        //     await dispatch(QuickFilterActionEnum.FETCH_PLANNING_STATUS, listViewTypeId);
        //     await dispatch(QuickFilterActionEnum.FETCH_EXECUTION_STATUS, listViewTypeId);
        //     const appliedFilters = mapBrowserQueryParamsToAppliedQuickFilters({ filters: state.quickFilters, browserQueryParams: {planningStatus:'Available%20for%20planning'} });
        //     console.log(appliedFilters,"appliedFilters")
        //     // const appliedFilters = mapBrowserQueryParamsToAppliedFilters({ filters: state.filters, browserQueryParams });
        //     dispatch(QuickFilterActionEnum.SET_BROWSER_QUERY_PARAMS);
        //     dispatch(QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS, {appliedFilters :'test'});
           
        //     // if (!state.isInitialized) {
        //     //     await dispatch(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId });
        //     // }
        //     // if (!isEmpty(appliedFilters)) {
        //     //     await dispatch(FilterActionEnum.SET_APPLIED_FILTERS, { appliedFilters, isSelectedFromSavedFilters: true });
        //     // } else if (!isEmpty(state.appliedFilters)) {
        //     //     debugger;
        //     //     dispatch(FilterActionEnum.SET_BROWSER_QUERY_PARAMS);
        //     // } else {
        //     //     if (!state.isInitialized) {
        //     //         dispatch(FilterActionEnum.APPLY_DEFAULT_FILTERS);
        //     //     }
        //     // }
        //     // commit(FilterMutationEnum.SET_IS_INITIALIZED, { isInitialized: true });
        // },
        [QuickFilterActionEnum.SET_BROWSER_QUERY_PARAMS]({ state }) {
            // const filters = mapAppliedFiltersToBrowserQueryParams({ filters: state.filters, appliedFilters: state.appliedFilters });
            // console.log(filters,"filters")
            setBrowserQueryParams({daysTillEstimatedTimeOfArrival: '14'} );
        },
        
        // async [QuickFilterActionEnum.SET_APPLIED_QUICK_FILTERS](
        //     { state, commit, dispatch },
        //     { appliedFilters, isSelectedFromSavedFilters }: { appliedFilters: any; isSelectedFromSavedFilters?: boolean },
        // ) {
        
        //     // const resolvedAppliedFilters = mapAppliedFiltersToResolvedAppliedFilters({ filters: state.filters, appliedFilters });
            
        //     commit(QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS, { appliedFilters });
        //     // commit(FilterMutationEnum.SET_RESOLVED_APPLIED_FILTERS, { resolvedAppliedFilters });
        //     // if (!isSelectedFromSavedFilters) {
        //     //     commit(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: {} });
        //     // }
        //     dispatch(QuickFilterActionEnum.SET_BROWSER_QUERY_PARAMS);
        // },
        
        [QuickFilterActionEnum.FETCH_PLANNING_STATUS]: async ({ commit, rootGetters }, { viewModule }: { viewModule: string }) => {
            try {
                commit(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.STARTED);
                const resolvedAppliedFilters = rootGetters[`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                console.log(resolvedAppliedFilters,'resolvedAppliedFilters')
                const sortParams = rootGetters[`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = rootGetters[`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const data = await api.quickFilters.getPlanningStatus({
                    params: {
                        ...resolvedAppliedFilters,
                        ...paginationParams,
                        sort: sortParams,
                    },
                });

                commit(
                    QuickFilterMutationEnum.FETCH_PLANNING_STATUS.SUCCEEDED,
                    getUpdatedStatus(data, 'planningStatus', getplanningStatusTiles(PLANNING_STATUSES_QUICK_FILTERS)),
                );
            } catch (e) {
                commit(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.FAILED, e);
                throw e;
            }
        },

        [QuickFilterActionEnum.FETCH_EXECUTION_STATUS]: async ({ commit, rootGetters }, { viewModule }: { viewModule: string }) => {
            try {
                commit(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.STARTED);

                const resolvedAppliedFilters = rootGetters[`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const sortParams = rootGetters[`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = rootGetters[`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const data = await api.quickFilters.getExecutionStatus({
                    params: {
                        ...resolvedAppliedFilters,
                        ...paginationParams,
                        sort: sortParams,
                    },
                });

                commit(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.SUCCEEDED, getUpdatedStatus(data, 'executionStatusGroups', EXECUTION_STATUSES));
            } catch (e) {
                commit(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.FAILED, e);
                throw e;
            }
        },
        [QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS]: async ({ commit, rootGetters }, { viewModule }: { viewModule: string }) => {
            try {
                commit(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.STARTED);

                const resolvedAppliedFilters = rootGetters[`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const sortParams = rootGetters[`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = rootGetters[`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const data = await api.quickFilters.getLastFreeDaysGroups({
                    params: {
                        ...resolvedAppliedFilters,
                        ...paginationParams,
                        sort: sortParams,
                    },
                });
                commit(
                    QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.SUCCEEDED,
                    getUpdatedStatus(data, 'lastFreeDaysRange', DEMURRAGE_DETENTION_STATUSES),
                );
            } catch (e) {
                commit(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.FAILED, e);
                throw e;
            }
        },
        [QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS]: async ({ commit, rootGetters }, { viewModule }: { viewModule: string }) => {
            try {
                commit(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.STARTED);

                const resolvedAppliedFilters = rootGetters[`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
                const sortParams = rootGetters[`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = rootGetters[`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const data = await api.quickFilters.getPriorityLevelGroups({
                    params: {
                        ...resolvedAppliedFilters,
                        ...paginationParams,
                        sort: sortParams,
                    },
                });

                commit(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.SUCCEEDED, getUpdatedStatus(data, 'priorityLevel', PRIORITY_GROUPS));
            } catch (e) {
                commit(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.FAILED, e);
                throw e;
            }
        },

        [QuickFilterActionEnum.GROUPED_QUICK_FILTERS]: async ({ state, commit, getters }, { viewModule }: { viewModule: string }) => {
            commit(QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS);
            const appliedQuickFilters: Array<IGroupedQuickFilters> = getters[`${QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS}`];
         console.log(appliedQuickFilters,'appliedQuickFilters from groiped')
            const groupedQuickFilters = mapAppliedFiltersToResolvedgroupedQuickFilters(appliedQuickFilters);

            commit(QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS, groupedQuickFilters);
        },

        [QuickFilterActionEnum.RESET_QUICK_FILTER_TYPE]({ commit }, { type }: { type: string }) {
            commit(QuickFilterMutationEnum.RESET_QUICK_FILTER_TYPE, type);
        },
    },
};

export default quickFilters;
