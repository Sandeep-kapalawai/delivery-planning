//@ts-nocheck
import axios from 'axios';
import lclList from '.';
import { IState } from './interfaces';
import { LclListGetterEnum, LclListMutationEnum, LclListActionEnum } from './static';
import { ListGetterEnum, ListMutationEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import api from '@/data/api';
import { ILclList } from '@/interfaces';

const createState = (overrides?: Partial<IState>): IState => ({
    list: {
        isFetching: false,
        cancelToken: null,
        result: [],
        resultTotalCount: 0,
    },
    selectedRows: new Map(),
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(lclList.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_LIST returns list from state', () => {
        const { list } = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                result: [{ id: '1' }],
                resultTotalCount: 1,
            },
        });

        expect(lclList.getters[ListGetterEnum.GET_LIST]({ list })).toEqual(list);
    });
});

describe('mutations', () => {
    it('FETCH_LIST.STARTED sets list.isFetching and list.cancelToken in state', () => {
        const state = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                result: [],
                resultTotalCount: 0,
            },
        });

        lclList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: true,
                    cancelToken: state.list.cancelToken,
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

        lclList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state.list.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_LIST.SUCCEEDED sets list in state', () => {
        const state = createState();

        lclList.mutations[ListMutationEnum.FETCH_LIST.SUCCEEDED](state, <ILclList>{
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

        lclList.mutations[ListMutationEnum.FETCH_LIST.FAILED](state, errorMessage);

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
});

describe('actions', () => {
    it('FETCH_LIST commits SUCCEEDED mutation on request success', async () => {
        const data = {
            result: [],
            resultTotalCount: 0,
            pageNumber: 1,
            pageSize: 10,
        };
        jest.spyOn(api.lcl, 'getLclList').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await lclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.SUCCEEDED, data);
    });

    it('FETCH_LIST does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.lcl, 'getLclList').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await lclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
    });

    it('FETCH_LIST commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        jest.spyOn(api.lcl, 'getLclList').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();
        const getters = {
            [`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`]: () => undefined,
            [`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`]: () => {},
        };

        await lclList.actions[ListActionEnum.FETCH_LIST]({ state, commit, getters }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.FAILED, error.message);
    });
});
