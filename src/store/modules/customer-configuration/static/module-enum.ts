import { createMutationConstants } from 'destination/store/utilities';

export const NAMESPACE = 'customerConfiguration';

export enum CustomerConfigurationActionEnum {
    FETCH_CONFIGURATION = 'FETCH_CONFIGURATION',
    RESET_CONFIGURATION = 'RESET_CONFIGURATION',
}

export const CustomerConfigurationMutationEnum = {
    FETCH_CONFIGURATION: createMutationConstants(CustomerConfigurationActionEnum.FETCH_CONFIGURATION),
    RESET_CONFIGURATION: CustomerConfigurationActionEnum.RESET_CONFIGURATION,
};

export enum CustomerConfigurationGetterEnum {
    GET_CONFIGURATION = 'GET_CONFIGURATION',
    GET_IS_STOP_OFF_LOCATION_ENABLED = 'GET_IS_STOP_OFF_LOCATION_ENABLED',
}
