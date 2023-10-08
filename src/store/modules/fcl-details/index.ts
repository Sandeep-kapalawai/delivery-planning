import { Module } from 'vuex';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import comments from '../comments';
import { DetailsGetterEnum, DetailsMutationEnum, DetailsActionEnum } from '@/store/static';
import api from '@/data/api';
import { ICargoStuffingDetails } from '@/interfaces';
import { NAMESPACE as COMMENTS_NAMESPACE, CommentsActionEnum } from '@/store/modules/comments/static';

const getDefaultState = (): IState => ({
    details: {
        isFetching: false,
        result: {} as ICargoStuffingDetails,
    },
});

const fclDetails: Module<IState, IRootState> = {
    namespaced: true,

    state: getDefaultState,

    getters: {
        [DetailsGetterEnum.GET_DETAILS](state): {
            isFetching: boolean;
            result: ICargoStuffingDetails;
        } {
            return state.details;
        },
    },

    mutations: {
        [DetailsMutationEnum.RESET_STATE](state) {
            Object.assign(state, getDefaultState());
        },
        [DetailsMutationEnum.FETCH_DETAILS.STARTED](state) {
            state.details.isFetching = true;
        },
        [DetailsMutationEnum.FETCH_DETAILS.SUCCEEDED](state, response: ICargoStuffingDetails) {
            state.details = {
                isFetching: false,
                result: response,
            };
        },
        [DetailsMutationEnum.FETCH_DETAILS.FAILED](state) {
            state.details.isFetching = false;
        },
    },

    actions: {
        [DetailsActionEnum.RESET_STATE]({ commit, dispatch }) {
            commit(DetailsMutationEnum.RESET_STATE);
            dispatch(`${COMMENTS_NAMESPACE}/${CommentsActionEnum.RESET_STATE}`);
        },
        async [DetailsActionEnum.FETCH_DETAILS]({ commit }, cargoStuffingId: number | string) {
            try {
                commit(DetailsMutationEnum.FETCH_DETAILS.STARTED);
                const details = await api.fcl.getCargoStuffingDetails(cargoStuffingId);
                commit(DetailsMutationEnum.FETCH_DETAILS.SUCCEEDED, details);
            } catch (error: any) {
                commit(DetailsMutationEnum.FETCH_DETAILS.FAILED);
                throw error;
            }
        },
    },

    modules: {
        comments,
    },
};

export default fclDetails;
