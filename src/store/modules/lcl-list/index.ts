import { Module } from 'vuex';
import axios from 'axios';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';
import { LclListGetterEnum, LclListMutationEnum, LclListActionEnum } from './static';
import { ListGetterEnum, ListMutationEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingGetterEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum } from '@/store/modules/pagination/static';
import tableConfiguration from '../table-configuration';
import sorting from '../sorting';
import pagination from '../pagination';
import api from '@/data/api';
import { ILclList, ILclListItem } from '@/interfaces';

const lclList: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        list: {
            isFetching: false,
            cancelToken: null,
            result: [],
            resultTotalCount: 0,
        },
        selectedRows: new Map(),
    }),

    getters: {
        [ListGetterEnum.GET_LIST](state): {
            isFetching: boolean;
            result: Array<ILclListItem>;
            resultTotalCount: number;
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
        [ListMutationEnum.FETCH_LIST.SUCCEEDED](state, response: ILclList) {
            state.list = {
                isFetching: false,
                cancelToken: null,
                result: response.result,
                resultTotalCount: response.resultTotalCount,
            };
        },
        [ListMutationEnum.FETCH_LIST.FAILED](state, message: string) {
            state.list.isFetching = false;
            state.list.cancelToken = null;
        },
    },

    actions: {
        async [ListActionEnum.FETCH_LIST]({ state, commit, getters }) {
            try {
                commit(ListMutationEnum.FETCH_LIST.STARTED);
                const sortParams = getters[`${SORTING_NAMESPACE}/${SortingGetterEnum.GET_SORT}`];
                const paginationParams = getters[`${PAGINATION_NAMESPACE}/${PaginationGetterEnum.GET_PAGINATION}`];
                const data = await api.lcl.getLclList({
                    params: {
                        sort: sortParams,
                        ...paginationParams,
                    },
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
        sorting,
        pagination,
    },
};

export default lclList;
