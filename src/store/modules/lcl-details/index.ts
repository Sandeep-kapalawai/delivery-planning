import { Module } from 'vuex';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { DetailsGetterEnum } from '@/store/static';

const lclDetails: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        details: {
            isFetching: false,
            errorMessages: [],
            result: {},
        },
    }),

    getters: {
        [DetailsGetterEnum.GET_DETAILS](state): {
            isFetching: boolean;
            result: any;
        } {
            return state.details;
        },
    },

    mutations: {},

    actions: {},
};

export default lclDetails;
