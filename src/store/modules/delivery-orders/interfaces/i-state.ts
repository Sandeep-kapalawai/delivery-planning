import { IDeliveryOrders, IReasonCodes, ITransportplanItems } from '@/interfaces';

export interface IState {
    deliveryOrders: {
        isFetching: boolean;
        transportPlansData: IDeliveryOrders;
    };
    reasonCodes: {
        isFetching: boolean;
        result: Array<IReasonCodes>;
    };
    sendDeliveryOrdersResult: {
        isFetching: boolean;
        result: any;
    };
}
