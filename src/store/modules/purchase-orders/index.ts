import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { Module } from 'vuex';
import api from '@/data/api';
import axios from 'axios';
import { CustomerOrderLineModel, CustomerOrderLinesResult, IDeliveryPlanIdQueryParam, StockKeepingUnitDataSummary } from '@/interfaces';
import { ListGetterEnum, ListMutationEnum, ListActionEnum } from '@/store/static';
import tableConfiguration from '../table-configuration';

const purchaseOrdersList: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        list: {
            isFetching: false,
            cancelToken: null,
            poskUs: [],
            stockKeepingUnitDataSummary: undefined,
        },
    }),

    getters: {
        [ListGetterEnum.GET_LIST](state): {
            isFetching: boolean;
            poskUs: Array<CustomerOrderLineModel>;
            stockKeepingUnitDataSummary?: StockKeepingUnitDataSummary;
        } {
            return state.list;
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
        [ListMutationEnum.FETCH_LIST.SUCCEEDED](state, response: CustomerOrderLinesResult) {
            state.list = {
                isFetching: false,
                cancelToken: null,
                poskUs: response.poskUs,
                stockKeepingUnitDataSummary: response.stockKeepingUnitDataSummary,
            };
        },
        [ListMutationEnum.FETCH_LIST.FAILED](state) {
            state.list.isFetching = false;
            state.list.cancelToken = null;
        },
    },

    actions: {
        async [ListActionEnum.FETCH_LIST]({ state, commit }, params: IDeliveryPlanIdQueryParam) {
            try {
                commit(ListMutationEnum.FETCH_LIST.STARTED);
                const data = await api.purchaseOrders.getPOList({
                    params,
                    cancelToken: state.list.cancelToken?.token,
                });
                commit(ListMutationEnum.FETCH_LIST.SUCCEEDED, data);
            } catch (error: any) {
                if (!axios.isCancel(error)) {
                    commit(ListMutationEnum.FETCH_LIST.FAILED, error?.message);
                    throw error;
                }
            }
        },
    },

    modules: {
        tableConfiguration,
    },
};

export default purchaseOrdersList;
