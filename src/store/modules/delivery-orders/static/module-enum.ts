import { createMutationConstants } from 'destination/store/utilities';

export const NAMESPACE = 'deliveryOrders';

export enum DeliveryOrdersActionEnum {
    FETCH_DELIVERY_ORDERS = 'FETCH_DELIVERY_ORDERS',
    FETCH_REASON_CODES = 'FETCH_REASON_CODES',
    SEND_DELIVERY_ORDERS = 'SEND_DELIVERY_ORDERS',
}

export const DeliveryOrdersMutationEnum = {
    //Delivery Orders
    FETCH_DELIVERY_ORDERS: createMutationConstants(DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS),
    FETCH_REASON_CODES: createMutationConstants(DeliveryOrdersActionEnum.FETCH_REASON_CODES),
    SET_DELIVERY_ORDER_RESULT: 'SET_DELIVERY_ORDER_RESULT',
    SEND_DELIVERY_ORDERS: createMutationConstants(DeliveryOrdersActionEnum.SEND_DELIVERY_ORDERS),
    SET_DELIVERY_ORDER_REASON_CODE: 'SET_DELIVERY_ORDER_REASON_CODE',
    SET_DELIVERY_ORDER_COMMENT: 'SET_DELIVERY_ORDER_COMMENT',
};

export enum DeliveryOrdersGetterEnum {
    GET_DELIVERY_ORDERS = 'GET_DELIVERY_ORDERS',
    GET_REASON_CODES = 'GET_REASON_CODES',
    GET_DELIVERY_ORDER_RESULT = 'GET_DELIVERY_ORDER_RESULT',
}
