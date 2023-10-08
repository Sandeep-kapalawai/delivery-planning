import { ICustomizableField, ICustomizableFieldPayload, IServicePlan } from '@/interfaces';

export interface IState {
    deliveryPlan: {
        isFetching: boolean;
        isSaving: boolean;
        isSending: boolean;
        response: IServicePlan;
    };
    additionalReference: {
        isFetching: boolean;
        response: Array<ICustomizableField>;
        payload: Map<number, ICustomizableFieldPayload>;
    };
}
