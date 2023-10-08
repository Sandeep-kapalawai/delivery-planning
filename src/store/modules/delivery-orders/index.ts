import { Module } from 'vuex';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';

import api from '@/data/api';
import { IDeliveryOrders, IReasonCodes } from '@/interfaces';

import { DeliveryOrdersActionEnum, DeliveryOrdersGetterEnum, DeliveryOrdersMutationEnum } from './static/module-enum';
import tableConfiguration from '../table-configuration';

export function compareObjects(deliveryOrder: any, objectToCompare: any) {
    return Object.keys(objectToCompare).every((key) => deliveryOrder[key] === objectToCompare[key]);
}

const deliveryOrders: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        deliveryOrders: {
            isFetching: false,
            transportPlansData: {} as IDeliveryOrders,
        },
        reasonCodes: {
            isFetching: false,
            result: [] as Array<IReasonCodes>,
        },
        sendDeliveryOrdersResult: {
            isFetching: false,
            result: {},
        },
    }),

    getters: {
        [DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS](state): {
            isFetching: boolean;
            transportPlansData: IDeliveryOrders;
        } {
            return state.deliveryOrders;
        },
        [DeliveryOrdersGetterEnum.GET_REASON_CODES](state): {
            isFetching: boolean;
            result: Array<IReasonCodes>;
        } {
            return state.reasonCodes;
        },
        [DeliveryOrdersGetterEnum.GET_DELIVERY_ORDER_RESULT](state) {
            return state.sendDeliveryOrdersResult;
        },
    },

    mutations: {
        //Delivery Orders
        [DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.STARTED](state) {
            state.deliveryOrders.isFetching = true;
        },
        [DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.SUCCEEDED](state, response: IDeliveryOrders) {
            state.deliveryOrders.isFetching = false;
            state.deliveryOrders.transportPlansData = response;
        },
        [DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.FAILED](state) {
            state.deliveryOrders.isFetching = false;
        },

        //Reason Codes
        [DeliveryOrdersMutationEnum.FETCH_REASON_CODES.STARTED](state) {
            state.reasonCodes.isFetching = true;
        },
        [DeliveryOrdersMutationEnum.FETCH_REASON_CODES.SUCCEEDED](state, response: Array<IReasonCodes>) {
            state.reasonCodes.isFetching = false;
            state.reasonCodes.result = response;
        },
        [DeliveryOrdersMutationEnum.FETCH_REASON_CODES.FAILED](state) {
            state.reasonCodes.isFetching = false;
        },
        [DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.STARTED](state) {
            state.sendDeliveryOrdersResult.isFetching = true;
        },
        [DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.SUCCEEDED](state, response: Array<IReasonCodes>) {
            state.sendDeliveryOrdersResult.isFetching = false;
            state.sendDeliveryOrdersResult.result = response;
        },
        [DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.FAILED](state) {
            state.sendDeliveryOrdersResult.isFetching = false;
        },
        [DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_COMMENT]: (state, { order, comment }) => {
            state.deliveryOrders.transportPlansData?.items.some((item) => {
                const { revisedOrders, cancelledOrders, newOrders } = item;
                const ordersToCheck = [...revisedOrders, ...cancelledOrders, ...newOrders];
                const orderToUpdate = ordersToCheck.find((ele) => compareObjects(ele, order));
                if (orderToUpdate) {
                    orderToUpdate.comment = comment;
                    return true;
                }
            });
        },
        [DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_REASON_CODE]: (state, { order, reasonCodeId }) => {
            state.deliveryOrders.transportPlansData?.items.some((item) => {
                const { revisedOrders, cancelledOrders, newOrders } = item;
                const ordersToCheck = [...revisedOrders, ...cancelledOrders, ...newOrders];
                const orderToUpdate = ordersToCheck.find((ele) => compareObjects(ele, order));

                if (orderToUpdate) {
                    orderToUpdate.reasonCodeId = reasonCodeId;
                    return true;
                }
            });
        },
    },

    actions: {
        async [DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS](
            { commit },
            params: { deliveryPlanIds?: Array<string>; cargoStuffingIds?: Array<number>; transportDocumentIds?: Array<number> },
        ) {
            try {
                commit(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.STARTED);
                const response = await api.userActions.getDeliveryOrders({ params });
                commit(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.SUCCEEDED, response);
            } catch (error: any) {
                commit(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.FAILED, error?.message);
                throw error;
            }
        },
        async [DeliveryOrdersActionEnum.FETCH_REASON_CODES]({ commit }) {
            try {
                commit(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.STARTED);
                const response = await api.userActions.getReasonCodes();
                commit(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.SUCCEEDED, response);
            } catch (error: any) {
                commit(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.FAILED, error?.message);
                throw error;
            }
        },
        async [DeliveryOrdersActionEnum.SEND_DELIVERY_ORDERS]({ commit }, { payload }: { payload: any }) {
            try {
                commit(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.STARTED);
                const response = await api.userActions.sendDeliveryOrders(payload);
                commit(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.SUCCEEDED, response);
            } catch (error: any) {
                commit(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.FAILED, error?.message);
                throw error;
            }
        },
    },

    modules: {
        tableConfiguration,
    },
};

export default deliveryOrders;
