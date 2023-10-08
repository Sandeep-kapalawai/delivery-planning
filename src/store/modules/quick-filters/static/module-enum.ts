import { createMutationConstants } from 'destination/store/utilities';

export const NAMESPACE = 'quickFilter';

export enum QuickFilterActionEnum {
    FETCH_PLANNING_STATUS = 'FETCH_PLANNING_STATUS',
    FETCH_EXECUTION_STATUS = 'FETCH_EXECUTION_STATUS',
    FETCH_LAST_FREE_DAYS_GROUPS = 'FETCH_LAST_FREE_DAYS_GROUPS',
    FETCH_PRIORITY_LEVEL_GROUPS = 'FETCH_PRIORITY_LEVEL_GROUPS',
    GROUPED_QUICK_FILTERS = 'GROUPED_QUICK_FILTERS',
    RESET_QUICK_FILTER_TYPE = 'RESET_QUICK_FILTER_TYPE',
    INITIALIZE_APPLIED_QUICK_FILTERS  = 'INITIALIZE_APPLIED_QUICK_FILTERS',
    SET_BROWSER_QUERY_PARAMS = 'SET_BROWSER_QUERY_PARAMS',
    SET_APPLIED_QUICK_FILTERS = 'SET_APPLIED_QUICK_FILTERS'
}

export const QuickFilterMutationEnum = {
    FETCH_PLANNING_STATUS: createMutationConstants(QuickFilterActionEnum.FETCH_PLANNING_STATUS),
    FETCH_EXECUTION_STATUS: createMutationConstants(QuickFilterActionEnum.FETCH_EXECUTION_STATUS),
    FETCH_PRIORITY_LEVEL_GROUPS: createMutationConstants(QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS),
    FETCH_LAST_FREE_DAYS_GROUPS: createMutationConstants(QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS),
    SET_SELECTED_QUICK_FILTERS: 'SET_SELECTED_QUICK_FILTERS',
    SET_DESELECT_QUICK_FILTERS: 'SET_DESELECT_QUICK_FILTERS',
    CLEAR_ALL_QUICK_FILTERS: 'CLEAR_ALL_QUICK_FILTERS',
    RESET_QUICK_FILTER_TYPE: 'RESET_QUICK_FILTER_TYPE',
    SET_GROUPED_QUICK_FILTERS: 'SET_GROUPED_QUICK_FILTERS',
    SET_APPLIED_QUICK_FILTERS: 'SET_APPLIED_QUICK_FILTERS',
};

export enum QuickFilterGetterEnum {
    GET_PLANNING_STATUS = 'GET_PLANNING_STATUS',
    GET_EXECUTION_STATUS = 'GET_EXECUTION_STATUS',
    GET_LAST_FREE_DAYS_GROUPS = 'GET_LAST_FREE_DAYS_GROUPS',
    GET_PRIORITY_LEVEL_GROUPS = 'GET_PRIORITY_LEVEL_GROUPS',
    GET_APPLIED_QUICK_FILTERS = ' GET_APPLIED_QUICK_FILTERS ',
    GET_GROUPED_QUICK_FILTERS = 'GET_GROUPED_QUICK_FILTERS',
}