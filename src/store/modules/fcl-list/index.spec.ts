//@ts-nocheck
import axios from 'axios';
import fclList from '.';
import { IState } from './interfaces';
import { ListGetterEnum, ListMutationEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterGetterEnum } from '@/store/modules/filter/static';
import { NAMESPACE as QUICK_FILTERS_NAMESPACE, QuickFilterGetterEnum } from '@/store/modules/quick-filters/static';
import api from '@/data/api';
import { IFclList } from '@/interfaces';

const createState = (overrides?: Partial<IState>): IState => ({
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
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(fclList.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_LIST returns list from state', () => {
        const { list } = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                errorMessage: '',
                result: [{ id: '1' }],
                resultTotalCount: 1,
            },
        });

        expect(fclList.getters[ListGetterEnum.GET_LIST]({ list })).toEqual(list);
    });

    it('GET_IMPORT_EXCEL returns importExportAnExcel from state', () => {
        const { importExportAnExcel } = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: false,
                isImportingError: false,
                isFileImported: false,
            },
        });

        expect(fclList.getters[ListGetterEnum.GET_IMPORT_EXCEL]({ importExportAnExcel })).toEqual(importExportAnExcel);
    });

    it('GET_SELECTED_ROWS returns selectedRows from state', () => {
        const { selectedRows } = createState({
            selectedRows: new Map(),
        });

        expect(fclList.getters[ListGetterEnum.GET_SELECTED_ROWS]({ selectedRows })).toEqual(selectedRows);
    });
});

describe('mutations', () => {
    it('FETCH_LIST.STARTED sets list.isFetching and list.cancelToken in state', () => {
        const state = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                errorMessage: '',
                result: [],
                resultTotalCount: 0,
            },
        });

        fclList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: true,
                    cancelToken: state.list.cancelToken,
                    errorMessage: '',
                    result: [],
                    resultTotalCount: 0,
                },
            }),
        );
    });

    it('FETCH_LIST.STARTED cancels existing list.cancelToken and sets a new list.cancelToken in state', () => {
        const cancelToken = axios.CancelToken.source();
        const state = createState({
            list: {
                isFetching: false,
                cancelToken,
                result: [],
                resultTotalCount: 0,
            },
        });

        fclList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state.list.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_LIST.SUCCEEDED sets list in state', () => {
        const state = createState();

        fclList.mutations[ListMutationEnum.FETCH_LIST.SUCCEEDED](state, <IFclList>{
            result: [{ id: '1' }],
            resultTotalCount: 1,
        });

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: false,
                    cancelToken: null,
                    result: [{ id: '1' }],
                    resultTotalCount: 1,
                },
            }),
        );
    });

    it('FETCH_LIST.FAILED sets list.isFetching and list.cancelToken in state', () => {
        const state = createState({
            list: {
                isFetching: true,
                cancelToken: axios.CancelToken.source(),
                result: [],
                resultTotalCount: 0,
            },
        });
        const errorMessage = 'error';

        fclList.mutations[ListMutationEnum.FETCH_LIST.FAILED](state, errorMessage);

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: false,
                    cancelToken: null,
                    result: [],
                    resultTotalCount: 0,
                },
            }),
        );
    });

    it('ADD_TO_SELECTED_ROWS adds rows to selectedRows in state', () => {
        const state = createState({
            selectedRows: new Map([['TEST_ID_1', { deliveryPlanId: 'TEST_ID_1' }]]),
        });
        const rows = [{ deliveryPlanId: 'TEST_ID_1' }, { deliveryPlanId: 'TEST_ID_2' }];

        fclList.mutations[ListMutationEnum.ADD_TO_SELECTED_ROWS](state, { rows });

        expect(state).toEqual(
            createState({
                selectedRows: new Map([
                    ['TEST_ID_1', { deliveryPlanId: 'TEST_ID_1' }],
                    ['TEST_ID_2', { deliveryPlanId: 'TEST_ID_2' }],
                ]),
            }),
        );
    });

    it('REMOVE_FROM_SELECTED_ROWS removes rows from selectedRows in state', () => {
        const state = createState({
            selectedRows: new Map([['TEST_ID_1', { deliveryPlanId: 'TEST_ID_1' }]]),
        });
        const rows = [{ deliveryPlanId: 'TEST_ID_1' }, { deliveryPlanId: 'TEST_ID_2' }];

        fclList.mutations[ListMutationEnum.REMOVE_FROM_SELECTED_ROWS](state, { rows });

        expect(state).toEqual(createState());
    });

    it('CLEAR_SELECTED_ROWS removes all the rows from selectedRows in state', () => {
        const state = createState({
            selectedRows: new Map([
                ['TEST_ID_1', { deliveryPlanId: 'TEST_ID_1' }],
                ['TEST_ID_2', { deliveryPlanId: 'TEST_ID_2' }],
            ]),
        });

        fclList.mutations[ListMutationEnum.CLEAR_SELECTED_ROWS](state);

        expect(state).toEqual(createState());
    });

    it('IMPORT_AN_EXCEL.STARTED sets importExportAnExcel.isImporting and importExportAnExcel.isImportingError in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isImportingError: false,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.IMPORT_AN_EXCEL.STARTED](state);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: true,
                    isImportingError: false,
                    isFileImported: false,
                },
            }),
        );
    });

    it('IMPORT_AN_EXCEL.SUCCEEDED sets importExportAnExcel in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isImportingError: false,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.IMPORT_AN_EXCEL.SUCCEEDED](state, <IFclList>{
            data: { success: false },
        });

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: false,
                    isImportingError: false,

                    isFileImported: true,
                },
            }),
        );
    });

    it('IMPORT_AN_EXCEL.SUCCEEDED sets importExportAnExcel in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isImportingError: false,
                isFileImported: false,
            },
        });
        const data = {
            success: true,
        };
        fclList.mutations[ListMutationEnum.IMPORT_AN_EXCEL.SUCCEEDED](state, data);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: false,
                    isImportingError: false,
                    isFileImported: true,
                },
            }),
        );
    });

    it('IMPORT_AN_EXCEL.FAILED sets importExportAnExcel in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isFileImported: false,
            },
        });
        const error = {};
        fclList.mutations[ListMutationEnum.IMPORT_AN_EXCEL.FAILED](state, error);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: false,
                    isFileImported: false,
                },
            }),
        );
    });

    it('IMPORT_AN_EXCEL.FAILED sets state with data', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isFileImported: false,
            },
        });
        const error = { response: { data: { Errors: ['Test error message'] } } };
        fclList.mutations[ListMutationEnum.IMPORT_AN_EXCEL.FAILED](state, error);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: false,
                    isFileImported: false,
                },
            }),
        );
    });

    it('CLEAR_IMPORT_FILES sets in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.CLEAR_IMPORT_FILES](state);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: false,
                    isFileImported: false,
                },
            }),
        );
    });

    it('EXPORT_EXCEL.STARTED sets isExporting true in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: true,
                isImporting: true,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.EXPORT_EXCEL.STARTED](state);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: true,
                    isImporting: true,
                    isFileImported: false,
                },
            }),
        );
    });

    it('EXPORT_EXCEL.SUCCEEDED sets isExporting false in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.EXPORT_EXCEL.SUCCEEDED](state);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: true,
                    isFileImported: false,
                },
            }),
        );
    });

    it('EXPORT_EXCEL.FAILED sets isExporting false in state', () => {
        const state = createState({
            importExportAnExcel: {
                isExporting: false,
                isImporting: true,
                isFileImported: false,
            },
        });

        fclList.mutations[ListMutationEnum.EXPORT_EXCEL.FAILED](state);

        expect(state).toEqual(
            createState({
                importExportAnExcel: {
                    isExporting: false,
                    isImporting: true,
                    isFileImported: false,
                },
            }),
        );
    });
});

describe('actions', () => {
    it('FETCH_LIST commits SUCCEEDED mutation on request success', async () => {
        const data = {
            result: [],
            resultTotalCount: 0,
            pageNumber: 1,
            pageSize: 10,
        };
        jest.spyOn(api.fcl, 'getFclList').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };

        await fclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.SUCCEEDED, data);
    });

    it('FETCH_LIST does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getFclList').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };

        await fclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
    });

    it('FETCH_LIST commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getFclList').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };

        await fclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.FAILED, error.message);
    });

    it('ADD_TO_SELECTED_ROWS commits ADD_TO_SELECTED_ROWS mutation', async () => {
        const commit = jest.fn();
        const rows = [{ transportDocumentId: 1 }, { transportDocumentId: 2 }];

        await fclList.actions[ListActionEnum.ADD_TO_SELECTED_ROWS]({ commit }, { rows });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.ADD_TO_SELECTED_ROWS, { rows });
    });

    it('REMOVE_FROM_SELECTED_ROWS commits REMOVE_FROM_SELECTED_ROWS mutation', async () => {
        const commit = jest.fn();
        const rows = [{ transportDocumentId: 1 }, { transportDocumentId: 2 }];

        await fclList.actions[ListActionEnum.REMOVE_FROM_SELECTED_ROWS]({ commit }, { rows });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.REMOVE_FROM_SELECTED_ROWS, { rows });
    });

    it('CLEAR_SELECTED_ROWS commits CLEAR_SELECTED_ROWS mutation', async () => {
        const commit = jest.fn();

        await fclList.actions[ListActionEnum.CLEAR_SELECTED_ROWS]({ commit });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.CLEAR_SELECTED_ROWS);
    });

    it('action IMPORT_EXCEL is setting data on STARTED', async () => {
        const spyAPIPost = jest.spyOn(api.fcl, 'importServicePlan').mockResolvedValue(<any>{
            data: { success: true },
        });

        const state = createState();
        const commit = jest.fn();

        await fclList.actions[ListActionEnum.IMPORT_AN_EXCEL]({ state, commit });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.IMPORT_AN_EXCEL.STARTED);

        spyAPIPost.mockClear();
    });

    it('action IMPORT_EXCEL is setting data on SUCCEEDED', async () => {
        const spyAPIPost = jest.spyOn(api.fcl, 'importServicePlan').mockResolvedValue(<any>{
            response: { data: { Errors: ['Test error message'] } },
        });
        const error = { message: 'error' };
        const state = createState();
        const commit = jest.fn();

        await fclList.actions[ListActionEnum.IMPORT_AN_EXCEL]({ state, commit, error }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.IMPORT_AN_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.IMPORT_AN_EXCEL.SUCCEEDED, { response: { data: { Errors: ['Test error message'] } } });

        spyAPIPost.mockClear();
    });

    it('action IMPORT_EXCEL is setting data on SUCCEEDED', async () => {
        const error = { message: 'error' };
        const spyAPIPost = jest.spyOn(api.fcl, 'importServicePlan').mockRejectedValue(<any>error);

        const state = createState();
        const commit = jest.fn();

        await fclList.actions[ListActionEnum.IMPORT_AN_EXCEL]({ state, commit, error }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.IMPORT_AN_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.IMPORT_AN_EXCEL.FAILED, { message: 'error' });

        spyAPIPost.mockClear();
    });

    it('EXPORT_CSA_BULK_UPDATE commits SUCCEEDED mutation on request success', async () => {
        const data = {
            /* your data object */
        };
        jest.spyOn(api.fcl, 'getCSAExportExcelForBulkEdit').mockResolvedValue({ data });

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => '[Function sorting/GET_SORT]',
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTERS}`]: () => ({
                Consignee: ['TEST_CONSIGNEE_1', 'TEST_CONSIGNEE_2'],
            }),
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => ({
                consignee: 'TEST_CONSIGNEE_1,TEST_CONSIGNEE_2',
            }),
        };

        const rootGetters = {
            [`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS}`]: () => [],
        };

        const page = 1;
        const cargoStuffingId = [1];
        await fclList.actions[ListActionEnum.EXPORT_CSA_BULK_UPDATE]({ state, commit, getters, rootGetters }, { page, cargoStuffingId });

        expect(commit).toHaveBeenCalledTimes(2);

        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, { data: {} });
    });

    it('EXPORT_CSA_BULK_UPDATE does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getCSAExportExcelForBulkEdit').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_BULK_UPDATE]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CSA_BULK_UPDATE commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getCSAExportExcelForBulkEdit').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_BULK_UPDATE]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CONSIGNEE_BULK_UPDATE commits SUCCEEDED mutation on request success', async () => {
        const data = {
            /* your data object */
        };
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForBulkEdit').mockResolvedValue({ data });

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => '[Function sorting/GET_SORT]',
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTERS}`]: () => ({
                Consignee: ['TEST_CONSIGNEE_1', 'TEST_CONSIGNEE_2'],
            }),
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => ({
                consignee: 'TEST_CONSIGNEE_1,TEST_CONSIGNEE_2',
            }),
        };

        const rootGetters = {
            [`${QUICK_FILTERS_NAMESPACE}/${QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS}`]: () => [],
        };

        const page = 1;
        const cargoStuffingId = [1];
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE]({ state, commit, getters, rootGetters }, { page, cargoStuffingId });

        expect(commit).toHaveBeenCalledTimes(2);

        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, { data: {} });
    });

    it('EXPORT_CONSIGNEE_BULK_UPDATE does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForBulkEdit').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CONSIGNEE_BULK_UPDATE commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForBulkEdit').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CSA_WITH_CURRENT_COLUMNS commits SUCCEEDED mutation on request success', async () => {
        const data = {
            /* your data object */
        };
        jest.spyOn(api.fcl, 'getCSAExportExcelForSelectedColumns').mockResolvedValue({ data });

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => '[Function sorting/GET_SORT]',
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTERS}`]: () => ({
                Consignee: ['TEST_CONSIGNEE_1', 'TEST_CONSIGNEE_2'],
            }),
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => ({
                consignee: 'TEST_CONSIGNEE_1,TEST_CONSIGNEE_2',
            }),
        };
        const page = 1;
        const cargoStuffingId = [1];
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS]({ state, commit, getters }, { page, cargoStuffingId });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, { data: {} });
    });

    it('EXPORT_CSA_WITH_CURRENT_COLUMNS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getCSAExportExcelForSelectedColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CSA_WITH_CURRENT_COLUMNS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getCSAExportExcelForSelectedColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CSA_WITH_ALL_COLUMNS commits SUCCEEDED mutation on request success', async () => {
        const data = {
            isExporting: false,
            isImporting: false,
            isFileImported: false,
        };
        jest.spyOn(api.fcl, 'getCSAExportExcelForAllColumns').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
    });

    it('EXPORT_CSA_WITH_ALL_COLUMNS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getCSAExportExcelForAllColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CSA_WITH_ALL_COLUMNS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getCSAExportExcelForAllColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.FAILED, error.message);
    });

    it('EXPORT_CONSIGNEE_WITH_ALL_COLUMNS commits SUCCEEDED mutation on request success', async () => {
        const data = {
            isExporting: false,
            isImporting: false,
            isFileImported: false,
        };
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForAllColumns').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.SUCCEEDED, data);
    });

    it('EXPORT_CONSIGNEE_WITH_ALL_COLUMNS does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForAllColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
    });

    it('EXPORT_CONSIGNEE_WITH_ALL_COLUMNS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.fcl, 'getConsigneeExportExcelForAllColumns').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
            [`${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`]: () => {},
        };
        const headers = {
            customers: 'abc',
        };
        await fclList.actions[ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS]({ state, commit, getters, headers }, { page: 1 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.EXPORT_EXCEL.FAILED, error.message);
    });
});
