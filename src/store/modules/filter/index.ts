import { Module } from 'vuex';
import { isEmpty, cloneDeep, keyBy } from 'lodash';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { FilterMutationEnum, FilterActionEnum, FilterGetterEnum } from './static';
import { IFilterField, IAppliedFilters, IFilterSection, ISavedFilterItem, ISavedFilters } from '@/interfaces';
import axios, { CancelToken } from 'axios';
import api from '@/data/api';
import {
    getGenericAutoCompleteResults,
    getUniqueConsignees,
    mapAppliedFiltersToBrowserQueryParams,
    mapBrowserQueryParamsToAppliedFilters,
    mapAppliedFiltersToResolvedAppliedFilters,
    getDefaultFilter,
    getFormattedSavedFilters,
    getLastUpdatedByAutoCompleteResult,
} from './logic';
import { setBrowserQueryParams, getAPIErrorMessages } from 'destination/utilities';
import { mapAppliedFiltersToSaveFiltersPayload, mapSavedFiltersToAppliedFilters } from './logic/saved-filter-mapping';

const filter: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        filters: { filtersArray: [], filtersMap: {}, fieldMap: {} },
        appliedFilters: {},
        resolvedAppliedFilters: {},
        savedFilters: { isFetching: false, list: [], errorMessage: [], appliedFilter: {} as ISavedFilterItem },
        isInitialized: false,
    }),

    getters: {
        [FilterGetterEnum.GET_SECTIONS](state): IAppliedFilters {
            return state.filters.filtersArray.filter((x) => !x.isQuickFilter);
        },
        [FilterGetterEnum.GET_QUICK_SECTIONS](state): IAppliedFilters {
            return state.filters.filtersArray.filter((x) => x.isQuickFilter);
        },
        [FilterGetterEnum.GET_APPLIED_FILTERS](state): IAppliedFilters {
            console.log(state.appliedFilters);
            return state.appliedFilters;
        },
        [FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS](state): IAppliedFilters {
            return state.resolvedAppliedFilters;
        },
        [FilterGetterEnum.GET_SAVED_FILTERS](state): IAppliedFilters {
            //excluding system default
            const savedFiltersWithoutSystemDefault = state.savedFilters.list.filter((item: ISavedFilterItem) => !item.isSystemDefault);
            return savedFiltersWithoutSystemDefault;
        },
        [FilterGetterEnum.GET_SAVED_FILTER_LOADING_STATUS](state) {
            return state.savedFilters.isFetching;
        },
        [FilterGetterEnum.GET_APPLIED_FILTER_IN_SAVE_FILTERS](state) {
            return state.savedFilters.appliedFilter;
        },
        [FilterGetterEnum.GET_SAVED_FILTER_ERROR_MESSAGE](state) {
            return state.savedFilters.errorMessage;
        },
    },

    mutations: {
        [FilterMutationEnum.SET_FILTERS](state, { filters }: { filters: Array<IFilterSection> }) {
            const filtersClone = cloneDeep(filters);
            state.filters = {
                filtersArray: filtersClone,
                filtersMap: keyBy(filtersClone, 'id'),
                fieldMap: filtersClone.reduce((acc, curr) => {
                    return { ...acc, ...keyBy(curr.fields, 'id') };
                }, {}),
            };
        },
        [FilterMutationEnum.SET_APPLIED_FILTERS](state, { appliedFilters }: { appliedFilters: IAppliedFilters }) {
            state.appliedFilters = cloneDeep(appliedFilters);
        },
        [FilterMutationEnum.SET_IS_INITIALIZED](state, { isInitialized }: { isInitialized: boolean }) {
            state.isInitialized = isInitialized;
        },
        [FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS](state, { appliedFilters }: { appliedFilters: ISavedFilterItem }) {
            state.savedFilters.appliedFilter = appliedFilters;
        },
        [FilterMutationEnum.SET_RESOLVED_APPLIED_FILTERS](state, { resolvedAppliedFilters }: { resolvedAppliedFilters: IAppliedFilters }) {
            state.resolvedAppliedFilters = cloneDeep(resolvedAppliedFilters);
        },
        [FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED](state, { filterField }: { filterField: IFilterField }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            if (fetchOptions.cancelToken !== null) {
                fetchOptions.cancelToken.cancel();
            }

            fetchOptions.isFetching = true;
            fetchOptions.cancelToken = axios.CancelToken.source();
        },
        [FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.SUCCEEDED](
            state,
            { filterField, consignees }: { filterField: IFilterField; consignees: Array<{ value: string; secondary: string }> },
        ) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            filterField.multiselect.options = consignees;

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
        [FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED](state, { filterField, errors }: { filterField: IFilterField; errors: Array<string> }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
        [FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED](state, { filterField }: { filterField: IFilterField }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            if (fetchOptions.cancelToken !== null) {
                fetchOptions.cancelToken.cancel();
            }

            fetchOptions.isFetching = true;
            fetchOptions.cancelToken = axios.CancelToken.source();
        },
        [FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED](
            state,
            { filterField, filterSearchResult }: { filterField: IFilterField; filterSearchResult: Array<any> },
        ) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            filterField.multiselect.options = filterSearchResult;

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
        [FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED](state, { filterField, errors }: { filterField: IFilterField; errors: Array<string> }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
        [FilterMutationEnum.FETCH_SAVED_FILTERS.STARTED]: (state) => {
            state.savedFilters.isFetching = true;
        },
        [FilterMutationEnum.FETCH_SAVED_FILTERS.SUCCEEDED]: (state, { result }) => {
            state.savedFilters.list = result;
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.FETCH_SAVED_FILTERS.FAILED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.SAVE_FILTERS.STARTED]: (state) => {
            state.savedFilters.isFetching = true;
        },
        [FilterMutationEnum.SAVE_FILTERS.SUCCEEDED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.SAVE_FILTERS.FAILED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.UPDATE_DEFAULT_FILTERS.STARTED]: (state) => {
            state.savedFilters.isFetching = true;
        },
        [FilterMutationEnum.UPDATE_DEFAULT_FILTERS.SUCCEEDED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.UPDATE_DEFAULT_FILTERS.FAILED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.DELETE_SAVED_FILTERS.STARTED]: (state) => {
            state.savedFilters.isFetching = true;
        },
        [FilterMutationEnum.DELETE_SAVED_FILTERS.SUCCEEDED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.DELETE_SAVED_FILTERS.FAILED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED]: (state) => {
            state.savedFilters.isFetching = true;
        },
        [FilterMutationEnum.APPLY_DEFAULT_FILTERS.SUCCEEDED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.APPLY_DEFAULT_FILTERS.FAILED]: (state) => {
            state.savedFilters.isFetching = false;
        },
        [FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED](state, { filterField }: { filterField: IFilterField }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            if (fetchOptions.cancelToken !== null) {
                fetchOptions.cancelToken.cancel();
            }

            fetchOptions.isFetching = true;
            fetchOptions.cancelToken = axios.CancelToken.source();
        },
        [FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED](
            state,
            { filterField, users }: { filterField: IFilterField; users: Array<{ value: string; secondary: string }> },
        ) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            filterField.multiselect.options = users;

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
        [FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED](state, { filterField, errors }: { filterField: IFilterField; errors: Array<string> }) {
            if (!filterField.multiselect?.fetchOptions) {
                return;
            }

            const fetchOptions = filterField.multiselect.fetchOptions;
            fetchOptions.isFetching = false;
            fetchOptions.cancelToken = null;
        },
    },

    actions: {
        [FilterActionEnum.INITIALIZE_FILTERS]({ commit }, { filters }) {
            commit(FilterMutationEnum.SET_FILTERS, { filters });
        },
        [FilterActionEnum.FETCH_SAVED_FILTERS]: async ({ commit }, { listViewTypeId }: { listViewTypeId: string }) => {
            try {
                commit(FilterMutationEnum.FETCH_SAVED_FILTERS.STARTED);
                const result = await getSavedFiltersFromAPI(listViewTypeId);
                commit(FilterMutationEnum.FETCH_SAVED_FILTERS.SUCCEEDED, { result });
            } catch (e) {
                commit(FilterMutationEnum.FETCH_SAVED_FILTERS.FAILED);
            }
        },
        [FilterActionEnum.APPLY_DEFAULT_FILTERS]: async ({ commit, state, dispatch }) => {
            try {
                const savedFiltersClone = cloneDeep(state.savedFilters.list);
                commit(FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED);
                const defaultFilter = getDefaultFilter({ savedFilters: savedFiltersClone });
                if (defaultFilter) {
                    dispatch(FilterActionEnum.APPLY_SAVED_FILTERS, { savedFilters: defaultFilter });
                    commit(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: defaultFilter });
                }
                commit(FilterMutationEnum.APPLY_DEFAULT_FILTERS.SUCCEEDED);
            } catch (error: any) {
                commit(FilterMutationEnum.APPLY_DEFAULT_FILTERS.FAILED);
                throw error;
            }
        },
        [FilterActionEnum.INITIALIZE_APPLIED_FILTERS]: async (
            { state, dispatch, commit },
            { browserQueryParams, listViewTypeId }: { browserQueryParams: any; listViewTypeId: string },
        ) => {
       debugger;
            const appliedFilters = mapBrowserQueryParamsToAppliedFilters({ filters: state.filters, browserQueryParams });
            console.log(appliedFilters,"appliedFilters from init")
            if (!state.isInitialized) {
                await dispatch(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId });
            }
            if (!isEmpty(appliedFilters)) {
                await dispatch(FilterActionEnum.SET_APPLIED_FILTERS, { appliedFilters, isSelectedFromSavedFilters: true });
            } else if (!isEmpty(state.appliedFilters)) {
             
                dispatch(FilterActionEnum.SET_BROWSER_QUERY_PARAMS);
            } else {
                if (!state.isInitialized) {
                    dispatch(FilterActionEnum.APPLY_DEFAULT_FILTERS);
                }
            }
            commit(FilterMutationEnum.SET_IS_INITIALIZED, { isInitialized: true });
        },
        [FilterActionEnum.SET_BROWSER_QUERY_PARAMS]({ state }) {
            const filters = mapAppliedFiltersToBrowserQueryParams({ filters: state.filters, appliedFilters: state.appliedFilters });
            setBrowserQueryParams({ filters });
        },
        async [FilterActionEnum.SET_APPLIED_FILTERS](
            { state, commit, dispatch },
            { appliedFilters, isSelectedFromSavedFilters }: { appliedFilters: IAppliedFilters; isSelectedFromSavedFilters?: boolean },
        ) {
            const resolvedAppliedFilters = mapAppliedFiltersToResolvedAppliedFilters({ filters: state.filters, appliedFilters });
            commit(FilterMutationEnum.SET_APPLIED_FILTERS, { appliedFilters });
            commit(FilterMutationEnum.SET_RESOLVED_APPLIED_FILTERS, { resolvedAppliedFilters });
            if (!isSelectedFromSavedFilters) {
                commit(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: {} });
            }
            dispatch(FilterActionEnum.SET_BROWSER_QUERY_PARAMS);
        },
        async [FilterActionEnum.FETCH_CONSIGNEE_OPTIONS]({ commit, state }, { id, searchText }: { id: string; searchText: string }) {
            const filterField = state.filters.fieldMap[id];
            if (!filterField) {
                return;
            }
            try {
                commit(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED, { filterField });
                const consignees = await getConsignee(searchText, filterField.multiselect?.fetchOptions?.cancelToken?.token);
                commit(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.SUCCEEDED, { filterField, consignees });
            } catch (error: any) {
                if (!axios.isCancel(error)) {
                    commit(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED, { filterField, errors: getAPIErrorMessages(error) });
                }
            }
        },
        async [FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ commit, state }, { id, searchText }: { id: string; searchText: string }) {
            const filterField = state.filters.fieldMap[id];
            if (!filterField) {
                return;
            }
            try {
                commit(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED, { filterField });
                const filterSearchResult = await getAutoCompleteResults(id, searchText, filterField.multiselect?.fetchOptions?.cancelToken?.token);
                commit(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED, { filterField, filterSearchResult });
            } catch (error: any) {
                if (!axios.isCancel(error)) {
                    commit(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED, { filterField, errors: getAPIErrorMessages(error) });
                }
            }
        },
        [FilterActionEnum.APPLY_SAVED_FILTERS]: async ({ commit, state, dispatch }, { savedFilters }: { savedFilters: ISavedFilterItem }) => {
            try {
                const resolvedAppliedFilters: IAppliedFilters = savedFilters.fields.reduce((acc: any, curr: any) => {
                    const key = Object.keys(curr)[0];
                    const value = curr[key];
                    acc[key] = value;
                    return acc;
                }, {});
                const appliedFilters = mapSavedFiltersToAppliedFilters({ filters: state.filters, savedFilters: resolvedAppliedFilters });
                commit(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: savedFilters });
                dispatch(FilterActionEnum.SET_APPLIED_FILTERS, { appliedFilters, isSelectedFromSavedFilters: true });
            } catch (error: any) {
                throw error;
            }
        },
        [FilterActionEnum.DELETE_SAVED_FILTERS]: async (
            { commit, state, dispatch },
            { filterId, listViewTypeId }: { filterId: string; listViewTypeId: string },
        ) => {
            try {
                commit(FilterMutationEnum.DELETE_SAVED_FILTERS.STARTED);
                const data = await api.userPreferences.deleteSavedFilter(filterId);
                await dispatch(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId });

                if (state.savedFilters.appliedFilter && state.savedFilters.appliedFilter.id === filterId) {
                    dispatch(FilterActionEnum.APPLY_DEFAULT_FILTERS);
                }
                commit(FilterMutationEnum.DELETE_SAVED_FILTERS.SUCCEEDED);
                return data;
            } catch (error: any) {
                commit(FilterMutationEnum.DELETE_SAVED_FILTERS.FAILED);
                throw error;
            }
        },
        async [FilterActionEnum.SAVE_FILTERS](
            { commit, state, dispatch },
            { filterName, appliedFilters, listViewTypeId }: { filterName: string; appliedFilters: IAppliedFilters; listViewTypeId: string },
        ) {
            try {
                commit(FilterMutationEnum.SAVE_FILTERS.STARTED);
                const resolvedAppliedFilters = mapAppliedFiltersToSaveFiltersPayload({ filters: state.filters, appliedFilters });
                const data = await api.userPreferences.saveFilter({
                    uiId: `${listViewTypeId}`,
                    definition: JSON.stringify(resolvedAppliedFilters),
                    name: filterName,
                    isDefault: false,
                });
                dispatch(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId });

                commit(FilterMutationEnum.SAVE_FILTERS.SUCCEEDED);
                return data;
            } catch (error: any) {
                commit(FilterMutationEnum.SAVE_FILTERS.FAILED);
                throw error;
            }
        },
        [FilterActionEnum.UPDATE_DEFAULT_FILTERS]: async (
            { commit, state, dispatch },
            { filterId, listViewTypeId, shouldBeDefault }: { filterId: string; listViewTypeId: string; shouldBeDefault: boolean },
        ) => {
            try {
                commit(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.STARTED);
                const data = await api.userPreferences.updateDefaultFilter(filterId, {
                    isDefault: shouldBeDefault,
                });

                dispatch(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId });
                commit(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.SUCCEEDED);
                return data;
            } catch (error: any) {
                commit(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.FAILED);
                throw error;
            }
        },
        async [FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS](
            { commit, state },
            { id, searchText }: { id: string; searchText: string },
            cancelToken?: CancelToken,
        ) {
            const filterField = state.filters.fieldMap[id];
            if (!filterField) {
                return;
            }
            try {
                commit(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED, { filterField });
                const users = await getLastUpdatedByUser(searchText, filterField.multiselect?.fetchOptions?.cancelToken?.token);

                commit(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED, { filterField, users });
            } catch (error: any) {
                if (!axios.isCancel(error)) {
                    commit(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED, { filterField, errors: getAPIErrorMessages(error) });
                }
            }
        },
    },
};

function getConsignee(searchText: string, cancelToken?: CancelToken): Promise<Array<{ value: string; secondary: string }>> {
    return api.permissions
        .getCustomers({
            params: { limit: 50, customerName: searchText },
            cancelToken,
        })
        .then(getUniqueConsignees);
}

function getLastUpdatedByUser(searchText: string, cancelToken?: CancelToken): Promise<Array<{ value: string; secondary: string }>> {
    return api.userDetails
        .getUserDetails({
            params: { searchPhrase: searchText },
            cancelToken,
        })
        .then(getLastUpdatedByAutoCompleteResult);
}

function getAutoCompleteResults(id: string, searchText: string, cancelToken?: CancelToken): Promise<Array<any>> {
    return api.autocomplete
        .getFiltersAutoComplete({
            params: { limit: 50, searchExpression: searchText, filterName: id },
            cancelToken,
        })
        .then(getGenericAutoCompleteResults);
}
function getSavedFiltersFromAPI(uiId: string): Promise<Array<any>> {
    return api.userPreferences
        .getSavedFilters({
            params: { uiId: uiId },
        })
        .then(getFormattedSavedFilters);
}

export default filter;
