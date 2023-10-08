//@ts-nocheck
import axios from 'axios';
import * as destinationUtilities from 'destination/utilities';
import filter from '.';
import { IState } from './interfaces';
import { FilterMutationEnum, FilterActionEnum, FilterGetterEnum, NAMESPACE as FILTER_NAMESPACE } from './static';
import { ICustomer, FilterTypeEnum, IFilterField, ILastUpdatedByUser } from '@/interfaces';
import * as savedFilters from './logic/saved-filters';
import api from '@/data/api';

const createState = (overrides?: Partial<IState>): IState => ({
    filters: {
        filtersArray: [],
        filtersMap: {},
        fieldMap: {},
    },
    isInitialized: false,
    appliedFilters: {},
    resolvedAppliedFilters: {},
    savedFilters: {
        appliedFilter: {},
        errorMessage: [],
        isFetching: false,
        list: [],
    },
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(filter.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_APPLIED_FILTERS returns appliedFilters from state', () => {
        const { appliedFilters } = createState({ appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' } });

        expect(filter.getters[FilterGetterEnum.GET_APPLIED_FILTERS]({ appliedFilters })).toEqual(appliedFilters);
    });

    it('GET_RESOLVED_APPLIED_FILTERS returns resolvedAppliedFilters from state', () => {
        const { resolvedAppliedFilters } = createState({ resolvedAppliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' } });

        expect(filter.getters[FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS]({ resolvedAppliedFilters })).toEqual(resolvedAppliedFilters);
    });

    it('GET_SECTIONS returns sections filtersArray from state', () => {
        const { filters } = createState({
            filters: {
                filtersArray: [{ id: 1 }, { id: 2, isQuickFilter: true }, { id: 3 }],
            },
        });

        const getterValue = filter.getters[FilterGetterEnum.GET_SECTIONS]({ filters });
        expect(getterValue).toHaveLength(2);
        expect(getterValue[0].id).toBe(1);
        expect(getterValue[1].id).toBe(3);
    });

    it('GET_QUICK_SECTIONS returns quick sections filtersArray from state', () => {
        const { filters } = createState({
            filters: {
                filtersArray: [{ id: 1, isQuickFilter: true }, { id: 2 }, { id: 3, isQuickFilter: true }],
            },
        });

        const getterValue = filter.getters[FilterGetterEnum.GET_QUICK_SECTIONS]({ filters });
        expect(getterValue).toHaveLength(2);
        expect(getterValue[0].id).toBe(1);
        expect(getterValue[1].id).toBe(3);
    });

    it('GET_SAVED_FILTERS returns user default filters from list in savedFilters state', () => {
        const state = createState({
            savedFilters: {
                list: [
                    {
                        filterId: 1,
                        name: 'Filter 1',
                        definition: '{"field1": "value1", "field2": "value2"}',
                        isUserDefault: true,
                        isSystemDefault: false,
                    },
                    {
                        filterId: 2,
                        name: 'Filter 2',
                        definition: '{"field1": "value1", "field2": "value2"}',
                        isUserDefault: true,
                        isSystemDefault: true,
                    },
                ],
            },
        });
        const expected = [
            {
                filterId: 1,
                name: 'Filter 1',
                definition: '{"field1": "value1", "field2": "value2"}',
                isUserDefault: true,
                isSystemDefault: false,
            },
        ];
        expect(filter.getters[FilterGetterEnum.GET_SAVED_FILTERS](state)).toEqual(expected);
    });

    it('GET_SAVED_FILTER_LOADING_STATUS returns isFetching from savedFilters state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        expect(filter.getters[FilterGetterEnum.GET_SAVED_FILTER_LOADING_STATUS](state)).toEqual(state.savedFilters.isFetching);
    });

    it('GET_APPLIED_FILTER_IN_SAVE_FILTERS returns appliedFilters from savedFilters state', () => {
        const state = createState({
            savedFilters: {
                appliedFilter: {
                    id: '421',
                    name: 'Test_Filter',
                    fields: [
                        {
                            FILTER_FIELD_TEST_1: '14',
                        },
                        {
                            FILTER_FIELD_TEST_2: 'abc',
                        },
                    ],
                },
            },
        });
        expect(filter.getters[FilterGetterEnum.GET_APPLIED_FILTER_IN_SAVE_FILTERS](state)).toEqual(state.savedFilters.appliedFilter);
    });

    it('GET_SAVED_FILTER_ERROR_MESSAGE returns errorMessage from savedFilters state', () => {
        const state = createState({
            savedFilters: {
                errorMessage: ['TEST ERROR'],
            },
        });
        expect(filter.getters[FilterGetterEnum.GET_SAVED_FILTER_ERROR_MESSAGE](state)).toEqual(state.savedFilters.errorMessage);
    });
});

describe('mutations', () => {
    it('SET_FILTERS sets filters in state', () => {
        const state = createState();

        filter.mutations[FilterMutationEnum.SET_FILTERS](state, {
            filters: [
                {
                    id: 'FILTER_SECTION',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ],
        });

        expect(state).toEqual(
            createState({
                filters: {
                    filtersArray: [
                        {
                            id: 'FILTER_SECTION',
                            indicator: 999,
                            expanded: false,
                            slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                            title: 'FILTER_SECTION_TITLE',
                            fields: [
                                {
                                    id: 'FILTER_FIELD',
                                    label: 'FILTER_FIELD_LABEL',
                                    type: 'text',
                                },
                            ],
                        },
                    ],
                    fieldMap: {
                        FILTER_FIELD: {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: 'text',
                        },
                    },
                    filtersMap: {
                        FILTER_SECTION: {
                            expanded: false,
                            fields: [
                                {
                                    id: 'FILTER_FIELD',
                                    label: 'FILTER_FIELD_LABEL',
                                    type: 'text',
                                },
                            ],
                            id: 'FILTER_SECTION',
                            indicator: 999,
                            slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                            title: 'FILTER_SECTION_TITLE',
                        },
                    },
                },
            }),
        );
    });

    it('SET_APPLIED_FILTERS sets appliedFilters in state', () => {
        const state = createState();

        filter.mutations[FilterMutationEnum.SET_APPLIED_FILTERS](state, {
            appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        });

        expect(state).toEqual(
            createState({
                appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
            }),
        );
    });

    it('SET_IS_INITIALIZED sets isInitialized in state', () => {
        const state = createState();

        filter.mutations[FilterMutationEnum.SET_IS_INITIALIZED](state, {
            isInitialized: true,
        });

        expect(state).toEqual(
            createState({
                isInitialized: true,
            }),
        );
    });

    it('SET_RESOLVED_APPLIED_FILTERS sets resolvedAppliedFilters in state', () => {
        const state = createState();

        filter.mutations[FilterMutationEnum.SET_RESOLVED_APPLIED_FILTERS](state, {
            resolvedAppliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        });

        expect(state).toEqual(
            createState({
                resolvedAppliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
            }),
        );
    });

    it('FETCH_CONSIGNEE_OPTIONS.STARTED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.STARTED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.STARTED cancels existing cancelToken and sets a new cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_CONSIGNEE_OPTIONS.STARTED sets isFetching and cancelToken in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeTruthy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeDefined();
    });

    it('FETCH_CONSIGNEE_OPTIONS.SUCCEEDED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.SUCCEEDED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.SUCCEEDED sets options in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const consignees = [
            {
                secondary: 'HUFFY CORPORATION',
                value: 'USHUFFYHQ',
            },
            {
                secondary: 'PRIMARK LIMITED STORE',
                value: 'GBPRIMARKHQ',
            },
        ];
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.SUCCEEDED](state, {
            filterField,
            consignees,
        });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
        expect(filterField.multiselect?.options).toEqual(consignees);
    });

    it('FETCH_CONSIGNEE_OPTIONS.FAILED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.FAILED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_CONSIGNEE_OPTIONS.FAILED sets isFetching and cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.STARTED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.STARTED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.STARTED cancels existing cancelToken and sets a new cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.STARTED sets isFetching and cancelToken in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeTruthy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeDefined();
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED sets options in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const filterSearchResult = ['RESULT_1', 'RESULT_2'];
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.SUCCEEDED](state, {
            filterField,
            filterSearchResult,
        });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
        expect(filterField.multiselect?.options).toEqual(filterSearchResult);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.FAILED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.FAILED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS.FAILED sets isFetching and cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
    });

    it('FETCH_SAVED_FILTERS.STARTED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: false,
            },
        });
        filter.mutations[FilterMutationEnum.FETCH_SAVED_FILTERS.STARTED](state);
        expect(state.savedFilters.isFetching).toEqual(true);
    });

    it('FETCH_SAVED_FILTERS.SUCCEEDED sets savedresults in state', () => {
        const state = createState();
        const result = [
            {
                id: 80,
                name: 'Default',
                fields: [
                    {
                        daysTillEstimatedTimeOfArrival: 14,
                    },
                ],
                isUserDefault: false,
                isSystemDefault: true,
            },
        ];
        filter.mutations[FilterMutationEnum.FETCH_SAVED_FILTERS.SUCCEEDED](state, { result });

        expect(state.savedFilters.list).toEqual(result);
    });

    it('FETCH_SAVED_FILTERS.FAILED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.FETCH_SAVED_FILTERS.FAILED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('SAVE_FILTERS.STARTED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: false,
            },
        });
        filter.mutations[FilterMutationEnum.SAVE_FILTERS.STARTED](state);
        expect(state.savedFilters.isFetching).toEqual(true);
    });

    it('SAVE_FILTERS.FAILED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.SAVE_FILTERS.FAILED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('SAVE_FILTERS.SUCCEEDED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.SAVE_FILTERS.SUCCEEDED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('UPDATE_DEFAULT_FILTERS.STARTED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: false,
            },
        });
        filter.mutations[FilterMutationEnum.UPDATE_DEFAULT_FILTERS.STARTED](state);
        expect(state.savedFilters.isFetching).toEqual(true);
    });

    it('UPDATE_DEFAULT_FILTERS.FAILED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.UPDATE_DEFAULT_FILTERS.FAILED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('UPDATE_DEFAULT_FILTERS.SUCCEEDED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.UPDATE_DEFAULT_FILTERS.SUCCEEDED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('DELETE_SAVED_FILTERS.STARTED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: false,
            },
        });
        filter.mutations[FilterMutationEnum.DELETE_SAVED_FILTERS.STARTED](state);
        expect(state.savedFilters.isFetching).toEqual(true);
    });

    it('DELETE_SAVED_FILTERS.FAILED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.DELETE_SAVED_FILTERS.FAILED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('DELETE_SAVED_FILTERS.SUCCEEDED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.DELETE_SAVED_FILTERS.SUCCEEDED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('APPLY_DEFAULT_FILTERS.STARTED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: false,
            },
        });
        filter.mutations[FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED](state);
        expect(state.savedFilters.isFetching).toEqual(true);
    });

    it('APPLY_DEFAULT_FILTERS.FAILED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.APPLY_DEFAULT_FILTERS.FAILED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('APPLY_DEFAULT_FILTERS.SUCCEEDED sets isFetching state', () => {
        const state = createState({
            savedFilters: {
                isFetching: true,
            },
        });
        filter.mutations[FilterMutationEnum.APPLY_DEFAULT_FILTERS.SUCCEEDED](state);
        expect(state.savedFilters.isFetching).toEqual(false);
    });

    it('SET_APPLIED_FILTER_IN_SAVE_FILTERS sets appliedfilters in savedFilter state', () => {
        const state = createState();
        const payload = {
            appliedFilters: {
                id: '421',
                name: 'Test_Filter',
                fields: [
                    {
                        FILTER_FIELD_TEST_1: '14',
                    },
                    {
                        FILTER_FIELD_TEST_2: 'abc',
                    },
                ],
            },
        };
        filter.mutations[FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS](state, payload);
        expect(state.savedFilters.appliedFilter).toEqual(payload.appliedFilters);
    });

    it('SET_APPLIED_FILTER_IN_SAVE_FILTERS sets appliedfilters in savedFilter state', () => {
        const state = createState();
        const payload = {
            appliedFilters: {
                id: '421',
                name: 'Test_Filter',
                fields: [
                    {
                        FILTER_FIELD_TEST_1: '14',
                    },
                    {
                        FILTER_FIELD_TEST_2: 'abc',
                    },
                ],
            },
        };
        filter.mutations[FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS](state, payload);
        expect(state.savedFilters.appliedFilter).toEqual(payload.appliedFilters);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.STARTED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.STARTED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.STARTED cancels existing cancelToken and sets a new cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.STARTED sets isFetching and cancelToken in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeTruthy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeDefined();
    });

    it('FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED sets options in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const users = [
            {
                secondary: 'user one',
                value: 'test123',
                email: 'test@maersk',
            },
            {
                secondary: 'user two',
                value: 'test124',
                email: 'test1@maersk',
            },
        ];
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.SUCCEEDED](state, {
            filterField,
            users,
        });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
        expect(filterField.multiselect?.options).toEqual(users);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.FAILED exits if multiselect is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.FAILED exits if multiselect.fetchOptions is not available in filterField', () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED](state, { filterField });

        expect(filterField).toEqual(filterField);
    });

    it('FETCH_LAST_UPDATEDBY_USERS.FAILED sets isFetching and cancelToken in filterField', () => {
        const cancelToken = axios.CancelToken.source();
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: true,
                    callback: () => Promise.resolve([]),
                    cancelToken,
                },
                options: [],
            },
        };
        const state = createState();

        filter.mutations[FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED](state, { filterField });

        expect(filterField.multiselect?.fetchOptions?.isFetching).toBeFalsy();
        expect(filterField.multiselect?.fetchOptions?.cancelToken).toBeNull();
    });
});

describe('actions', () => {
    const spySetBrowserQueryParams = jest.spyOn(destinationUtilities, 'setBrowserQueryParams');
    const commit = jest.fn();
    const dispatch = jest.fn();
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('SET_BROWSER_QUERY_PARAMS sets query params in the browser url', () => {
        const state = createState({
            appliedFilters: { FILTER_FIELD_TEST: ['FILTER_FIELD_TEST_VALUE'] },
        });
        filter.actions[FilterActionEnum.SET_BROWSER_QUERY_PARAMS]({ state });
        expect(spySetBrowserQueryParams).toHaveBeenCalledTimes(1);
    });

    it('INITIALIZE_FILTERS commits SET_FILTERS mutation', () => {
        const filters = {
            id: 'general',
            title: 'General',
            slotReference: 'general',
            expanded: false,
            fields: [
                {
                    id: 'Consignee',
                    type: FilterTypeEnum.multiselect,
                    placeholder: 'Enter one or more Consignee',
                },
            ],
        };

        filter.actions[FilterActionEnum.INITIALIZE_FILTERS]({ commit }, { filters });
        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_FILTERS, { filters });
    });

    it('INITIALIZE_APPLIED_FILTERS dispatches FETCH_SAVED_FILTERS and APPLY_DEFAULT_FILTERS action when isInitialized is false and no pre-applied filters', async () => {
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST: {
                        id: 'FILTER_FIELD_TEST',
                        type: FilterTypeEnum.text,
                    },
                },
            },
            isInitialized: false,
            appliedFilters: {},
            savedFilters: {
                list: [
                    {
                        filterId: 1,
                        name: 'Filter 1',
                        definition: '{"field1": "value1", "field2": "value2"}',
                        isUserDefault: true,
                        isSystemDefault: false,
                    },
                ],
            },
        });
        const payload = {
            browserQueryParams: {},
            listViewTypeId: 'FCLList',
        };

        await filter.actions[FilterActionEnum.INITIALIZE_APPLIED_FILTERS]({ state, dispatch, commit }, payload);
        const expected = {
            name: 'Filter 1',
            filterId: 1,
            isSystemDefault: false,
            isUserDefault: true,
            definition: '{"field1": "value1", "field2": "value2"}',
        };
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId: 'FCLList' });
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.APPLY_DEFAULT_FILTERS);
    });

    it('INITIALIZE_APPLIED_FILTERS dispatches SET_APPLIED_FILTERS action when browserQueryParams is not empty', async () => {
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST: {
                        id: 'FILTER_FIELD_TEST',
                        type: FilterTypeEnum.text,
                    },
                },
            },
            isInitialized: true,
        });
        const payload = {
            browserQueryParams: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        };

        await filter.actions[FilterActionEnum.INITIALIZE_APPLIED_FILTERS]({ state, dispatch, commit }, payload);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.SET_APPLIED_FILTERS, {
            appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
            isSelectedFromSavedFilters: true,
        });
    });

    it('INITIALIZE_APPLIED_FILTERS dispatches SET_APPLIED_FILTERS action when state.appliedFilters is not enpty', async () => {
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {
                    TEST_SECTION: {
                        id: 'TEST_SECTION',
                    },
                },
                fieldMap: {
                    FILTER_FIELD_TEST: {
                        id: 'FILTER_FIELD_TEST',
                        type: FilterTypeEnum.text,
                    },
                },
            },
            isInitialized: true,
            appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
            resolvedAppliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        });
        const payload = { browserQueryParams: {} };

        await filter.actions[FilterActionEnum.INITIALIZE_APPLIED_FILTERS]({ state, dispatch, commit }, payload);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.SET_BROWSER_QUERY_PARAMS);
    });

    it('SET_APPLIED_FILTERS commits SET_APPLIED_FILTERS and SET_RESOLVED_APPLIED_FILTERS mutation and dispatches SET_BROWSER_QUERY_PARAMS action', () => {
        const state = createState();

        const payload = {
            appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        };

        filter.actions[FilterActionEnum.SET_APPLIED_FILTERS]({ state, commit, dispatch }, payload);

        expect(commit).toHaveBeenCalledTimes(3);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_APPLIED_FILTERS, {
            appliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: {} });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_RESOLVED_APPLIED_FILTERS, {
            resolvedAppliedFilters: { FILTER_FIELD_TEST: 'FILTER_FIELD_TEST_VALUE' },
        });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.SET_BROWSER_QUERY_PARAMS);
    });

    it('FETCH_CONSIGNEE_OPTIONS fetches Destination Consignees', async () => {
        const data: { result: Array<ICustomer> } = { result: [] };
        const getCustomersSpy = jest.spyOn(api.permissions, 'getCustomers').mockResolvedValue(data);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            label: 'FILTER_FIELD_TEST_LABEL',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const searchText = 'test';
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_CONSIGNEE_OPTIONS]({ state, commit }, { id: filterField.id, searchText });

        expect(getCustomersSpy).toHaveBeenCalledTimes(1);
        expect(getCustomersSpy).toHaveBeenCalledWith({
            params: { limit: 50, customerName: searchText },
            cancelToken: undefined,
        });
    });

    it('FETCH_CONSIGNEE_OPTIONS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.permissions, 'getCustomers').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_CONSIGNEE_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED, { filterField });
    });

    it('FETCH_CONSIGNEE_OPTIONS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.permissions, 'getCustomers').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_CONSIGNEE_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.STARTED, { filterField });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_CONSIGNEE_OPTIONS.FAILED, { filterField, errors: ['Mock API error message'] });
    });

    it('FETCH_CONSIGNEE_OPTIONS do not commit any and returns when filter field is missing', async () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_CONSIGNEE_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS do not commit any and returns when filter field is missing', async () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS fetches filter results from api', async () => {
        const data: { result: Array<any> } = { result: [] };
        const getFiltersAutoCompleteSpy = jest.spyOn(api.autocomplete, 'getFiltersAutoComplete').mockResolvedValue(data);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            label: 'FILTER_FIELD_TEST_LABEL',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const searchText = 'test';
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ state, commit }, { id: filterField.id, searchText });

        expect(getFiltersAutoCompleteSpy).toHaveBeenCalledTimes(1);
        expect(getFiltersAutoCompleteSpy).toHaveBeenCalledWith({
            params: { limit: 50, filterName: 'FILTER_FIELD_TEST', searchExpression: 'test' },
            cancelToken: undefined,
        });
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.autocomplete, 'getFiltersAutoComplete').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            labelKey: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [filterField],
                filtersMap: {
                    [filterField.id]: filterField,
                },
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED, { filterField });
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.autocomplete, 'getFiltersAutoComplete').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            label: 'FILTER_FIELD_TEST_LABEL_KEY',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };

        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.STARTED, { filterField });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_GENERIC_FILTERS_OPTIONS.FAILED, { filterField, errors: ['Mock API error message'] });
    });

    it('FETCH_GENERIC_FILTERS_OPTIONS do not commit any and returns when filter field is missing', async () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('FETCH_SAVED_FILTERS ommits SUCCEEDED mutation on request success', async () => {
        const data = { result: [] };
        const getSavedFiltersSpy = jest.spyOn(api.userPreferences, 'getSavedFilters').mockResolvedValue(data);
        await filter.actions[FilterActionEnum.FETCH_SAVED_FILTERS]({ commit }, { listViewTypeId: 'TEST' });

        expect(getSavedFiltersSpy).toHaveBeenCalledTimes(1);
        expect(getSavedFiltersSpy).toHaveBeenCalledWith({
            params: { uiId: 'TEST' },
        });
        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_SAVED_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_SAVED_FILTERS.SUCCEEDED, { result: [] });
    });

    it('FETCH_SAVED_FILTERS commits FAILED mutation on request failure', async () => {
        const getSavedFiltersSpy = jest.spyOn(api.userPreferences, 'getSavedFilters').mockRejectedValue({});
        await filter.actions[FilterActionEnum.FETCH_SAVED_FILTERS]({ commit }, { listViewTypeId: 'TEST' });

        expect(getSavedFiltersSpy).toHaveBeenCalledTimes(1);
        expect(getSavedFiltersSpy).toHaveBeenCalledWith({
            params: { uiId: 'TEST' },
        });
        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_SAVED_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_SAVED_FILTERS.FAILED);
    });

    it('APPLY_SAVED_FILTERS commits SET_APPLIED_FILTER_IN_SAVE_FILTERS and SET_SAVED_FILTERS_SECTION_ERROR and dispatches SET_APPLIED_FILTERS action', async () => {
        const state = createState({
            filters: {
                fieldMap: {
                    FILTER_FIELD_TEST_1: {
                        id: 'FILTER_FIELD_TEST_1',
                        type: FilterTypeEnum.text,
                    },
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD_TEST_2',
                        type: FilterTypeEnum.text,
                    },
                },
            },
        });
        const payload = {
            savedFilters: {
                id: '421',
                name: 'Test_Filter',
                fields: [
                    {
                        FILTER_FIELD_TEST_1: '14',
                    },
                    {
                        FILTER_FIELD_TEST_2: 'abc',
                    },
                ],
            },
        };

        const expected = { appliedFilters: { FILTER_FIELD_TEST_1: '14', FILTER_FIELD_TEST_2: 'abc' }, isSelectedFromSavedFilters: true };

        filter.actions[FilterActionEnum.APPLY_SAVED_FILTERS]({ state, commit, dispatch }, payload);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: payload.savedFilters });
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.SET_APPLIED_FILTERS, expected);
    });

    it('APPLY_SAVED_FILTERS throws error when exception occurs', async () => {
        const state = {
            filters: {},
        };
        const savedFilters = {
            fields: [],
        };
        const error = new Error('Test error');
        jest.spyOn(savedFilters.fields, 'reduce').mockImplementation(() => {
            throw error;
        });

        await filter.actions[FilterActionEnum.APPLY_SAVED_FILTERS]({ commit, dispatch, state }, { savedFilters }).catch(() => {});

        expect(commit).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('DELETE_SAVED_FILTERS commits succeeded mutation when deleted filter id matches with applied filter id', async () => {
        const state = createState({
            filters: {
                fieldMap: {
                    FILTER_FIELD_TEST_1: {
                        id: 'FILTER_FIELD_TEST_1',
                        type: FilterTypeEnum.text,
                    },
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD_TEST_2',
                        type: FilterTypeEnum.text,
                    },
                },
            },
            appliedFilters: { FILTER_FIELD_TEST_1: ['FILTER_FIELD_TEST_VALUE'] },
            savedFilters: { appliedFilter: { id: 'APPLIED_SAVED_FILTER_1' } },
        });
        const payload = {
            filterId: 'APPLIED_SAVED_FILTER_1',
            listViewTypeId: 'FCLlist',
        };
        jest.spyOn(api.userPreferences, 'deleteSavedFilter').mockResolvedValue({ data: {} });
        jest.spyOn(api.userPreferences, 'getSavedFilters').mockResolvedValue({ data: {} });
        await filter.actions[FilterActionEnum.DELETE_SAVED_FILTERS]({ state, commit, dispatch }, payload);
        expect(api.userPreferences.deleteSavedFilter).toHaveBeenCalledWith(payload.filterId);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.DELETE_SAVED_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.DELETE_SAVED_FILTERS.SUCCEEDED);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId: 'FCLlist' });
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.APPLY_DEFAULT_FILTERS);
    });

    it('DELETE_SAVED_FILTERS throws error for exceptions', async () => {
        const state = createState();
        const payload = {
            filterId: 'APPLIED_SAVED_FILTER_1',
            listViewTypeId: 'FCLlist',
        };
        const error = { message: 'error' };
        jest.spyOn(api.userPreferences, 'deleteSavedFilter').mockRejectedValue(error);

        await filter.actions[FilterActionEnum.DELETE_SAVED_FILTERS]({ commit, dispatch, state }, payload).catch(() => {});

        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.DELETE_SAVED_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.DELETE_SAVED_FILTERS.FAILED);
    });

    it('APPLY_DEFAULT_FILTERS commits SUCCEEDED mutation and dispatch APPLY_SAVED_FILTERS when default filter is available', async () => {
        const userName = 'JohnDoe';
        destinationUtilities.getLoggedInUserDetails.mockReturnValue({ userName });

        const state = createState({
            savedFilters: {
                list: [
                    {
                        id: '80',
                        name: 'Default',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: false,
                        isSystemDefault: true,
                    },
                    {
                        id: '420',
                        name: 'test',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: true,
                        isSystemDefault: false,
                    },
                ],
            },
        });
        await filter.actions[FilterActionEnum.APPLY_DEFAULT_FILTERS]({ commit, dispatch, state });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.SUCCEEDED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS, { appliedFilters: state.savedFilters.list[1] });
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.APPLY_SAVED_FILTERS, { savedFilters: state.savedFilters.list[1] });
    });

    it('APPLY_DEFAULT_FILTERS commits SUCCEEDED mutation and does not set any dispatch APPLY_SAVED_FILTERS when default filter is not available', async () => {
        const userName = 'JohnDoe';
        destinationUtilities.getLoggedInUserDetails.mockReturnValue({ userName });

        const state = createState({
            savedFilters: {
                list: [
                    {
                        id: '80',
                        name: 'Default',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: false,
                        isSystemDefault: false,
                    },
                    {
                        id: '420',
                        name: 'test',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: false,
                        isSystemDefault: false,
                    },
                ],
            },
        });
        await filter.actions[FilterActionEnum.APPLY_DEFAULT_FILTERS]({ commit, dispatch, state });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.SUCCEEDED);
        expect(commit).not.toHaveBeenCalledWith(FilterMutationEnum.SET_APPLIED_FILTER_IN_SAVE_FILTERS);
        expect(dispatch).not.toHaveBeenCalledWith(FilterActionEnum.APPLY_SAVED_FILTERS);
    });

    it('APPLY_DEFAULT_FILTERS commits FAILED mutation for exception', async () => {
        const userName = 'JohnDoe';
        destinationUtilities.getLoggedInUserDetails.mockReturnValue({ userName });

        const state = createState({
            savedFilters: {
                list: [
                    {
                        id: '80',
                        name: 'Default',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: false,
                        isSystemDefault: false,
                    },
                    {
                        id: '420',
                        name: 'test',
                        fields: [
                            {
                                daysTillEstimatedTimeOfArrival: 14,
                            },
                        ],
                        isUserDefault: false,
                        isSystemDefault: false,
                    },
                ],
            },
        });
        const error = new Error('Test error');
        jest.spyOn(savedFilters, 'getDefaultFilter').mockImplementation(() => {
            throw error;
        });

        await filter.actions[FilterActionEnum.APPLY_DEFAULT_FILTERS]({ commit, dispatch, state }).catch(() => {});

        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.APPLY_DEFAULT_FILTERS.FAILED);
    });

    it('SAVE_FILTER commits SUCCESS mutation and calls api to saveFilter and dispatches FETCH_SAVED_FILTERS  ', async () => {
        const state = createState({
            filters: {
                fieldMap: {
                    daysTillEstimatedTimeOfArrival: {
                        id: 'daysTillEstimatedTimeOfArrival',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                    SecondaryExecutiveStatuses: {
                        id: 'SecondaryExecutiveStatuses',
                        label: 'SecondaryExecutiveStatuses',
                        type: 'multiselect',
                    },
                },
            },
        });
        const payload = {
            filterName: 'TEST_FILTER_NAME',
            appliedFilters: {
                daysTillEstimatedTimeOfArrival: 14,
                SecondaryExecutiveStatuses: ['Vessel departed'],
            },
            listViewTypeId: 'FCLList',
        };
        const data = { result: [] };
        const saveFilterSpy = jest.spyOn(api.userPreferences, 'saveFilter').mockResolvedValue(data);
        await filter.actions[FilterActionEnum.SAVE_FILTERS]({ commit, dispatch, state }, payload);
        expect(saveFilterSpy).toHaveBeenCalledTimes(1);
        expect(saveFilterSpy).toHaveBeenCalledWith({
            definition: '{"daysTillEstimatedTimeOfArrival":14,"SecondaryExecutiveStatuses":["Vessel departed"]}',
            isDefault: false,
            name: 'TEST_FILTER_NAME',
            uiId: 'FCLList',
        });

        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SAVE_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SAVE_FILTERS.SUCCEEDED);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId: 'FCLList' });
    });

    it('SAVE_FILTER throws error for exceptions', async () => {
        const state = createState({
            filters: {
                fieldMap: {
                    daysTillEstimatedTimeOfArrival: {
                        id: 'daysTillEstimatedTimeOfArrival',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                },
            },
        });
        const payload = {
            filterName: 'TEST_FILTER_NAME',
            appliedFilters: {
                daysTillEstimatedTimeOfArrival: 14,
            },
            listViewTypeId: 'FCLList',
        };
        const error = { message: 'error' };
        jest.spyOn(api.userPreferences, 'saveFilter').mockRejectedValue(error);

        await filter.actions[FilterActionEnum.SAVE_FILTERS]({ commit, dispatch, state }, payload).catch(() => {});

        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SAVE_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.SAVE_FILTERS.FAILED);
    });

    it('UPDATE_DEFAULT_FILTERS commits SUCCESS mutation and calls api to updateDefaultFilter and dispatches FETCH_SAVED_FILTERS  ', async () => {
        const state = createState({});
        const payload = {
            filterId: 'TEST_FILTER_NAME',
            listViewTypeId: 'FCLList',
            shouldBeDefault: 'true',
        };
        const data = { result: [] };
        const saveFilterSpy = jest.spyOn(api.userPreferences, 'updateDefaultFilter').mockResolvedValue(data);
        await filter.actions[FilterActionEnum.UPDATE_DEFAULT_FILTERS]({ commit, dispatch, state }, payload);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.SUCCEEDED);
        expect(dispatch).toHaveBeenCalledWith(FilterActionEnum.FETCH_SAVED_FILTERS, { listViewTypeId: 'FCLList' });
    });

    it('UPDATE_DEFAULT_FILTERS throws error for exceptions', async () => {
        const state = createState({});
        const payload = {
            filterId: 'TEST_FILTER_NAME',
            listViewTypeId: 'FCLList',
            shouldBeDefault: 'true',
        };
        const error = { message: 'error' };
        jest.spyOn(api.userPreferences, 'updateDefaultFilter').mockRejectedValue(error);

        await filter.actions[FilterActionEnum.UPDATE_DEFAULT_FILTERS]({ commit, dispatch, state }, payload).catch(() => {});

        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.STARTED);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.UPDATE_DEFAULT_FILTERS.FAILED);
    });

    it('FETCH_LAST_UPDATEDBY_USERS fetches Destination Consignees', async () => {
        const data: Array<ILastUpdatedByUser> = [];
        const getUsersSpy = jest.spyOn(api.userDetails, 'getUserDetails').mockResolvedValue(data);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            label: 'FILTER_FIELD_TEST_LABEL',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const searchText = 'test';
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS]({ state, commit }, { id: filterField.id, searchText });

        expect(getUsersSpy).toHaveBeenCalledTimes(1);
        expect(getUsersSpy).toHaveBeenCalledWith({
            params: { searchPhrase: searchText },
            cancelToken: undefined,
        });
        expect(commit).toHaveBeenCalledTimes(2);
    });

    it('FETCH_LAST_UPDATEDBY_USERS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.userDetails, 'getUserDetails').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED, { filterField });
    });

    it('FETCH_LAST_UPDATEDBY_USERS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.userDetails, 'getUserDetails').mockRejectedValue(error);

        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    [filterField.id]: filterField,
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.STARTED, { filterField });
        expect(commit).toHaveBeenCalledWith(FilterMutationEnum.FETCH_LAST_UPDATEDBY_USERS.FAILED, { filterField, errors: ['Mock API error message'] });
    });

    it('FETCH_LAST_UPDATEDBY_USERS do not commit any and returns when filter field is missing', async () => {
        const filterField: IFilterField = {
            id: 'FILTER_FIELD_TEST',
            type: FilterTypeEnum.multiselect,
            multiselect: {
                fetchOptions: {
                    isFetching: false,
                    callback: () => Promise.resolve([]),
                    cancelToken: null,
                },
                options: [],
            },
        };
        const state = createState({
            filters: {
                filtersArray: [],
                filtersMap: {},
                fieldMap: {
                    FILTER_FIELD_TEST_2: {
                        id: 'FILTER_FIELD',
                        label: 'FILTER_FIELD_LABEL',
                        type: 'text',
                    },
                },
            },
        });

        await filter.actions[FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS]({ state, commit }, { id: filterField.id, searchText: 'test' });

        expect(commit).toHaveBeenCalledTimes(0);
    });
});
