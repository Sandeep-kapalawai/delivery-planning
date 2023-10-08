// @ts-nocheck
import { clone, merge } from 'lodash';
import deliveryPlanModule from '.';
import { IState } from './interfaces';
import { DeliveryPlanGetterEnum, DeliveryPlanMutationEnum, DeliveryPlanActionEnum } from './static';
import { isEmptyReturnLeg, isNotEmptyReturnLeg, isServiceLegActive, isServiceLegCancelled, isServiceLegRejected } from './logic';
import { locationCache } from './utilities';
import api from '@/data/api';
import { ICustomizableField, ILocationFullAddress, IServiceLeg, IServicePlan, ITransportProvider } from '@/interfaces';
import {
    CustomizableFieldFormatEnum,
    DeliveryPlanningViewNameEnum,
    DeliveryPlanTypeEnum,
    PlanningStatusEnum,
    RelatedObjectTypeEnum,
    ServiceLegDeliveryTimeOptionEnum,
    ServiceLegDeliveryTypeEnum,
    ServiceLegDirectionToMoveEnum,
    ServiceLegSpecialInstructionEnum,
    ServiceLegStatusEnum,
    ServiceLegTypeEnum,
    ServicePlanTransportModeEnum,
} from '@/static';
import { createMockServicePlan, createMockServiceLeg } from '@/mocks';

const createState = (overrides?: Partial<IState>): IState => ({
    deliveryPlan: {
        isFetching: false,
        isSaving: false,
        isSending: false,
        response: {} as IServicePlan,
    },
    additionalReference: {
        isFetching: false,
        response: [],
        payload: new Map(),
    },
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(deliveryPlanModule.state()).toEqual(createState());
    });
});

describe('getters', () => {
    const MOCK_SERVICE_PLAN = createMockServicePlan();
    const MOCK_ALL_DELIVERY_LEGS = MOCK_SERVICE_PLAN.serviceLegs;
    const MOCK_ACTIVE_DELIVERY_LEGS = MOCK_ALL_DELIVERY_LEGS.filter(isServiceLegActive).filter(isNotEmptyReturnLeg);
    const MOCK_FIRST_ACTIVE_DELIVERY_LEG = MOCK_ACTIVE_DELIVERY_LEGS[0];
    const MOCK_LAST_ACTIVE_DELIVERY_LEG = MOCK_ACTIVE_DELIVERY_LEGS[MOCK_ACTIVE_DELIVERY_LEGS.length - 1];
    const MOCK_ACTIVE_EMPTY_RETURN_LEG = MOCK_ALL_DELIVERY_LEGS.filter(isServiceLegActive).filter(isEmptyReturnLeg)[0];
    const MOCK_CANCELLED_LEGS = MOCK_ALL_DELIVERY_LEGS.filter(isServiceLegCancelled);
    const MOCK_REJECTED_LEGS = MOCK_ALL_DELIVERY_LEGS.filter(isServiceLegRejected);
    const MOCK_ADDITIONAL_REFERENCE: Array<ICustomizableField> = [
        {
            fieldId: 1,
            fieldReferenceId: 101,
            format: CustomizableFieldFormatEnum.STRING,
            referenceCode: 'TEST_REFERENCE_CODE',
            referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
            referenceName: 'TEST_REFERENCE_NAME',
            isMandatory: true,
            value: 'TEST_VALUE',
        },
    ];

    it('GET_DELIVERY_PLAN returns delivery plan from state', () => {
        const { deliveryPlan } = createState({
            deliveryPlan: MOCK_SERVICE_PLAN,
        });

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_DELIVERY_PLAN]({ deliveryPlan })).toEqual(deliveryPlan);
    });

    it('GET_ALL_DELIVERY_LEGS returns empty array if delivery plan is not present', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_DELIVERY_PLAN]: {
                response: null,
            },
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]({}, getters)).toEqual([]);
    });

    it('GET_ALL_DELIVERY_LEGS returns all delivery legs from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_DELIVERY_PLAN]: {
                response: MOCK_SERVICE_PLAN,
            },
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]({}, getters)).toEqual(MOCK_ALL_DELIVERY_LEGS);
    });

    it('GET_ACTIVE_DELIVERY_LEGS returns active legs from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: MOCK_ALL_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]({}, getters)).toEqual(MOCK_ACTIVE_DELIVERY_LEGS);
    });

    it('GET_FIRST_ACTIVE_DELIVERY_LEG returns first active delivery leg from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: MOCK_ACTIVE_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_FIRST_ACTIVE_DELIVERY_LEG]({}, getters)).toEqual(MOCK_FIRST_ACTIVE_DELIVERY_LEG);
    });

    it('GET_FIRST_ACTIVE_DELIVERY_LEG returns undefined when active delivery legs are not present', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_FIRST_ACTIVE_DELIVERY_LEG]({}, getters)).toEqual(undefined);
    });

    it('GET_LAST_ACTIVE_DELIVERY_LEG returns first active delivery leg from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: MOCK_ACTIVE_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_LAST_ACTIVE_DELIVERY_LEG]({}, getters)).toEqual(MOCK_LAST_ACTIVE_DELIVERY_LEG);
    });

    it('GET_LAST_ACTIVE_DELIVERY_LEG returns undefined when active delivery legs are not present', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_LAST_ACTIVE_DELIVERY_LEG]({}, getters)).toEqual(undefined);
    });

    it('GET_ACTIVE_EMPTY_RETURN_LEG returns active empty return leg from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: MOCK_ALL_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]({}, getters)).toEqual(MOCK_ACTIVE_EMPTY_RETURN_LEG);
    });

    it('GET_CANCELLED_LEGS returns cancelled legs from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: MOCK_ALL_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_CANCELLED_LEGS]({}, getters)).toEqual(MOCK_CANCELLED_LEGS);
    });

    it('GET_REJECTED_LEGS returns rejected legs from state', () => {
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: MOCK_ALL_DELIVERY_LEGS,
        };

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_REJECTED_LEGS]({}, getters)).toEqual(MOCK_REJECTED_LEGS);
    });

    it('GET_ADDITIONAL_REFERENCE returns additionalReference from state', () => {
        const { additionalReference } = createState({
            additionalReference: {
                isFetching: false,
                response: MOCK_ADDITIONAL_REFERENCE,
                payload: new Map(),
            },
        });

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_ADDITIONAL_REFERENCE]({ additionalReference })).toEqual(additionalReference);
    });

    it('GET_IS_STOP_OFF_LOCATION returns the is stop off location value from state', () => {
        const state = createState({
            deliveryPlan: {
                response: {
                    isStopOffLocation: true,
                },
            },
        });

        expect(deliveryPlanModule.getters[DeliveryPlanGetterEnum.GET_IS_STOP_OFF_LOCATION](state)).toEqual(true);
    });
});

describe('mutations', () => {
    let MOCK_SERVICE_PLAN: IServicePlan, MOCK_SERVICE_LEG: IServiceLeg;

    beforeEach(() => {
        MOCK_SERVICE_PLAN = createMockServicePlan();
        MOCK_SERVICE_LEG = MOCK_SERVICE_PLAN.serviceLegs[0];
    });

    // Delivery Plan
    it('RESET_STATE resets to default state', () => {
        const state = createState({
            deliveryPlan: {
                isFetching: false,
                isSaving: false,
                isSending: false,
                response: {
                    planningStatus: PlanningStatusEnum.INITIAL,
                } as IServicePlan,
            },
            additionalReference: {
                isFetching: false,
                response: [{ fieldId: 'TEST_FIELD_ID_1' }],
                payload: new Map(),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.RESET_STATE](state);

        expect(state).toEqual(createState());
    });

    it('FETCH_DELIVERY_PLAN.STARTED sets deliveryPlan.isFetching and deliveryPlan.errorMessage in state', () => {
        const state = createState({
            deliveryPlan: {
                isFetching: false,
                response: {} as IServicePlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.STARTED](state);

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isFetching: true,
                    response: {} as IServicePlan,
                },
            }),
        );
    });

    it('FETCH_DELIVERY_PLAN.SUCCEEDED sets deliveryPlan in state', () => {
        const state = createState({
            deliveryPlan: {
                isFetching: true,
                response: {} as IServicePlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.SUCCEEDED](state, MOCK_SERVICE_PLAN);

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isFetching: false,
                    response: MOCK_SERVICE_PLAN,
                },
            }),
        );
    });

    it('FETCH_DELIVERY_PLAN.FAILED sets deliveryPlan.isFetching and deliveryPlan.errorMessage in state', () => {
        const state = createState({
            deliveryPlan: {
                isFetching: true,
                response: {} as IServicePlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.FAILED](state, ['error']);

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isFetching: false,
                    response: {} as IServicePlan,
                },
            }),
        );
    });

    it('SAVE_DELIVERY_PLAN.STARTED sets deliveryPlan.isSaving in state', () => {
        const state = createState({
            deliveryPlan: {
                isSaving: false,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.STARTED](state);

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isSaving: true,
                },
            }),
        );
    });

    it('SAVE_DELIVERY_PLAN.SUCCEEDED sets deliveryPlan.isSaving in state', () => {
        const state = createState({
            deliveryPlan: {
                isSaving: true,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.SUCCEEDED](state);

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isSaving: false,
                },
            }),
        );
    });

    it('SAVE_DELIVERY_PLAN.FAILED sets deliveryPlan.isSaving in state', () => {
        const state = createState({
            deliveryPlan: {
                isSaving: true,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.FAILED](state, 'error');

        expect(state).toEqual(
            createState({
                deliveryPlan: {
                    isSaving: false,
                },
            }),
        );
    });

    it('CANCEL_DELIVERY_PLAN cancels the delivery plan', () => {
        const state = createState({
            deliveryPlan: {
                response: createMockServicePlan({
                    serviceLegs: [
                        createMockServiceLeg({
                            sequence: 101,
                            serviceLegId: 1001,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.CREATED,
                            deliveryOrder: undefined,
                        }),
                        createMockServiceLeg({
                            sequence: 102,
                            serviceLegId: 1002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.SENT,
                            deliveryOrder: 'TEST_DO_NUMBER_2',
                        }),
                        createMockServiceLeg({
                            sequence: 103,
                            serviceLegId: 1003,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.UPDATED,
                            deliveryOrder: 'TEST_DO_NUMBER_3',
                        }),
                        createMockServiceLeg({
                            sequence: 104,
                            serviceLegId: 1004,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.ACCEPTED,
                            deliveryOrder: 'TEST_DO_NUMBER_4',
                        }),
                        createMockServiceLeg({
                            sequence: 1000,
                            serviceLegId: 1999,
                            legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                            status: ServiceLegStatusEnum.ACCEPTED,
                            deliveryOrder: 'TEST_DO_NUMBER_4',
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2001,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.CANCELLED,
                            deliveryOrder: 'TEST_DO_NUMBER_5',
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.REJECTED,
                            deliveryOrder: 'TEST_DO_NUMBER_6',
                        }),
                    ],
                }),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.CANCEL_DELIVERY_PLAN](state);

        expect(state.deliveryPlan.response.serviceLegs).toEqual([
            expect.objectContaining({ sequence: 101, serviceLegId: 1001, status: ServiceLegStatusEnum.CREATED }),
            expect.objectContaining({ sequence: 102, serviceLegId: 1002, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 103, serviceLegId: 1003, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 104, serviceLegId: 1004, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 1000, serviceLegId: 1999, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2001, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2002, status: ServiceLegStatusEnum.REJECTED }),
        ]);
    });

    it('CANCEL_DELIVERY_PLAN does not fail if deliveryPlan is undefined', () => {
        const state = createState({
            deliveryPlan: undefined,
        });

        expect(() => {
            deliveryPlanModule.mutations[DeliveryPlanMutationEnum.CANCEL_DELIVERY_PLAN](state);
        }).not.toThrow();
    });

    it('SET_DELIVERY_PLAN_TYPE sets deliveryPlanType for the plan', () => {
        const plan = MOCK_SERVICE_PLAN;
        const deliveryPlanType = DeliveryPlanTypeEnum.MULTI_DROP;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_PLAN_TYPE]({}, { plan, deliveryPlanType });

        expect(plan.deliveryPlanType).toEqual(deliveryPlanType);
    });

    it('SET_IS_STOP_OFF_LOCATION sets the is stop off location value in state', () => {
        const state = createState({
            deliveryPlan: { response: { isStopOffLocation: false } },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION](state, { isStopOffLocation: true });

        expect(state.deliveryPlan.response.isStopOffLocation).toBe(true);
    });

    // Delivery Leg
    it('SORT_DELIVERY_LEGS sorts delivery legs in state', () => {
        const state = createState({
            deliveryPlan: {
                response: createMockServicePlan({
                    serviceLegs: [
                        createMockServiceLeg({
                            sequence: 103,
                            serviceLegId: 1003,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 102,
                            serviceLegId: 1002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2001,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.CANCELLED,
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.REJECTED,
                        }),
                        createMockServiceLeg({
                            sequence: 1000,
                            serviceLegId: 1999,
                            legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 101,
                            serviceLegId: 1001,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                        }),
                    ],
                }),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SORT_DELIVERY_LEGS](state);

        expect(state.deliveryPlan.response.serviceLegs).toEqual([
            expect.objectContaining({ sequence: 101, serviceLegId: 1001 }),
            expect.objectContaining({ sequence: 102, serviceLegId: 1002 }),
            expect.objectContaining({ sequence: 103, serviceLegId: 1003 }),
            expect.objectContaining({ sequence: 1000, serviceLegId: 1999 }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2001, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2002, status: ServiceLegStatusEnum.REJECTED }),
        ]);
    });

    it('RESEQUENCE_DELIVERY_LEGS resequences delivery legs in state', () => {
        const state = createState({
            deliveryPlan: {
                response: createMockServicePlan({
                    serviceLegs: [
                        createMockServiceLeg({
                            sequence: 102,
                            serviceLegId: 1002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 103,
                            serviceLegId: 1003,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 1000,
                            serviceLegId: 1999,
                            legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2001,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.CANCELLED,
                        }),
                        createMockServiceLeg({
                            sequence: 100,
                            serviceLegId: 2002,
                            legType: ServiceLegTypeEnum.SERVICE_LEG,
                            status: ServiceLegStatusEnum.REJECTED,
                        }),
                    ],
                }),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS](state);

        expect(state.deliveryPlan.response.serviceLegs).toEqual([
            expect.objectContaining({ sequence: 101, serviceLegId: 1002 }),
            expect.objectContaining({ sequence: 102, serviceLegId: 1003 }),
            expect.objectContaining({ sequence: 1000, serviceLegId: 1999 }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2001, status: ServiceLegStatusEnum.CANCELLED }),
            expect.objectContaining({ sequence: 100, serviceLegId: 2002, status: ServiceLegStatusEnum.REJECTED }),
        ]);
    });

    it('SWAP_DELIVERY_LEGS swaps delivery legs sequence in state', () => {
        const leg1: IServiceLeg = createMockServiceLeg({
            sequence: 101,
            serviceLegId: 1001,
            legType: ServiceLegTypeEnum.SERVICE_LEG,
        });
        const leg2: IServiceLeg = createMockServiceLeg({
            sequence: 102,
            serviceLegId: 1002,
            legType: ServiceLegTypeEnum.SERVICE_LEG,
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SWAP_DELIVERY_LEGS]({}, { leg1, leg2 });

        expect(leg1.sequence).toEqual(102);
        expect(leg2.sequence).toEqual(101);
    });

    it('ADD_DELIVERY_LEG does not add delivery legs to serviceLegs array in state if delivery plan is not present', () => {
        const state = createState({
            deliveryPlan: {
                response: null,
            },
        });

        const leg = createMockServiceLeg({ sequence: 101 });
        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.ADD_DELIVERY_LEG](state, { leg });

        expect(state.deliveryPlan.response).toBeNull();
    });

    it('ADD_DELIVERY_LEG adds delivery legs to serviceLegs array in state', () => {
        const state = createState({
            deliveryPlan: {
                response: MOCK_SERVICE_PLAN,
            },
        });

        const leg = createMockServiceLeg({ sequence: 101 });
        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.ADD_DELIVERY_LEG](state, { leg });

        const serviceLegsInState = state.deliveryPlan.response.serviceLegs;
        expect(serviceLegsInState[serviceLegsInState.length - 1]).toEqual(leg);
    });

    it('REMOVE_DELIVERY_LEG removes delivery leg from serviceLegs array in state', () => {
        const state = createState({
            deliveryPlan: {
                response: MOCK_SERVICE_PLAN,
            },
        });

        const legToRemove = MOCK_SERVICE_PLAN.serviceLegs[0];
        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG](state, { leg: legToRemove });

        const serviceLegsInState = state.deliveryPlan.response.serviceLegs;
        expect(serviceLegsInState[0]).not.toEqual(legToRemove);
    });

    it('CANCEL_DELIVERY_LEG sets the leg status as cancelled', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 102,
                    serviceLegId: 1002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10002',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
            ],
        });
        const state = createState({
            deliveryPlan: {
                response: deliveryPlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.CANCEL_DELIVERY_LEG](state, { leg: deliveryPlan.serviceLegs[0] });

        expect(deliveryPlan.serviceLegs[0]).toEqual(
            expect.objectContaining({
                serviceLegId: 1001,
                status: ServiceLegStatusEnum.CANCELLED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
        expect(deliveryPlan.serviceLegs[1]).toEqual(
            expect.objectContaining({
                serviceLegId: 1002,
                status: ServiceLegStatusEnum.CANCELLED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
        expect(deliveryPlan.serviceLegs[2]).toEqual(
            expect.objectContaining({
                serviceLegId: 1003,
                status: ServiceLegStatusEnum.SENT,
            }),
        );
        expect(deliveryPlan.serviceLegs[3]).toEqual(
            expect.objectContaining({
                serviceLegId: 1999,
                status: ServiceLegStatusEnum.CANCELLED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
    });

    it('ACCEPT_DELIVERY_LEG sets the leg status as ACCEPTED', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 102,
                    serviceLegId: 1002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10002,
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.SENT,
                }),
            ],
        });
        const state = createState({
            deliveryPlan: {
                response: deliveryPlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.ACCEPT_DELIVERY_LEG](state, { leg: deliveryPlan.serviceLegs[0] });

        expect(deliveryPlan.serviceLegs[0]).toEqual(expect.objectContaining({ serviceLegId: 1001, status: ServiceLegStatusEnum.ACCEPTED }));
        expect(deliveryPlan.serviceLegs[1]).toEqual(expect.objectContaining({ serviceLegId: 1002, status: ServiceLegStatusEnum.ACCEPTED }));
        expect(deliveryPlan.serviceLegs[2]).toEqual(expect.objectContaining({ serviceLegId: 1003, status: ServiceLegStatusEnum.SENT }));
        expect(deliveryPlan.serviceLegs[3]).toEqual(expect.objectContaining({ serviceLegId: 1999, status: ServiceLegStatusEnum.ACCEPTED }));
    });

    it('REJECT_DELIVERY_LEG sets the leg status as REJECTED', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 102,
                    serviceLegId: 1002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10002',
                    status: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.SENT,
                }),
            ],
        });
        const state = createState({
            deliveryPlan: {
                response: deliveryPlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.REJECT_DELIVERY_LEG](state, { leg: deliveryPlan.serviceLegs[0] });

        expect(deliveryPlan.serviceLegs[0]).toEqual(
            expect.objectContaining({
                serviceLegId: 1001,
                status: ServiceLegStatusEnum.REJECTED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
        expect(deliveryPlan.serviceLegs[1]).toEqual(
            expect.objectContaining({
                serviceLegId: 1002,
                status: ServiceLegStatusEnum.REJECTED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
        expect(deliveryPlan.serviceLegs[2]).toEqual(expect.objectContaining({ serviceLegId: 1003, status: ServiceLegStatusEnum.SENT }));
        expect(deliveryPlan.serviceLegs[3]).toEqual(
            expect.objectContaining({
                serviceLegId: 1999,
                status: ServiceLegStatusEnum.REJECTED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
    });

    it('CANCEL_OR_REJECT_EMPTY_RETURN_LEG sets the leg status same as cancelledOrRejectedLeg status', () => {
        const cancelledOrRejectedLeg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            deliveryOrder: '10001',
            status: ServiceLegStatusEnum.CANCELLED,
        });
        const leg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
            deliveryOrder: '10002',
            status: ServiceLegStatusEnum.SENT,
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.CANCEL_OR_REJECT_EMPTY_RETURN_LEG](undefined, { leg, cancelledOrRejectedLeg });

        expect(leg).toEqual(
            expect.objectContaining({
                serviceLegId: 1001,
                status: ServiceLegStatusEnum.CANCELLED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10001',
            }),
        );
    });

    it('UNDO_CANCEL_REJECT_DELIVERY_LEG sets the leg status as the status before cancel/reject action', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                    actionTakenAsPartOfDeliveryOrder: '10001',
                }),
                createMockServiceLeg({
                    sequence: 102,
                    serviceLegId: 1002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                    actionTakenAsPartOfDeliveryOrder: '10001',
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: '10002',
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                    actionTakenAsPartOfDeliveryOrder: '10002',
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: '10001',
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                    actionTakenAsPartOfDeliveryOrder: '10001',
                }),
            ],
        });
        const state = createState({
            deliveryPlan: {
                response: deliveryPlan,
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG](state, { leg: deliveryPlan.serviceLegs[0] });

        expect(deliveryPlan.serviceLegs[0]).toEqual(
            expect.objectContaining({
                serviceLegId: 1001,
                status: ServiceLegStatusEnum.SENT,
                statusBeforeAction: undefined,
                actionTakenAsPartOfDeliveryOrder: undefined,
            }),
        );
        expect(deliveryPlan.serviceLegs[1]).toEqual(
            expect.objectContaining({
                serviceLegId: 1002,
                status: ServiceLegStatusEnum.SENT,
                statusBeforeAction: undefined,
                actionTakenAsPartOfDeliveryOrder: undefined,
            }),
        );
        expect(deliveryPlan.serviceLegs[2]).toEqual(
            expect.objectContaining({
                serviceLegId: 1003,
                status: ServiceLegStatusEnum.CANCELLED,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
                actionTakenAsPartOfDeliveryOrder: '10002',
            }),
        );
        expect(deliveryPlan.serviceLegs[3]).toEqual(
            expect.objectContaining({
                serviceLegId: 1999,
                status: ServiceLegStatusEnum.SENT,
                statusBeforeAction: undefined,
                actionTakenAsPartOfDeliveryOrder: undefined,
            }),
        );
    });

    // Pick-up
    it('SET_PICKUP_TIMEZONE_AND_OFFSET sets pickupDateTimeZone and pickupUtcOffsetMinutes for the leg when location and date is not present', async () => {
        jest.spyOn(locationCache, 'getLocation').mockResolvedValue({
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress);

        const leg = MOCK_SERVICE_LEG;

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]({}, { leg });

        expect(leg.pickupData.pickupDateTimeZone).toEqual('CET');
        expect(leg.pickupData.pickupUtcOffsetMinutes).toEqual(60);
    });

    it('SET_PICKUP_TIMEZONE_AND_OFFSET sets pickupDateTimeZone and pickupUtcOffsetMinutes for the leg when date is not present', async () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress;

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]({}, { leg, location });

        expect(leg.pickupData.pickupDateTimeZone).toEqual('CET');
        expect(leg.pickupData.pickupUtcOffsetMinutes).toEqual(60);
    });

    it('SET_PICKUP_TIMEZONE_AND_OFFSET sets pickupDateTimeZone and pickupUtcOffsetMinutes for the leg', async () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress;
        const date = '01 Apr 2023';

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]({}, { leg, location, date });

        expect(leg.pickupData.pickupDateTimeZone).toEqual('CEST');
        expect(leg.pickupData.pickupUtcOffsetMinutes).toEqual(120);
    });

    it('SET_PICKUP_LOCATION sets pickUpAddress for the leg', () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'TEST_FACILITY_CODE_1',
            displayName: 'TEST_DISPLAY_NAME_1',
            displayText: 'TEST_DISPLAY_TEXT_1',
        };

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_LOCATION]({}, { leg, location });

        expect(leg.pickupData.pickUpAddress).toEqual({
            beCode: 'TEST_FACILITY_CODE_1',
            displayName: 'TEST_DISPLAY_NAME_1',
            displayText: 'TEST_DISPLAY_TEXT_1',
        });
    });

    it('SET_PICKUP_ON_DATE sets pickupOnDate and isScheduledPickupFromTimeSetByUser for the leg when pickupFromTime is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupFromTime = '01:00';

        const date = '01 Jan 2023';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]({}, { leg, date });

        expect(leg.pickupData.pickupOnDate).toEqual(date);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeTruthy();
    });

    it('SET_PICKUP_ON_DATE sets pickupOnDate and isScheduledPickupFromTimeSetByUser for the leg when pickupFromTime is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupFromTime = null;

        const date = '01 Jan 2023';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]({}, { leg, date });

        expect(leg.pickupData.pickupOnDate).toEqual(date);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeFalsy();
    });

    it('SET_PICKUP_ON_DATE sets pickupOnDate and isScheduledPickupFromTimeSetByUser for the leg when date is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupFromTime = null;

        const date = null;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]({}, { leg, date });

        expect(leg.pickupData.pickupOnDate).toEqual(date);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeFalsy();
    });

    it('SET_PICKUP_FROM_TIME sets pickupFromTime and isScheduledPickupFromTimeSetByUser for the leg when pickupOnDate is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupOnDate = '01 Jan 2023';

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]({}, { leg, time });

        expect(leg.pickupData.pickupFromTime).toEqual(time);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeTruthy();
    });

    it('SET_PICKUP_FROM_TIME sets pickupFromTime and isScheduledPickupFromTimeSetByUser for the leg when pickupOnDate is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupOnDate = null;

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]({}, { leg, time });

        expect(leg.pickupData.pickupFromTime).toEqual(time);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeFalsy();
    });

    it('SET_PICKUP_FROM_TIME sets pickupFromTime and isScheduledPickupFromTimeSetByUser for the leg when time is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.pickupData.pickupOnDate = null;

        const time = null;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]({}, { leg, time });

        expect(leg.pickupData.pickupFromTime).toEqual(time);
        expect(leg.pickupData.isScheduledPickupFromTimeSetByUser).toBeFalsy();
    });

    it('SET_SPECIAL_INSTRUCTION sets specialInstruction for the leg', () => {
        const leg = MOCK_SERVICE_LEG;
        const specialInstruction = ServiceLegSpecialInstructionEnum.OFF_DOCK_STORAGE;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION]({}, { leg, specialInstruction });

        expect(leg.pickupData.specialInstruction).toEqual(specialInstruction);
    });

    // Delivery
    it('SET_DELIVERY_TIMEZONE_AND_OFFSET sets deliveryTimeZone and deliveryUtcOffsetMinutes for the leg when location and date is not present', async () => {
        jest.spyOn(locationCache, 'getLocation').mockResolvedValue({
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress);

        const leg = MOCK_SERVICE_LEG;

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]({}, { leg });

        expect(leg.deliveryData.deliveryTimeZone).toEqual('CET');
        expect(leg.deliveryData.deliveryUtcOffsetMinutes).toEqual(60);
    });

    it('SET_DELIVERY_TIMEZONE_AND_OFFSET sets deliveryTimeZone and deliveryUtcOffsetMinutes for the leg when date is not present', async () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress;

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]({}, { leg, location });

        expect(leg.deliveryData.deliveryTimeZone).toEqual('CET');
        expect(leg.deliveryData.deliveryUtcOffsetMinutes).toEqual(60);
    });

    it('SET_DELIVERY_TIMEZONE_AND_OFFSET sets deliveryTimeZone and deliveryUtcOffsetMinutes for the leg', async () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress;
        const date = '01 Apr 2023';

        await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]({}, { leg, location, date });

        expect(leg.deliveryData.deliveryTimeZone).toEqual('CEST');
        expect(leg.deliveryData.deliveryUtcOffsetMinutes).toEqual(120);
    });

    it('SET_DELIVERY_LOCATION sets deliveryAddress for the leg', () => {
        const leg = MOCK_SERVICE_LEG;
        const location = {
            facilityCode: 'TEST_FACILITY_CODE_1',
            displayName: 'TEST_DISPLAY_NAME_1',
            displayText: 'TEST_DISPLAY_TEXT_1',
        };

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]({}, { leg, location });

        expect(leg.deliveryData.deliveryAddress).toEqual({
            beCode: 'TEST_FACILITY_CODE_1',
            displayName: 'TEST_DISPLAY_NAME_1',
            displayText: 'TEST_DISPLAY_TEXT_1',
        });
    });

    it('SET_DELIVERY_ON_DATE sets deliveryOnDate, isScheduledArrivalFromTimeSetByUser and isScheduledArrivalToTimeSetByUser for the leg when deliveryFromTime and deliveryToTime is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryFromTime = '01:00';
        leg.deliveryData.deliveryToTime = '02:00';

        const date = '01 Jan 2023';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]({}, { leg, date });

        expect(leg.deliveryData.deliveryOnDate).toEqual(date);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeTruthy();
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeTruthy();
    });

    it('SET_DELIVERY_ON_DATE sets deliveryOnDate, isScheduledArrivalFromTimeSetByUser and isScheduledArrivalToTimeSetByUser for the leg when deliveryFromTime and deliveryToTime is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryFromTime = null;
        leg.deliveryData.deliveryToTime = null;

        const date = '01 Jan 2023';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]({}, { leg, date });

        expect(leg.deliveryData.deliveryOnDate).toEqual(date);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeFalsy();
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_ON_DATE sets deliveryOnDate, isScheduledArrivalFromTimeSetByUser and isScheduledArrivalToTimeSetByUser for the leg when date is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryFromTime = null;
        leg.deliveryData.deliveryToTime = null;

        const date = null;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]({}, { leg, date });

        expect(leg.deliveryData.deliveryOnDate).toEqual(date);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeFalsy();
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_TIME_OPTION sets deliveryTimeOption and isScheduledArrivalToTimeSetByUser for the leg when deliveryTimeOption is TIME_SLOT, deliveryOnDate and deliveryToTime is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = '01 Jan 2023';
        leg.deliveryData.deliveryToTime = '02:00';

        const deliveryTimeOption = ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]({}, { leg, deliveryTimeOption });

        expect(leg.deliveryData.deliveryTimeOption).toEqual(deliveryTimeOption);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeTruthy();
    });

    it('SET_DELIVERY_TIME_OPTION sets deliveryTimeOption and isScheduledArrivalToTimeSetByUser for the leg when deliveryTimeOption is TIME_SLOT, deliveryOnDate and deliveryToTime is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = null;
        leg.deliveryData.deliveryToTime = null;

        const deliveryTimeOption = ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]({}, { leg, deliveryTimeOption });

        expect(leg.deliveryData.deliveryTimeOption).toEqual(deliveryTimeOption);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_TIME_OPTION sets deliveryTimeOption and isScheduledArrivalToTimeSetByUser for the leg when deliveryTimeOption is SPECIFIC_TIME', () => {
        const leg = MOCK_SERVICE_LEG;

        const deliveryTimeOption = ServiceLegDeliveryTimeOptionEnum.SPECIFIC_TIME;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]({}, { leg, deliveryTimeOption });

        expect(leg.deliveryData.deliveryTimeOption).toEqual(deliveryTimeOption);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_FROM_TIME sets deliveryFromTime and isScheduledArrivalFromTimeSetByUser for the leg when deliveryOnDate is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = '01 Jan 2023';

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryFromTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeTruthy();
    });

    it('SET_DELIVERY_FROM_TIME sets deliveryFromTime and isScheduledArrivalFromTimeSetByUser for the leg when deliveryOnDate is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = null;

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryFromTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_FROM_TIME sets deliveryFromTime and isScheduledArrivalFromTimeSetByUser for the leg when time is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = null;

        const time = null;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryFromTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalFromTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_TO_TIME sets deliveryToTime and isScheduledArrivalToTimeSetByUser for the leg when deliveryOnDate is present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = '01 Jan 2023';

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryToTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeTruthy();
    });

    it('SET_DELIVERY_TO_TIME sets deliveryToTime and isScheduledArrivalToTimeSetByUser for the leg when deliveryOnDate is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = null;

        const time = '01:00';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryToTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_TO_TIME sets deliveryToTime and isScheduledArrivalToTimeSetByUser for the leg when time is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        leg.deliveryData.deliveryOnDate = null;

        const time = null;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]({}, { leg, time });

        expect(leg.deliveryData.deliveryToTime).toEqual(time);
        expect(leg.deliveryData.isScheduledArrivalToTimeSetByUser).toBeFalsy();
    });

    it('SET_DELIVERY_REFERENCE sets deliveryReference for the plan', () => {
        const leg = MOCK_SERVICE_LEG;
        const deliveryReference = 'TEST_DELIVERY_REFERENCE';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_REFERENCE]({}, { leg, deliveryReference });

        expect(leg.deliveryData.deliveryReference).toEqual(deliveryReference);
    });

    it('SET_DELIVERY_TYPE sets deliveryType for the plan', () => {
        const leg = MOCK_SERVICE_LEG;
        const deliveryType = ServiceLegDeliveryTypeEnum.DROP_AND_SWAP;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TYPE]({}, { leg, deliveryType });

        expect(leg.deliveryData.deliveryType).toEqual(deliveryType);
    });

    // Transport
    it('SET_TRANSPORT_MODE sets transportMode and deliveryType for the plan', () => {
        const leg = MOCK_SERVICE_LEG;
        const transportMode = ServicePlanTransportModeEnum.RAIL;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_MODE]({}, { leg, transportMode });

        expect(leg.transportData.transportMode).toEqual(transportMode);
        expect(leg.deliveryData.deliveryType).toEqual(ServiceLegDeliveryTypeEnum.LIVE_UNLOAD);
    });

    it('SET_TRANSPORT_PROVIDER sets provider for the plan when provider is present', () => {
        const leg = MOCK_SERVICE_LEG;
        const provider: ITransportProvider | undefined = {
            partyCode: 'TEST_PARTY_CODE',
            partyName: 'TEST_PARTY_NAME',
        };

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]({}, { leg, provider });

        expect(leg.transportData.provider).toEqual({
            providerBECode: 'TEST_PARTY_CODE',
            providerName: 'TEST_PARTY_NAME',
        });
    });

    it('SET_TRANSPORT_PROVIDER resets provider for the plan when provider is not present', () => {
        const leg = MOCK_SERVICE_LEG;
        const provider: ITransportProvider | undefined = undefined;

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]({}, { leg, provider });

        expect(leg.transportData.provider).toEqual({
            providerBECode: undefined,
            providerName: undefined,
        });
    });

    it('SET_ADDITIONAL_INSTRUCTION sets additionalInstruction for the plan', () => {
        const leg = MOCK_SERVICE_LEG;
        const additionalInstruction = 'TEST_ADDITIONAL_INSTRUCTION';

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]({}, { leg, additionalInstruction });

        expect(leg.transportData.additionalInstruction).toEqual(additionalInstruction);
    });

    // Additional Reference(s)
    it('FETCH_ADDITIONAL_REFERENCE.STARTED sets additionalReference.isFetching in state', () => {
        const state = createState({
            additionalReference: {
                isFetching: false,
                response: [],
                payload: new Map([[101, { fieldReferenceId: 101 }]]),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.STARTED](state);

        expect(state).toEqual(
            createState({
                additionalReference: {
                    isFetching: true,
                    response: [],
                    payload: new Map(),
                },
            }),
        );
    });

    it('FETCH_ADDITIONAL_REFERENCE.SUCCEEDED sets additionalReference in state', () => {
        const state = createState({
            additionalReference: {
                isFetching: true,
                response: [],
            },
        });

        const MOCK_ADDITIONAL_REFERENCE: Array<ICustomizableField> = [
            {
                fieldId: 1,
                fieldReferenceId: 101,
                format: CustomizableFieldFormatEnum.STRING,
                referenceCode: 'TEST_REFERENCE_CODE',
                referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                referenceName: 'TEST_REFERENCE_NAME',
                isMandatory: true,
                value: 'TEST_VALUE',
            },
        ];
        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.SUCCEEDED](state, MOCK_ADDITIONAL_REFERENCE);

        expect(state).toEqual(
            createState({
                additionalReference: {
                    isFetching: false,
                    response: MOCK_ADDITIONAL_REFERENCE,
                },
            }),
        );
    });

    it('FETCH_ADDITIONAL_REFERENCE.FAILED sets additionalReference.isFetching in state', () => {
        const state = createState({
            additionalReference: {
                isFetching: true,
                response: [],
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.FAILED](state);

        expect(state).toEqual(
            createState({
                additionalReference: {
                    isFetching: false,
                    response: [],
                },
            }),
        );
    });

    it('SET_ADDITIONAL_REFERENCE_FIELD does not update value in state if field is missing', () => {
        const relatedObjectId: number = 1001;
        const relatedObjectType: RelatedObjectTypeEnum = RelatedObjectTypeEnum.CargoStuffing;
        const field: ICustomizableField = {
            fieldId: 11,
            fieldReferenceId: 101,
            format: CustomizableFieldFormatEnum.BOOLEAN,
            isMandatory: true,
            referenceCode: 'TEST_REFERENCE_CODE',
            referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
            referenceName: 'TEST_REFERENCE_NAME',
            value: 'true',
        };

        const state = createState({
            additionalReference: {
                isFetching: false,
                response: [],
                payload: new Map(),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_REFERENCE_FIELD](state, { relatedObjectId, relatedObjectType, field });

        expect(state).toEqual(
            createState({
                additionalReference: {
                    isFetching: false,
                    response: [],
                    payload: new Map(),
                },
            }),
        );
    });

    it('SET_ADDITIONAL_REFERENCE_FIELD update value in state', () => {
        const relatedObjectId: number = 1001;
        const relatedObjectType: RelatedObjectTypeEnum = RelatedObjectTypeEnum.CargoStuffing;
        const field: ICustomizableField = {
            fieldId: 11,
            fieldReferenceId: 101,
            format: CustomizableFieldFormatEnum.BOOLEAN,
            isMandatory: true,
            referenceCode: 'TEST_REFERENCE_CODE',
            referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
            referenceName: 'TEST_REFERENCE_NAME',
            value: 'true',
        };
        const fieldWithUpdatedValue: ICustomizableField = merge(clone(field), { value: 'false' });

        const state = createState({
            additionalReference: {
                isFetching: false,
                response: [field],
                payload: new Map(),
            },
        });

        deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_REFERENCE_FIELD](state, {
            relatedObjectId,
            relatedObjectType,
            field: fieldWithUpdatedValue,
        });

        expect(state).toEqual(
            createState({
                additionalReference: {
                    isFetching: false,
                    response: [fieldWithUpdatedValue],
                    payload: new Map([
                        [
                            fieldWithUpdatedValue.fieldReferenceId,
                            {
                                relatedObjectId,
                                relatedObjectType,
                                fieldReferenceId: fieldWithUpdatedValue.fieldReferenceId,
                                referenceCode: fieldWithUpdatedValue.referenceCode,
                                value: fieldWithUpdatedValue.value,
                            },
                        ],
                    ]),
                },
            }),
        );
    });
});

describe('actions', () => {
    let MOCK_SERVICE_PLAN: IServicePlan;

    beforeEach(() => {
        MOCK_SERVICE_PLAN = createMockServicePlan();
    });

    // Delivery Plan
    it('RESET_STATE commits RESET_STATE mutation', async () => {
        const commit = jest.fn();

        deliveryPlanModule.actions[DeliveryPlanActionEnum.RESET_STATE]({ commit });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESET_STATE);
    });

    it('FETCH_DELIVERY_PLAN commits SUCCEEDED mutation on request success', async () => {
        const data = MOCK_SERVICE_PLAN;
        jest.spyOn(api.deliveryPlan, 'getFCLServicePlans').mockResolvedValue(data);

        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN]({ commit }, { cargoStuffingId: 1000 });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.SUCCEEDED, data);
    });

    it('FETCH_DELIVERY_PLAN commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.deliveryPlan, 'getFCLServicePlans').mockRejectedValue(error);

        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN]({ commit }, { cargoStuffingId: 1000 }).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.FAILED);
    });

    it('FETCH_ADDITIONAL_REFERENCE commits SUCCEEDED mutation on request success', async () => {
        const data: Array<ICustomizableField> = [
            {
                fieldId: 1,
                fieldReferenceId: 101,
                format: CustomizableFieldFormatEnum.STRING,
                referenceCode: 'TEST_REFERENCE_CODE',
                referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                referenceName: 'TEST_REFERENCE_NAME',
                isMandatory: true,
                value: 'TEST_VALUE',
            },
        ];
        jest.spyOn(api.deliveryPlan, 'getCustomizableField').mockResolvedValue(data);

        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.FETCH_ADDITIONAL_REFERENCE](
            { commit },
            { params: { relatedObjectId: 1000, relatedObjectType: RelatedObjectTypeEnum.CargoStuffing, screen: DeliveryPlanningViewNameEnum.DP_ManagePlan } },
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.SUCCEEDED, data);
    });

    it('FETCH_ADDITIONAL_REFERENCE commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.deliveryPlan, 'getCustomizableField').mockRejectedValue(error);

        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.FETCH_ADDITIONAL_REFERENCE](
            { commit },
            { params: { relatedObjectId: 1000, relatedObjectType: RelatedObjectTypeEnum.CargoStuffing, screen: DeliveryPlanningViewNameEnum.DP_ManagePlan } },
        ).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.FAILED);
    });

    it('SAVE_DELIVERY_PLAN commits SUCCEEDED mutation on request success', async () => {
        const data = {};
        jest.spyOn(api.deliveryPlan, 'updateFCLServicePlans').mockResolvedValue(data);
        jest.spyOn(api.deliveryPlan, 'updateCustomizableField').mockResolvedValue(data);
        const state = createState({
            deliveryPlan: {
                response: MOCK_SERVICE_PLAN,
            },
        });
        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN](
            { state, commit },
            { cargoStuffingId: 1000, isSendServicePlanRequest: false },
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.SUCCEEDED);
    });

    it('SAVE_DELIVERY_PLAN commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.deliveryPlan, 'updateFCLServicePlans').mockRejectedValue(error);

        const state = createState({
            deliveryPlan: {
                response: MOCK_SERVICE_PLAN,
            },
        });
        const commit = jest.fn();

        await deliveryPlanModule.actions[DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN](
            { state, commit },
            { cargoStuffingId: 1000, isSendServicePlanRequest: false },
        ).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.STARTED);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.FAILED);
    });

    it('CANCEL_DELIVERY_PLAN commits CANCEL_DELIVERY_PLAN, RESEQUENCE_DELIVERY_LEGS mutations and dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG, CHECK_AND_REMOVE_EMPTY_RETURN_LEG, CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION actions', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN]({ commit, dispatch });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.CANCEL_DELIVERY_PLAN);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
    });

    it('SET_IS_STOP_OFF_LOCATION commits SET_IS_STOP_OFF_LOCATION mutation and dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG action if isStopOffLocation is false', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const isStopOffLocation: boolean = false;

        deliveryPlanModule.actions[DeliveryPlanActionEnum.SET_IS_STOP_OFF_LOCATION]({ commit, dispatch }, { isStopOffLocation });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION, { isStopOffLocation });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
    });

    it('SET_IS_STOP_OFF_LOCATION commits SET_IS_STOP_OFF_LOCATION mutation if isStopOffLocation is true', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const isStopOffLocation: boolean = true;

        deliveryPlanModule.actions[DeliveryPlanActionEnum.SET_IS_STOP_OFF_LOCATION]({ commit, dispatch }, { isStopOffLocation });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION, { isStopOffLocation });

        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    // Delivery Leg
    it('ADD_DELIVERY_LEG commits ADD_DELIVERY_LEG mutation and dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG action', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.ADD_DELIVERY_LEG]({ commit, dispatch, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, {
            leg: expect.objectContaining({ legType: ServiceLegTypeEnum.SERVICE_LEG }),
        });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
    });

    it('COPY_DELIVERY_LEG dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG action', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
        };

        const leg = createMockServiceLeg({ status: ServiceLegStatusEnum.CANCELLED });
        deliveryPlanModule.actions[DeliveryPlanActionEnum.COPY_DELIVERY_LEG]({ commit, dispatch, getters }, { leg });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, {
            leg: expect.objectContaining({ status: ServiceLegStatusEnum.CREATED }),
        });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
    });

    it('REMOVE_DELIVERY_LEG commits REMOVE_DELIVERY_LEG, RESEQUENCE_DELIVERY_LEGS mutations and dispatches CHECK_AND_REMOVE_EMPTY_RETURN_LEG, CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION actions', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        const leg = createMockServiceLeg();
        deliveryPlanModule.actions[DeliveryPlanActionEnum.REMOVE_DELIVERY_LEG]({ commit, dispatch }, { leg });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
    });

    it('CANCEL_DELIVERY_LEG action commits CANCEL_DELIVERY_LEG, RESEQUENCE_DELIVERY_LEGS mutations and dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG, CHECK_AND_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION actions', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        const leg = createMockServiceLeg();
        deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG]({ commit, dispatch }, { leg });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.CANCEL_DELIVERY_LEG, { leg });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, {
            cancelledOrRejectedLeg: expect.objectContaining({ serviceLegId: leg.serviceLegId }),
        });
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
    });

    it('MOVE_DELIVERY_LEG action does not commits SWAP_DELIVERY_LEGS, SORT_DELIVERY_LEGS mutations when there are no legs to swap with', () => {
        const activeDeliveryLegs = [
            createMockServiceLeg({ sequence: 101, serviceLegId: 1001, legType: ServiceLegTypeEnum.SERVICE_LEG }),
            createMockServiceLeg({ sequence: 102, serviceLegId: 1002, legType: ServiceLegTypeEnum.SERVICE_LEG }),
        ];
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: activeDeliveryLegs,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG](
            { commit, getters },
            { leg: activeDeliveryLegs[0], direction: ServiceLegDirectionToMoveEnum.UP },
        );

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('MOVE_DELIVERY_LEG action commits SWAP_DELIVERY_LEGS, SORT_DELIVERY_LEGS mutations when there are legs to swap with', () => {
        const activeDeliveryLegs = [
            createMockServiceLeg({ sequence: 101, serviceLegId: 1001, legType: ServiceLegTypeEnum.SERVICE_LEG }),
            createMockServiceLeg({ sequence: 102, serviceLegId: 1002, legType: ServiceLegTypeEnum.SERVICE_LEG }),
        ];
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: activeDeliveryLegs,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG](
            { commit, getters },
            { leg: activeDeliveryLegs[0], direction: ServiceLegDirectionToMoveEnum.DOWN },
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SWAP_DELIVERY_LEGS, { leg1: activeDeliveryLegs[0], leg2: activeDeliveryLegs[1] });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SORT_DELIVERY_LEGS);
    });

    it('ACCEPT_DELIVERY_LEG action commits when servicelegs are present', () => {
        const commit = jest.fn();

        const leg = createMockServiceLeg();
        deliveryPlanModule.actions[DeliveryPlanActionEnum.ACCEPT_DELIVERY_LEG]({ commit }, { leg });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.ACCEPT_DELIVERY_LEG, { leg });
    });

    it('REJECT_DELIVERY_LEG action commits REJECT_DELIVERY_LEG, RESEQUENCE_DELIVERY_LEGS mutations and dispatches CHECK_AND_ADD_EMPTY_RETURN_LEG, CHECK_AND_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION actions', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        const leg = createMockServiceLeg();
        deliveryPlanModule.actions[DeliveryPlanActionEnum.REJECT_DELIVERY_LEG]({ commit, dispatch }, { leg });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.REJECT_DELIVERY_LEG, { leg });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, {
            cancelledOrRejectedLeg: expect.objectContaining({ serviceLegId: leg.serviceLegId }),
        });
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
    });

    it('UNDO_CANCEL_REJECT_DELIVERY_LEG action commits UNDO_CANCEL_REJECT_DELIVERY_LEG, RESEQUENCE_DELIVERY_LEGS mutations and commits REMOVE_EMPTY_RETURN_LEG, CHECK_AND_ADD_EMPTY_RETURN_LEG actions when ERL is part of undo legs', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10002,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
            ],
        });

        const commit = jest.fn();
        const dispatch = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: deliveryPlan.serviceLegs,
        };

        const leg = deliveryPlan.serviceLegs[0];
        deliveryPlanModule.actions[DeliveryPlanActionEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG]({ commit, dispatch, getters }, { leg });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG, { leg });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.REMOVE_EMPTY_RETURN_LEG);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
    });

    it('UNDO_CANCEL_REJECT_DELIVERY_LEG action commits UNDO_CANCEL_REJECT_DELIVERY_LEG, RESEQUENCE_DELIVERY_LEGS mutations and commits CHECK_AND_ADD_EMPTY_RETURN_LEG action when ERL is not part of undo legs', () => {
        const deliveryPlan = createMockServicePlan({
            serviceLegs: [
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 103,
                    serviceLegId: 1003,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    deliveryOrder: 10002,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1999,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    deliveryOrder: 10001,
                    status: ServiceLegStatusEnum.CANCELLED,
                    statusBeforeAction: ServiceLegStatusEnum.SENT,
                }),
            ],
        });

        const commit = jest.fn();
        const dispatch = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS]: deliveryPlan.serviceLegs,
        };

        const leg = deliveryPlan.serviceLegs[1];
        deliveryPlanModule.actions[DeliveryPlanActionEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG]({ commit, dispatch, getters }, { leg });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG, { leg });
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
    });

    it('REMOVE_EMPTY_RETURN_LEG does not commit REMOVE_DELIVERY_LEG mutation when active empty return leg is not present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.REMOVE_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('REMOVE_EMPTY_RETURN_LEG commits REMOVE_DELIVERY_LEG mutation when active empty return leg is present', () => {
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.REMOVE_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg });
    });

    it('CHECK_AND_ADD_EMPTY_RETURN_LEG does not commit ADD_DELIVERY_LEG mutation when active delivery legs are not present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_ADD_EMPTY_RETURN_LEG does not commit ADD_DELIVERY_LEG mutation when active empty return leg is present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG }),
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_ADD_EMPTY_RETURN_LEG does not commit ADD_DELIVERY_LEG mutation when stop off location is true', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_IS_STOP_OFF_LOCATION]: jest.fn().mockReturnValue(true),
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_ADD_EMPTY_RETURN_LEG commits ADD_DELIVERY_LEG mutation when active delivery legs are present and active empty return leg is not present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, {
            leg: expect.objectContaining({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG }),
        });
    });

    it('CHECK_AND_REMOVE_EMPTY_RETURN_LEG does not commit REMOVE_DELIVERY_LEG mutation when active delivery legs are present', () => {
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_REMOVE_EMPTY_RETURN_LEG does not commit REMOVE_DELIVERY_LEG mutation when active empty return leg is not present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_REMOVE_EMPTY_RETURN_LEG commits REMOVE_DELIVERY_LEG mutation when active delivery legs are not present and active empty return leg is present', () => {
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg });
    });

    it('CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG does not commit any mutation when active delivery legs are present', () => {
        const cancelledOrRejectedLeg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.CANCELLED,
            deliveryOrder: '10001',
        });
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG](
            { commit, getters },
            { cancelledOrRejectedLeg },
        );

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG does not commit any mutation when active empty return leg is not present', () => {
        const cancelledOrRejectedLeg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.CANCELLED,
            deliveryOrder: '10001',
        });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG](
            { commit, getters },
            { cancelledOrRejectedLeg },
        );

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG commits REMOVE_DELIVERY_LEG mutation when active delivery legs are not present and active empty return leg is present with status as CREATED', () => {
        const cancelledOrRejectedLeg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.CANCELLED,
            deliveryOrder: '10001',
        });
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LE, status: ServiceLegStatusEnum.CREATED });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG](
            { commit, getters },
            { cancelledOrRejectedLeg },
        );

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg });
    });

    it('CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG commits REMOVE_DELIVERY_LEG mutation when active delivery legs are not present and active empty return leg is present with status other than CREATED', () => {
        const cancelledOrRejectedLeg = createMockServiceLeg({
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.CANCELLED,
            deliveryOrder: '10001',
        });
        const activeEmptyReturnLeg = createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LE, status: ServiceLegStatusEnum.SENT });
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: activeEmptyReturnLeg,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG](
            { commit, getters },
            { cancelledOrRejectedLeg },
        );

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.CANCEL_OR_REJECT_EMPTY_RETURN_LEG, { leg: activeEmptyReturnLeg, cancelledOrRejectedLeg });
    });

    it('CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION does not commit SET_IS_STOP_OFF_LOCATION mutation when active delivery legs are present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [createMockServiceLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG })],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION does not commit SET_IS_STOP_OFF_LOCATION mutation when active empty return leg is present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: createMockServiceLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG }),
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION commits SET_IS_STOP_OFF_LOCATION mutation when active delivery legs are not present and active empty return leg is not present', () => {
        const commit = jest.fn();
        const getters = {
            [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS]: [],
            [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG]: undefined,
        };

        deliveryPlanModule.actions[DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION]({ commit, getters });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION, { isStopOffLocation: false });
    });
});
