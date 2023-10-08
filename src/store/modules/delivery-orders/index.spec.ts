// @ts-nocheck

import deliveryOrdersModule, { compareObjects } from '.';
import { IState } from './interfaces';
import { DeliveryOrdersGetterEnum, DeliveryOrdersActionEnum, DeliveryOrdersMutationEnum } from './static';
import api from '@/data/api';
import { IDeliveryOrders, IReasonCodes } from '@/interfaces';
import { MOCK_DO_RESPONSE, MOCK_ORDER, MOCK_REASON_CODES, MOCK_SEND_DO } from '@/mocks';

const createState = (overrides?: Partial<IState>): IState => ({
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
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(deliveryOrdersModule.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_DELIVERY_ORDERS returns delivery plan from state', () => {
        const { deliveryPlan } = createState({
            deliveryOrders: {
                isFetching: false,
                transportPlansData: MOCK_DO_RESPONSE,
            },
        });

        expect(deliveryOrdersModule.getters[DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS]({ deliveryPlan })).toEqual(deliveryPlan);
    });

    it('GET_REASON_CODES returns default  state', () => {
        const { reasonCodes } = createState({
            reasonCodes: {
                isFetching: false,
                result: MOCK_REASON_CODES,
            },
        });

        expect(deliveryOrdersModule.getters[DeliveryOrdersGetterEnum.GET_REASON_CODES]({ reasonCodes })).toEqual(reasonCodes);
    });

    it('GET_DELIVERY_ORDER_RESULT returns default  state', () => {
        const { doresponse } = createState({
            sendDeliveryOrdersResult: {
                isFetching: false,
                result: MOCK_REASON_CODES,
            },
        });

        expect(deliveryOrdersModule.getters[DeliveryOrdersGetterEnum.GET_DELIVERY_ORDER_RESULT]({ doresponse })).toEqual(doresponse);
    });
});

describe('mutations', () => {
    it('FETCH_DELIVERY_ORDERS.STARTED sets deliveryOrders.isFetching in state', () => {
        const state = createState({
            deliveryOrders: {
                isFetching: false,
                transportPlansData: {} as IDeliveryOrders,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.STARTED](state);

        expect(state).toEqual(
            createState({
                deliveryOrders: {
                    isFetching: true,
                    transportPlansData: {} as IDeliveryOrders,
                },
            }),
        );
    });

    it('FETCH_DELIVERY_ORDERS.SUCCEEDED sets deliveryOrders in state', () => {
        const state = createState({
            deliveryOrders: {
                isFetching: true,
                transportPlansData: {} as IDeliveryOrders,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.SUCCEEDED](state, MOCK_DO_RESPONSE);

        expect(state).toEqual(
            createState({
                deliveryOrders: {
                    isFetching: false,
                    transportPlansData: MOCK_DO_RESPONSE,
                },
            }),
        );
    });

    it('FETCH_DELIVERY_ORDERS.FAILED sets deliveryOrders.isFetching in state', () => {
        const state = createState({
            deliveryOrders: {
                isFetching: true,
                transportPlansData: {} as IDeliveryOrders,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.FAILED](state);

        expect(state).toEqual(
            createState({
                deliveryOrders: {
                    isFetching: false,
                    transportPlansData: {} as IDeliveryOrders,
                },
            }),
        );
    });

    it('FETCH_REASON_CODES.STARTED sets deliveryOrders.isFetching in state', () => {
        const state = createState({
            reasonCodes: {
                isFetching: false,
                result: [] as Array<IReasonCodes>,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_REASON_CODES.STARTED](state);

        expect(state).toEqual(
            createState({
                reasonCodes: {
                    isFetching: true,
                    result: [] as Array<IReasonCodes>,
                },
            }),
        );
    });

    it('FETCH_REASON_CODES.SUCCEEDED sets deliveryOrders in state', () => {
        const state = createState({
            reasonCodes: {
                isFetching: true,
                result: [] as Array<IReasonCodes>,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_REASON_CODES.SUCCEEDED](state, MOCK_REASON_CODES);

        expect(state).toEqual(
            createState({
                reasonCodes: {
                    isFetching: false,
                    result: MOCK_REASON_CODES,
                },
            }),
        );
    });

    it('FETCH_REASON_CODES.FAILED sets deliveryOrders.isFetching in state', () => {
        const state = createState({
            reasonCodes: {
                isFetching: true,
                result: [] as Array<IReasonCodes>,
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.FETCH_REASON_CODES.FAILED](state);

        expect(state).toEqual(
            createState({
                reasonCodes: {
                    isFetching: false,
                    result: [],
                },
            }),
        );
    });

    it('SEND_DELIVERY_ORDERS.STARTED sets sendDeliveryOrdersResult.isFetching in state', () => {
        const state = createState({
            sendDeliveryOrdersResult: {
                isFetching: false,
                result: {},
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.STARTED](state);

        expect(state).toEqual(
            createState({
                sendDeliveryOrdersResult: {
                    isFetching: true,
                    result: {},
                },
            }),
        );
    });

    it('SEND_DELIVERY_ORDERS.SUCCEEDED sets deliveryOrders in state', () => {
        const state = createState({
            sendDeliveryOrdersResult: {
                isFetching: true,
                result: {},
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.SUCCEEDED](state, MOCK_SEND_DO);

        expect(state).toEqual(
            createState({
                sendDeliveryOrdersResult: {
                    isFetching: false,
                    result: MOCK_SEND_DO,
                },
            }),
        );
    });

    it('SEND_DELIVERY_ORDERS.FAILED sets deliveryOrders.isFetching in state', () => {
        const state = createState({
            sendDeliveryOrdersResult: {
                isFetching: true,
                result: {},
            },
        });

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.FAILED](state);

        expect(state).toEqual(
            createState({
                sendDeliveryOrdersResult: {
                    isFetching: false,
                    result: {},
                },
            }),
        );
    });

    it('SET_DELIVERY_ORDER_REASON_CODE sets deliveryOrders reasoncode in state', () => {
        const state = createState({
            deliveryOrders: {
                isFetching: false,
                transportPlansData: {
                    items: [
                        {
                            revisedOrders: [
                                { id: 1, reasonCodeId: '3' },
                                { id: 2, reasonCodeId: '4' },
                            ],
                            cancelledOrders: [],
                            newOrders: [],
                        },
                    ],
                },
            },
        });
        const orderToUpdate = { id: 1 };
        const reasonCodeId = 999;

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_REASON_CODE](state, { order: orderToUpdate, reasonCodeId });

        state.deliveryOrders.transportPlansData.items.forEach((ele, index) => {
            expect(ele.revisedOrders[index].reasonCodeId).toEqual(999);
        });
    });

    it('SET_DELIVERY_ORDER_COMMENT sets deliveryOrders comment code in state', () => {
        const state = {
            deliveryOrders: {
                transportPlansData: {
                    items: [
                        {
                            revisedOrders: [
                                { id: 1, comment: 'Old comment' },
                                { id: 2, comment: 'Old comment' },
                            ],
                            cancelledOrders: [],
                            newOrders: [],
                        },
                    ],
                },
            },
        };

        const orderToUpdate = { id: 1 };
        const newComment = 'New comment';

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_COMMENT](state, {
            order: orderToUpdate,
            comment: newComment,
        });
        state.deliveryOrders.transportPlansData.items.forEach((ele, index) => {
            expect(ele.revisedOrders[index].comment).toEqual(newComment);
        });
    });

    it('SET_DELIVERY_ORDER_REASON_CODE sets deliveryOrders reasoncode in state when there is no matching order', () => {
        const state = createState({
            deliveryOrders: {
                isFetching: false,
                transportPlansData: {
                    items: [
                        {
                            revisedOrders: [
                                { id: 1, reasonCodeId: '3' },
                                { id: 2, reasonCodeId: '4' },
                            ],
                            cancelledOrders: [],
                            newOrders: [],
                        },
                    ],
                },
            },
        });
        const orderToUpdate = { id: 999 };
        const reasonCodeId = 999;

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_REASON_CODE](state, { order: orderToUpdate, reasonCodeId });

        state.deliveryOrders.transportPlansData.items.forEach((ele, index) => {
            expect(ele.revisedOrders[index].reasonCodeId).toEqual('3');
        });
    });

    it('SET_DELIVERY_ORDER_COMMENT sets deliveryOrders comment code in state when there is no matching order', () => {
        const state = {
            deliveryOrders: {
                transportPlansData: {
                    items: [
                        {
                            revisedOrders: [
                                { id: 1, comment: 'Old comment' },
                                { id: 2, comment: 'Old comment' },
                            ],
                            cancelledOrders: [],
                            newOrders: [],
                        },
                    ],
                },
            },
        };

        const orderToUpdate = { id: 999 };
        const newComment = 'New comment';

        deliveryOrdersModule.mutations[DeliveryOrdersMutationEnum.SET_DELIVERY_ORDER_COMMENT](state, {
            order: orderToUpdate,
            comment: newComment,
        });
        state.deliveryOrders.transportPlansData.items.forEach((ele, index) => {
            expect(ele.revisedOrders[index].comment).toEqual('Old comment');
        });
    });
});

describe('actions', () => {
    it('FETCH_DELIVERY_ORDERS commits SUCCEEDED mutation on request success', async () => {
        const data = MOCK_DO_RESPONSE;
        jest.spyOn(api.userActions, 'getDeliveryOrders').mockResolvedValue(data);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS]({ commit }, { cargoStuffingId: 1000 });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.SUCCEEDED, data);
    });

    it('FETCH_DELIVERY_ORDER commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.userActions, 'getDeliveryOrders').mockRejectedValue(error);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS]({ commit }, { cargoStuffingId: 1000 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_DELIVERY_ORDERS.FAILED, error.message);
    });

    it('FETCH_REASON_CODES commits SUCCEEDED mutation on request success', async () => {
        const data = MOCK_REASON_CODES;
        jest.spyOn(api.userActions, 'getReasonCodes').mockResolvedValue(data);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.FETCH_REASON_CODES]({ commit });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.SUCCEEDED, data);
    });

    it('FETCH_REASON_CODES commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.userActions, 'getReasonCodes').mockRejectedValue(error);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.FETCH_REASON_CODES]({ commit }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.FETCH_REASON_CODES.FAILED, error.message);
    });

    it('SEND_DELIVERY_ORDERS commits SUCCEEDED mutation on request success', async () => {
        const data = {};
        jest.spyOn(api.userActions, 'sendDeliveryOrders').mockResolvedValue(data);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.SEND_DELIVERY_ORDERS]({ commit }, { MOCK_SEND_DO });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.SUCCEEDED, data);
    });

    it('SEND_DELIVERY_ORDERS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.userActions, 'sendDeliveryOrders').mockRejectedValue(error);

        const commit = jest.fn();

        await deliveryOrdersModule.actions[DeliveryOrdersActionEnum.SEND_DELIVERY_ORDERS]({ commit }, { MOCK_SEND_DO }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryOrdersMutationEnum.SEND_DELIVERY_ORDERS.FAILED, error.message);
    });
});

describe('compareObjects', () => {
    it('compareObjects function returns true when no matching objects found', () => {
        expect(compareObjects(MOCK_ORDER, MOCK_ORDER)).toBe(true);
    });
    it('compareObjects function returns false when no matching objects found', () => {
        const updatedOrder = { ...MOCK_ORDER };
        updatedOrder.cargoStuffingId = 999;
        expect(compareObjects(MOCK_ORDER, updatedOrder)).toBe(false);
    });
});
