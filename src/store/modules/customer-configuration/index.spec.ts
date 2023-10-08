//@ts-nocheck
import customerConfiguration from '.';
import { IState } from './interfaces';
import { CustomerConfigurationGetterEnum, CustomerConfigurationMutationEnum, CustomerConfigurationActionEnum } from './static';
import { ICustomerConfiguration } from '@/interfaces';
import api from '@/data/api';

const createState = (overrides?: Partial<IState>): IState => ({
    configuration: {
        isFetching: false,
        response: undefined,
    },
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(customerConfiguration.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_CONFIGURATION returns configuration from state', () => {
        const { configuration } = createState({ configuration: { isFetching: false, response: {} } });

        expect(customerConfiguration.getters[CustomerConfigurationGetterEnum.GET_CONFIGURATION]({ configuration })).toEqual(configuration);
    });

    it('GET_IS_STOP_OFF_LOCATION_ENABLED returns false if response is not available in state', () => {
        const { configuration } = createState({ configuration: { isFetching: false, response: undefined } });

        expect(customerConfiguration.getters[CustomerConfigurationGetterEnum.GET_IS_STOP_OFF_LOCATION_ENABLED]({ configuration })).toBeFalsy();
    });

    it('GET_IS_STOP_OFF_LOCATION_ENABLED returns isStopOffLocationEnable from state', () => {
        const { configuration } = createState({
            configuration: { isFetching: false, response: { customerConfigurationData: { stopOffLocationConfig: { isStopOffLocationEnable: true } } } },
        });

        expect(customerConfiguration.getters[CustomerConfigurationGetterEnum.GET_IS_STOP_OFF_LOCATION_ENABLED]({ configuration })).toEqual(
            configuration.response?.customerConfigurationData.stopOffLocationConfig.isStopOffLocationEnable,
        );
    });
});

describe('mutations', () => {
    it('FETCH_CONFIGURATION.STARTED sets configuration.isFetching in state', () => {
        const state = createState({
            configuration: {
                isFetching: false,
                response: undefined,
            },
        });

        customerConfiguration.mutations[CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.STARTED](state);

        expect(state).toEqual(
            createState({
                configuration: {
                    isFetching: true,
                    response: undefined,
                },
            }),
        );
    });

    it('FETCH_CONFIGURATION.SUCCEEDED sets configuration in state', () => {
        const state = createState({
            configuration: {
                isFetching: true,
                response: undefined,
            },
        });

        customerConfiguration.mutations[CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.SUCCEEDED](state, <ICustomerConfiguration>{
            customerBECode: 'TEST_CUSTOMER_BE_CODE',
            customerConfigurationData: {},
        });

        expect(state).toEqual(
            createState({
                configuration: {
                    isFetching: false,
                    response: {
                        customerBECode: 'TEST_CUSTOMER_BE_CODE',
                        customerConfigurationData: {},
                    },
                },
            }),
        );
    });

    it('FETCH_CONFIGURATION.FAILED sets configuration.isFetching in state', () => {
        const state = createState({
            configuration: {
                isFetching: true,
                response: undefined,
            },
        });

        customerConfiguration.mutations[CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.FAILED](state);

        expect(state).toEqual(
            createState({
                configuration: {
                    isFetching: false,
                    response: undefined,
                },
            }),
        );
    });

    it('RESET_CONFIGURATION resets configuration in state', () => {
        const state = createState({ configuration: { isFetching: false, response: { customerConfigurationData: {} } } });

        customerConfiguration.mutations[CustomerConfigurationMutationEnum.RESET_CONFIGURATION](state);

        expect(state).toEqual(createState({ configuration: { isFetching: false, response: undefined } }));
    });
});

describe('actions', () => {
    it('FETCH_CONFIGURATION does not commit any mutations if customerBECode is not available', async () => {
        const commit = jest.fn();

        await customerConfiguration.actions[CustomerConfigurationActionEnum.FETCH_CONFIGURATION]({ commit }, { customerBECode: undefined });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('FETCH_CONFIGURATION commits SUCCEEDED mutation on request success', async () => {
        const response: ICustomerConfiguration = { customerBECode: 'TEST_CUSTOMER_BE_CODE', customerConfigurationData: {} };
        jest.spyOn(api.customerConfiguration, 'getCustomerConfiguration').mockResolvedValue(response);

        const commit = jest.fn();

        await customerConfiguration.actions[CustomerConfigurationActionEnum.FETCH_CONFIGURATION]({ commit }, { customerBECode: 'TEST_CUSTOMER_BE_CODE' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.STARTED);
        expect(commit).toHaveBeenCalledWith(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.SUCCEEDED, response);
    });

    it('FETCH_CONFIGURATION commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.customerConfiguration, 'getCustomerConfiguration').mockRejectedValue(error);

        const commit = jest.fn();

        await customerConfiguration.actions[CustomerConfigurationActionEnum.FETCH_CONFIGURATION]({ commit }, { customerBECode: 'TEST_CUSTOMER_BE_CODE' }).catch(
            () => {
                // This is intentional
            },
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.STARTED);
        expect(commit).toHaveBeenCalledWith(CustomerConfigurationMutationEnum.FETCH_CONFIGURATION.FAILED);
    });

    it('RESET_CONFIGURATION commits RESET_CONFIGURATION mutation', () => {
        const commit = jest.fn();

        customerConfiguration.actions[CustomerConfigurationActionEnum.RESET_CONFIGURATION]({ commit });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(CustomerConfigurationMutationEnum.RESET_CONFIGURATION);
    });
});
