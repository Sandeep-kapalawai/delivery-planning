import { Module } from 'vuex';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { PaginationGetterEnum, PaginationMutationEnum, PaginationActionEnum, getMainListPageSizeOptions } from './static';
import { PageSizeOption } from '@/interfaces';

const DEFAULT_PAGE_SIZE_OPTIONS: Array<PageSizeOption> = getMainListPageSizeOptions();

const pagination: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
        limit: DEFAULT_PAGE_SIZE_OPTIONS[0].value,
        page: 1,
    }),

    getters: {
        [PaginationGetterEnum.GET_PAGE_SIZE_OPTIONS](state): Array<PageSizeOption> {
            return state.pageSizeOptions;
        },
        [PaginationGetterEnum.GET_LIMIT](state): number {
            return state.limit;
        },
        [PaginationGetterEnum.GET_PAGE](state): number {
            return state.page;
        },
        [PaginationGetterEnum.GET_PAGINATION](state): { limit: number; page: number } {
            return { limit: state.limit, page: state.page };
        },
    },

    mutations: {
        [PaginationMutationEnum.SET_PAGE_SIZE_OPTIONS](state, { pageSizeOptions }: { pageSizeOptions: Array<PageSizeOption> }) {
            state.pageSizeOptions = pageSizeOptions;
        },
        [PaginationMutationEnum.SET_LIMIT](state, { limit }: { limit: number }) {
            state.limit = limit;
        },
        [PaginationMutationEnum.SET_PAGE](state, { page }: { page: number }) {
            state.page = page;
        },
    },

    actions: {
        [PaginationActionEnum.INITIALIZE]({ commit }, { pageSizeOptions }: { pageSizeOptions: Array<PageSizeOption> }) {
            commit(PaginationMutationEnum.SET_PAGE_SIZE_OPTIONS, { pageSizeOptions });
            commit(PaginationMutationEnum.SET_LIMIT, { limit: pageSizeOptions[0].value });
        },
        [PaginationActionEnum.SET_LIMIT]({ commit }, { limit }: { limit: number }) {
            commit(PaginationMutationEnum.SET_LIMIT, { limit });
        },
        [PaginationActionEnum.SET_PAGE]({ commit }, { page }: { page: number }) {
            commit(PaginationMutationEnum.SET_PAGE, { page });
        },
    },
};

export default pagination;
