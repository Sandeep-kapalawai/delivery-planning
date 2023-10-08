import { Module } from 'vuex';
import { cloneDeep } from 'lodash';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';
import { CustomerConfigurationGetterEnum, CustomerConfigurationMutationEnum, CustomerConfigurationActionEnum } from './static';
import { ICustomerConfiguration } from '@/interfaces';
import api from '@/data/api';

const customerConfiguration: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        configuration: {
            isFetching: false,
            response: undefined,
        },
    }),

    getters: {
        [CustomerConfigurationGetterEnum.GET_CONFIGURATION](state): { isFetching: boolean; response?: ICustomerConfiguration } {
            return state.configuration;
        },
        [CustomerConfigurationGetterEnum.GET_IS_STOP_OFF_LOCATION_ENABLED](state): boolean {
            return !!state.configuration.response?.customerConfigurationData.stopOffLocationConfig.isStopOffLocationEnable;
        },
    },

    mutations: {
        [CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.STARTED](state) {
            state.configuration.isFetching = true;
        },
        [CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.SUCCEEDED](state, response: ICustomerConfiguration) {
            state.configuration = {
                isFetching: false,
                response: cloneDeep(response),
            };
        },
        [CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.FAILED](state) {
            state.configuration.isFetching = false;
        },
        [CustomerConfigurationMutationEnum.RESET_CONFIGURATION](state) {
            state.configuration = {
                isFetching: false,
                response: undefined,
            };
        },
    },

    actions: {
        async [CustomerConfigurationActionEnum.FETCH_CONFIGURATION]({ commit }, { customerBECode }: { customerBECode: string }) {
            if (!customerBECode) {
                return;
            }

            try {
                commit(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.STARTED);
                const response: ICustomerConfiguration = await api.customerConfiguration.getCustomerConfiguration(customerBECode);
                commit(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.SUCCEEDED, response);
            } catch (error: any) {
                commit(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.FAILED);
                throw error;
            }
        },
        [CustomerConfigurationActionEnum.RESET_CONFIGURATION]({ commit }) {
            commit(CustomerConfigurationMutationEnum.RESET_CONFIGURATION);
        },
    },
};

export default customerConfiguration;
