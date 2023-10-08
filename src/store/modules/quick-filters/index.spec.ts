//@ts-nocheck
import quickFilter from '.';
import { IState } from './interfaces';
import { NAMESPACE as FILTER_NAMESPACE, FilterGetterEnum } from '@/store/modules/filter/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import * as destinationUtilities from 'destination/utilities';

import api from '@/data/api';
import {
    EXECUTION_STATUSES_MOCK,
    LAST_FREE_DAYS_GROUPS_MOCK,
    PLANNING_STATUS_MOCK,
    PRIORITY_LEVEL_GROUPS_MOCK,
    MOCK_APPLIED_QUICK_FILTERS,
    MOCK_GROUPED_QUICK_FILTERS,
    EXECUTION_STATUSES_MOCK_RESULT,
} from '@/mocks/filters';
import { NAMESPACE as QUICK_FILTERS_NAMESPACE, QuickFilterActionEnum, QuickFilterGetterEnum, QuickFilterMutationEnum } from './static';

const createState = (overrides?: Partial<IState>): IState => ({
    quickFilters: {
        planningStatus: {
            errorMessage: '',
            isFetching: false,
            result: [],
        },
        executionStatus: {
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
    groupedQuickFilters: {},
    appliedQuickFilters: [],
    ...overrides,
});
beforeEach(() => {
    jest.resetAllMocks();
});

describe('state', () => {
    it('returns a default state', () => {
        expect(quickFilter.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_PLANNING_STATUS returns quick sections filtersArray from state', () => {
        const { quickFilters } = createState({
            planningStatus: {
                isFetching: false,
                errorMessage: '',
                result: PLANNING_STATUS_MOCK,
            },
        });

        expect(quickFilter.getters[QuickFilterGetterEnum.GET_PLANNING_STATUS]({ quickFilters })).toEqual(quickFilters.planningStatus);
    });

    it('GET_EXECUTION_STATUS returns quick sections filtersArray from state', () => {
        const { quickFilters } = createState({
            executionStatus: {
                isFetching: false,
                errorMessage: '',
                result: EXECUTION_STATUSES_MOCK,
            },
        });

        expect(quickFilter.getters[QuickFilterGetterEnum.GET_EXECUTION_STATUS]({ quickFilters })).toEqual(quickFilters.executionStatus);
    });

    it('GET_PRIORITY_LEVEL_GROUPS returns quick sections filtersArray from state', () => {
        const { quickFilters } = createState({
            priorityLevelGroups: {
                isFetching: false,
                errorMessage: '',
                result: PRIORITY_LEVEL_GROUPS_MOCK,
            },
        });

        expect(quickFilter.getters[QuickFilterGetterEnum.GET_PRIORITY_LEVEL_GROUPS]({ quickFilters })).toEqual(quickFilters.priorityLevelGroups);
    });

    it('GET_LAST_FREE_DAYS_GROUPS returns quick sections filtersArray from state', () => {
        const { quickFilters } = createState({
            lastFreeDaysGroups: {
                isFetching: false,
                errorMessage: '',
                result: LAST_FREE_DAYS_GROUPS_MOCK,
            },
        });

        expect(quickFilter.getters[QuickFilterGetterEnum.GET_LAST_FREE_DAYS_GROUPS]({ quickFilters })).toEqual(quickFilters.lastFreeDaysGroups);
    });

    it('GET_APPLIED_QUICK_FILTERS returns applied Filters from state', () => {
        const { quickFilters } = createState({
            appliedQuickFilters: MOCK_APPLIED_QUICK_FILTERS,
        });
        expect(quickFilter.getters[QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS]({ quickFilters })).toEqual(quickFilters.appliedQuickFilters);
    });

    it('GET_GROUPED_QUICK_FILTERS returns grouped from state', () => {
        const { quickFilters } = createState({
            groupedQuickFilters: MOCK_GROUPED_QUICK_FILTERS,
        });
        expect(quickFilter.getters[QuickFilterGetterEnum.GET_GROUPED_QUICK_FILTERS]({ quickFilters })).toEqual(quickFilters.groupedQuickFilters);
    });
});

describe('mutations', () => {
    let state;

    it('FETCH_PLANNING_STATUS.STARTED sets isFetching state', () => {
        const state = createState({
            quickFilters: {
                planningStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: [],
                },
            },
        });

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PLANNING_STATUS.STARTED](state);

        expect(state.quickFilters.planningStatus.isFetching).toEqual(true);
    });

    it('FETCH_PLANNING_STATUS.SUCCEEDED sets result in state', () => {
        const state = createState();

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PLANNING_STATUS.SUCCEEDED](state, PLANNING_STATUS_MOCK);

        expect(state.quickFilters.planningStatus.result).toEqual(PLANNING_STATUS_MOCK);
    });

    it('FETCH_LIST.FAILED sets isFetching and error in state', () => {
        const state = createState();
        const errorMessage = 'error';

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PLANNING_STATUS.FAILED](state, errorMessage);
        expect(state.quickFilters.planningStatus.isFetching).toEqual(false);
        expect(state.quickFilters.planningStatus.errorMessage).toEqual(errorMessage);
    });

    it('FETCH_EXECUTION_STATUS.STARTED sets isFetching state', () => {
        const state = createState({
            quickFilters: {
                executionStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: [],
                },
            },
        });

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.STARTED](state);

        expect(state.quickFilters.executionStatus.isFetching).toEqual(true);
    });

    it('FETCH_EXECUTION_STATUS.SUCCEEDED sets result in state', () => {
        const state = createState();

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.SUCCEEDED](state, EXECUTION_STATUSES_MOCK);

        expect(state.quickFilters.executionStatus.result).toEqual(EXECUTION_STATUSES_MOCK);
    });

    it('FETCH_EXECUTION_STATUS.FAILED sets list.isFetching and error in state', () => {
        const state = createState();
        const errorMessage = 'error';

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.FAILED](state, errorMessage);

        expect(state.quickFilters.executionStatus.isFetching).toEqual(false);
        expect(state.quickFilters.executionStatus.errorMessage).toEqual(errorMessage);
    });

    it('FETCH_PRIORITY_LEVEL_GROUPS.STARTED sets isFetching state', () => {
        const state = createState({
            quickFilters: {
                priorityLevelGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: [],
                },
            },
        });

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.STARTED](state);

        expect(state.quickFilters.priorityLevelGroups.isFetching).toEqual(true);
    });

    it('FETCH_PRIORITY_LEVEL_GROUPS.SUCCEEDED sets result in state', () => {
        const state = createState();

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.SUCCEEDED](state, PRIORITY_LEVEL_GROUPS_MOCK);

        expect(state.quickFilters.priorityLevelGroups.result).toEqual(PRIORITY_LEVEL_GROUPS_MOCK);
    });

    it('FETCH_PRIORITY_LEVEL_GROUPS.FAILED sets list.isFetching and error in state', () => {
        const state = createState();
        const errorMessage = 'error';

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.FAILED](state, errorMessage);

        expect(state.quickFilters.priorityLevelGroups.isFetching).toEqual(false);
        expect(state.quickFilters.priorityLevelGroups.errorMessage).toEqual(errorMessage);
    });

    it('FETCH_LAST_FREE_DAYS_GROUPS.STARTED sets isFetching state', () => {
        const state = createState({
            quickFilters: {
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: [],
                },
            },
        });

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.STARTED](state);

        expect(state.quickFilters.lastFreeDaysGroups.isFetching).toEqual(true);
    });

    it('FETCH_LAST_FREE_DAYS_GROUPS.SUCCEEDED sets result in state', () => {
        const state = createState();

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.SUCCEEDED](state, LAST_FREE_DAYS_GROUPS_MOCK);

        expect(state.quickFilters.lastFreeDaysGroups.result).toEqual(LAST_FREE_DAYS_GROUPS_MOCK);
    });

    it('FETCH_LAST_FREE_DAYS_GROUPS.FAILED sets list.isFetching and error in state', () => {
        const state = createState();
        const errorMessage = 'error';

        quickFilter.mutations[QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.FAILED](state, errorMessage);

        expect(state.quickFilters.lastFreeDaysGroups.isFetching).toEqual(false);
        expect(state.quickFilters.lastFreeDaysGroups.errorMessage).toEqual(errorMessage);
    });

    it('SET_SELECTED_QUICK_FILTERS sets isSelected as true for a status group at a index position', () => {
        state = createState({
            quickFilters: {
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: LAST_FREE_DAYS_GROUPS_MOCK,
                },
            },
        });
        quickFilter.mutations[QuickFilterMutationEnum.SET_SELECTED_QUICK_FILTERS](state, { index: 0, type: 'lastFreeDaysGroups' });

        expect(state.quickFilters.lastFreeDaysGroups.isFetching).toEqual(false);
        expect(state.quickFilters.lastFreeDaysGroups.result[0].isSelected).toEqual(true);
    });

    it('CLEAR_ALL_QUICK_FILTERS resets every element to isSelected as false ', () => {
        const LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS = [...LAST_FREE_DAYS_GROUPS_MOCK];
        LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS[0].isSelected = true;
        state = createState({
            quickFilters: {
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS,
                },
            },
        });
        quickFilter.mutations[QuickFilterMutationEnum.CLEAR_ALL_QUICK_FILTERS](state);

        state.quickFilters.lastFreeDaysGroups.result.forEach((ele) => {
            expect(ele.isSelected).toEqual(false);
        });
    });

    it('RESET_QUICK_FILTER_TYPE resets specified type of filter  ', () => {
        const LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS = [...LAST_FREE_DAYS_GROUPS_MOCK];
        const EXECUTION_STATUSES_MOCK_SELECTED_FILTERS = [...EXECUTION_STATUSES_MOCK];
        EXECUTION_STATUSES_MOCK_SELECTED_FILTERS[0].isSelected = true;
        LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS[0].isSelected = true;
        state = createState({
            quickFilters: {
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: LAST_FREE_DAYS_GROUPS_MOCK_SELECTED_FILTERS,
                },
                executionStatus: { isFetching: false, errorMessage: '', result: EXECUTION_STATUSES_MOCK_SELECTED_FILTERS },
            },
        });

        quickFilter.mutations[QuickFilterMutationEnum.RESET_QUICK_FILTER_TYPE](state, 'lastFreeDaysGroups');

        expect(state.quickFilters.executionStatus.result[0].isSelected).toStrictEqual(true);
        state.quickFilters.lastFreeDaysGroups.result.forEach((ele) => {
            expect(ele.isSelected).toEqual(false);
        });
    });

    it('SET_DESELECT_QUICK_FILTERS sets isSelected as false for a status group at a index position', () => {
        state = createState({
            quickFilters: {
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: LAST_FREE_DAYS_GROUPS_MOCK,
                },
            },
        });
        quickFilter.mutations[QuickFilterMutationEnum.SET_DESELECT_QUICK_FILTERS](state, { index: 0, type: 'lastFreeDaysGroups' });

        expect(state.quickFilters.lastFreeDaysGroups.isFetching).toEqual(false);
        expect(state.quickFilters.lastFreeDaysGroups.result[0].isSelected).toEqual(false);
    });

    it('SET_APPLIED_QUICK_FILTERS sets applied filters into a new state where the each group has isSelected as false', () => {
        EXECUTION_STATUSES_MOCK[0].isSelected = false;

        state = createState({
            quickFilters: {
                planningStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: PLANNING_STATUS_MOCK,
                },
                executionStatus: { isFetching: false, errorMessage: '', result: EXECUTION_STATUSES_MOCK },
                lastFreeDaysGroups: { isFetching: false, errorMessage: '', result: LAST_FREE_DAYS_GROUPS_MOCK },
                priorityLevelGroups: { isFetching: false, errorMessage: '', result: PRIORITY_LEVEL_GROUPS_MOCK },
            },
        });
        quickFilter.mutations[QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS](state);

        expect(state.appliedQuickFilters).toEqual([]);
    });

    it('SET_APPLIED_QUICK_FILTERS sets applied filters into a new state where the each group has isSelected as true', () => {
        state = createState({
            quickFilters: {
                planningStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: [
                        { planningStatus: 'Initial', isSelected: true },
                        { planningStatus: 'ReadyToPlan', isSelected: false },
                    ],
                },

                executionStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: [
                        { executionStatus: 'vesselArrived', isSelected: true },
                        { executionStatus: 'Intransit', isSelected: false },
                    ],
                },
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: [
                        { lastFreeDaysRange: 'WithinFreeTimeDemurrage', isSelected: true },
                        { lastFreeDaysRange: 'IncurringDetention', isSelected: false },
                    ],
                },
                priorityLevelGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: [
                        { priorityLevel: '0', isSelected: true },
                        { priorityLevel: '1', isSelected: false },
                        { priorityLevel: '2', isSelected: true },
                    ],
                },
            },
        });
        quickFilter.mutations[QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS](state);

        expect(state.appliedQuickFilters).toEqual([
            {
                id: 'planningStatus',
                value: 'Initial',
            },
            {
                id: 'executionStatusGroups',
                value: 'vesselArrived',
            },
            {
                id: 'priorityGroups',
                value: '0',
            },
            {
                id: 'priorityGroups',
                value: '2',
            },
            {
                id: 'lastFreeDayGroups',
                value: 'WithinFreeTimeDemurrage',
            },
        ]);
    });

    it('SET_GROUPED_QUICK_FILTERS sets applied filters in state as empty ', () => {
        state = createState({
            groupedQuickFilters: {},
        });
        quickFilter.mutations[QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS](state, MOCK_APPLIED_QUICK_FILTERS);

        expect(state.groupedQuickFilters).toEqual(MOCK_APPLIED_QUICK_FILTERS);
    });
});

describe('actions', () => {
    const commit = jest.fn();
    const dispatch = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('FETCH_PLANNING_STATUS commits SUCCEEDED mutation on request success', async () => {
        jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(true);
        jest.spyOn(api.quickFilters, 'getPlanningStatus').mockResolvedValue([
            {
                planningStatus: 'PLANNING_IN_PROGRESS',
                count: 1,
            },
        ]);
        const viewModule = 'TEST_MODULE';
        const state = createState();
        const commit = jest.fn();

        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_PLANNING_STATUS]({ state, rootGetters, commit }, { viewModule });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.SUCCEEDED, PLANNING_STATUS_MOCK);
    });

    it('FETCH_PLANNING_STATUS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        const viewModule = 'TEST_MODULE';
        jest.spyOn(api.quickFilters, 'getPlanningStatus').mockRejectedValue(error);
        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_PLANNING_STATUS]({ state, rootGetters, commit }, { viewModule }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PLANNING_STATUS.FAILED, { message: 'error' });
    });
    it('FETCH_PRIORITY_LEVEL_GROUPS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        const viewModule = 'TEST_MODULE';
        jest.spyOn(api.quickFilters, 'getPriorityLevelGroups').mockRejectedValue(error);
        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS]({ state, rootGetters, commit }, { viewModule }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.FAILED, { message: 'error' });
    });

    it('FETCH_PRIORITY_LEVEL_GROUPS commits SUCCEEDED mutation on request success', async () => {
        jest.spyOn(api.quickFilters, 'getPriorityLevelGroups').mockResolvedValue(PRIORITY_LEVEL_GROUPS_MOCK);
        const viewModule = 'TEST_MODULE';
        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS]({ state, rootGetters, commit }, { viewModule });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_PRIORITY_LEVEL_GROUPS.SUCCEEDED, PRIORITY_LEVEL_GROUPS_MOCK);
    });

    it('FETCH_EXECUTION_STATUS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        const viewModule = 'TEST_MODULE';
        jest.spyOn(api.quickFilters, 'getExecutionStatus').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_EXECUTION_STATUS]({ state, rootGetters, commit }, { viewModule }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.FAILED, { message: 'error' });
    });

    it('FETCH_EXECUTION_STATUS commits SUCCEEDED mutation on request success', async () => {
        jest.spyOn(api.quickFilters, 'getExecutionStatus').mockResolvedValue(EXECUTION_STATUSES_MOCK);
        const viewModule = 'TEST_MODULE';
        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_EXECUTION_STATUS]({ state, rootGetters, commit }, { viewModule });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_EXECUTION_STATUS.SUCCEEDED, expect.arrayContaining(EXECUTION_STATUSES_MOCK_RESULT));
    });

    it('FETCH_LAST_FREE_DAYS_GROUPS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        const viewModule = 'TEST_MODULE';
        jest.spyOn(api.quickFilters, 'getLastFreeDaysGroups').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS]({ state, rootGetters, commit }, { viewModule }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.FAILED, { message: 'error' });
    });

    it('FETCH_LAST_FREE_DAYS_GROUPS commits SUCCEEDED mutation on request success', async () => {
        jest.spyOn(api.quickFilters, 'getLastFreeDaysGroups').mockResolvedValue(LAST_FREE_DAYS_GROUPS_MOCK);
        const viewModule = 'TEST_MODULE';
        const state = createState();
        const commit = jest.fn();
        const rootGetters = {
            [`${viewModule}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
            [`${viewModule}/${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${viewModule}/${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await quickFilter.actions[QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS]({ state, rootGetters, commit }, { viewModule });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.STARTED);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.FETCH_LAST_FREE_DAYS_GROUPS.SUCCEEDED, LAST_FREE_DAYS_GROUPS_MOCK);
    });

    it('GROUPED_QUICK_FILTERS commits SET_GROUPED_QUICK_FILTERS mutation ', async () => {
        const viewModule = 'TEST_MODULE';
        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS}`]: () => [],
        };

        await quickFilter.actions[QuickFilterActionEnum.GROUPED_QUICK_FILTERS]({ state, getters, commit }, { viewModule });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS, {});
    });

    it('RESET_QUICK_FILTER_TYPE commits RESET_QUICK_FILTER_TYPE mutation', async () => {
        const commit = jest.fn();

        await quickFilter.actions[QuickFilterActionEnum.RESET_QUICK_FILTER_TYPE]({ commit }, { type: 'TEST_FILTER' });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(QuickFilterMutationEnum.RESET_QUICK_FILTER_TYPE, 'TEST_FILTER');
    });
});
