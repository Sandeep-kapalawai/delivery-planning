import { Module } from 'vuex';
import { isEmpty } from 'lodash';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { SortingGetterEnum, SortingMutationEnum, SortingActionEnum, SortingTypeEnum } from './static';

const sorting: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        field: '',
        direction: null,
    }),

    getters: {
        [SortingGetterEnum.GET_SORT](state): string | undefined {
            return state.field && state.direction ? `${state.field}:${state.direction}` : undefined;
        },
    },

    mutations: {
        [SortingMutationEnum.SET_SORT](state, { field, direction }: { field: string; direction: SortingTypeEnum | null }) {
            state.field = field;
            state.direction = direction;
        },
    },

    actions: {
        [SortingActionEnum.INITIALIZE]({ state, commit }, { field, direction }: { field: string; direction: SortingTypeEnum | null }) {
            if (isEmpty(state.field) && isEmpty(state.direction)) commit(SortingMutationEnum.SET_SORT, { field, direction });
        },
        [SortingActionEnum.SET_SORT]({ commit }, { field, direction }: { field: string; direction: SortingTypeEnum }) {
            commit(SortingMutationEnum.SET_SORT, { field, direction });
        },
    },
};

export default sorting;
