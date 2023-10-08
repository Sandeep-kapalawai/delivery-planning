import { ICustomerConfiguration } from '@/interfaces';

export interface IState {
    configuration: {
        isFetching: boolean;
        response?: ICustomerConfiguration;
    };
}
