//@ts-nocheck
import purchaseOrdersList from '.';
import { IState } from './interfaces';
import axios from 'axios';
import api from '@/data/api';
import { ListActionEnum, ListGetterEnum, ListMutationEnum } from '@/store/static';

const createState = (overrides?: Partial<IState>): IState => ({
    list: {
        isFetching: false,
        cancelToken: null,
        poskUs: [],
        stockKeepingUnitDataSummary: undefined,
    },
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(purchaseOrdersList.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_LIST returns response from state', () => {
        const { list } = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                poskUs: [{ id: '1' }],
                stockKeepingUnitDataSummary: { id: '1' },
            },
        });

        expect(purchaseOrdersList.getters[ListGetterEnum.GET_LIST]({ list })).toEqual(list);
    });
});

describe('mutations', () => {
    it('FETCH_LIST.STARTED sets list.isFetching and list.cancelToken in state', () => {
        const state = createState({
            list: {
                isFetching: false,
                cancelToken: null,
                poskUs: [],
                stockKeepingUnitDataSummary: undefined,
            },
        });
        purchaseOrdersList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: true,
                    cancelToken: state.list.cancelToken,
                    poskUs: [],
                    stockKeepingUnitDataSummary: undefined,
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
                poskUs: [],
                stockKeepingUnitDataSummary: undefined,
            },
        });

        purchaseOrdersList.mutations[ListMutationEnum.FETCH_LIST.STARTED](state);

        expect(state.list.cancelToken).not.toEqual(cancelToken);
    });

    it('FETCH_LIST.SUCCEEDED sets list in state', () => {
        const state = createState();
        purchaseOrdersList.mutations[ListMutationEnum.FETCH_LIST.SUCCEEDED](state, { poskUs: [{ id: '1' }], stockKeepingUnitDataSummary: { id: '1' } });

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: false,
                    cancelToken: null,
                    poskUs: [{ id: '1' }],
                    stockKeepingUnitDataSummary: { id: '1' },
                },
            }),
        );
    });

    it('FETCH_LIST.FAILED sets details.isFetching in state', () => {
        const state = createState({
            list: {
                isFetching: true,
                cancelToken: axios.CancelToken.source(),
                poskUs: [],
                stockKeepingUnitDataSummary: undefined,
            },
        });

        purchaseOrdersList.mutations[ListMutationEnum.FETCH_LIST.FAILED](state);

        expect(state).toEqual(
            createState({
                list: {
                    isFetching: false,
                    cancelToken: null,
                    poskUs: [],
                    stockKeepingUnitDataSummary: undefined,
                },
            }),
        );
    });
});

describe('actions', () => {
    it('FETCH_LIST commits SUCCEEDED mutation on request success', async () => {
        const data = {
            poskUs: [{ id: '1' }],
            stockKeepingUnitDataSummary: { id: '1' },
        };
        jest.spyOn(api.purchaseOrders, 'getPOList').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();

        await purchaseOrdersList.actions[ListActionEnum.FETCH_LIST]({ state, commit }, 1000);

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.SUCCEEDED, data);
    });

    it('FETCH_LIST does not commit any mutation on request cancel', async () => {
        const error = { message: 'error' };
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        jest.spyOn(api.purchaseOrders, 'getPOList').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();

        await purchaseOrdersList.actions[ListActionEnum.FETCH_LIST]({ state, commit }, { cargoStuffingId: 100 });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
    });

    it('FETCH_LIST commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.purchaseOrders, 'getPOList').mockRejectedValue(error);
        jest.spyOn(axios, 'isCancel').mockReturnValue(false);
        const state = createState();
        const commit = jest.fn();

        await purchaseOrdersList.actions[ListActionEnum.FETCH_LIST]({ state, commit }, 1000).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.STARTED);
        expect(commit).toHaveBeenCalledWith(ListMutationEnum.FETCH_LIST.FAILED, error.message);
    });
});
