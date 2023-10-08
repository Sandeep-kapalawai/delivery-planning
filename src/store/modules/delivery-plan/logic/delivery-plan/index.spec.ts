import { ICustomizableFieldPayload, ILocationFullAddress, IServiceLeg, IServicePlanPayload } from '@/interfaces';
import { RelatedObjectTypeEnum, ServiceLegStatusEnum, ServiceLegTypeEnum } from '@/static';
import {
    mapDeliveryPlanCustomProperties,
    mapDeliveryLegCustomProperties,
    isServiceLegActive,
    isServiceLegSent,
    isServiceLegStatusSentOrAccepted,
    isServiceLegCancelled,
    isServiceLegRejected,
    isEmptyReturnLeg,
    isNotEmptyReturnLeg,
    mapLocationToAddress,
    mapDeliveryPlanToPaylaod,
    mapAdditionalReferencesToPaylaod,
    createEmptyDeliveryLeg,
    createDuplicateDeliveryLeg,
} from '.';
import { createMockServicePlan, createMockServiceLeg } from '@/mocks';

describe('delivery-plan store logic', () => {
    describe('mapDeliveryPlanCustomProperties', () => {
        it('returns delivery plan when delivery plan is not available', () => {
            const MOCK_SERVICE_PLAN = null as any;
            expect(mapDeliveryPlanCustomProperties(MOCK_SERVICE_PLAN)).toBe(MOCK_SERVICE_PLAN);
        });

        it('returns delivery plan when service legs is not available', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();
            MOCK_SERVICE_PLAN.serviceLegs = null as any;

            expect(mapDeliveryPlanCustomProperties(MOCK_SERVICE_PLAN)).toBe(MOCK_SERVICE_PLAN);
        });

        it('returns delivery plan when service legs is empty', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();
            MOCK_SERVICE_PLAN.serviceLegs = [];

            expect(mapDeliveryPlanCustomProperties(MOCK_SERVICE_PLAN)).toBe(MOCK_SERVICE_PLAN);
        });

        it('returns mapped delivery plan', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();

            const output = mapDeliveryPlanCustomProperties(MOCK_SERVICE_PLAN);

            expect(output.serviceLegs.length).toBe(MOCK_SERVICE_PLAN.serviceLegs.length);
        });
    });

    describe('mapDeliveryLegCustomProperties', () => {
        it('returns delivery leg when delivery leg is not available', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = null as any;
            expect(mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG)).toEqual(MOCK_SERVICE_LEG);
        });

        it('returns delivery leg when delivery leg is not active', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({ status: ServiceLegStatusEnum.CANCELLED });
            expect(mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG)).toEqual(MOCK_SERVICE_LEG);
        });

        it('sets deliveryOnDate for delivery leg', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                deliveryData: {
                    deliveryFromDateTime: '2022-01-01T01:00:00Z',
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.deliveryData.deliveryOnDate).toBe('2022-01-01T01:00:00Z');
        });

        it('sets deliveryFromTime and deliveryToTime for delivery leg when time is set by user', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                deliveryData: {
                    deliveryFromDateTime: '2022-01-01T01:00:00Z',
                    deliveryToDateTime: '2022-01-01T02:00:00Z',
                    isScheduledArrivalFromTimeSetByUser: true,
                    isScheduledArrivalToTimeSetByUser: true,
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.deliveryData.deliveryOnDate).toBe('2022-01-01T01:00:00Z');
            expect(output.deliveryData.deliveryFromTime).toBe('01:00');
            expect(output.deliveryData.deliveryToTime).toBe('02:00');
        });

        it('does not set deliveryFromTime and deliveryToTime for delivery leg when time is not set by user', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                deliveryData: {
                    deliveryFromDateTime: '2022-01-01T00:00:00Z',
                    deliveryToDateTime: '2022-01-01T00:00:00Z',
                    isScheduledArrivalFromTimeSetByUser: false,
                    isScheduledArrivalToTimeSetByUser: false,
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.deliveryData.deliveryOnDate).toBe('2022-01-01T00:00:00Z');
            expect(output.deliveryData.deliveryFromTime).toBe(null);
            expect(output.deliveryData.deliveryToTime).toBe(null);
        });

        it('sets pickupOnDate for delivery leg', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                pickupData: {
                    pickupFromDateTime: '2022-01-01T01:00:00Z',
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.pickupData.pickupOnDate).toBe('2022-01-01T01:00:00Z');
        });

        it('sets pickupFromTime for delivery leg when time is set by user', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                pickupData: {
                    pickupFromDateTime: '2022-01-01T01:00:00Z',
                    isScheduledPickupFromTimeSetByUser: true,
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.pickupData.pickupOnDate).toBe('2022-01-01T01:00:00Z');
            expect(output.pickupData.pickupFromTime).toBe('01:00');
        });

        it('does not set pickupFromTime for delivery leg when time is not set by user', () => {
            const MOCK_SERVICE_LEG: IServiceLeg = createMockServiceLeg({
                pickupData: {
                    pickupFromDateTime: '2022-01-01T00:00:00Z',
                    isScheduledPickupFromTimeSetByUser: false,
                } as any,
            });

            const output = mapDeliveryLegCustomProperties(MOCK_SERVICE_LEG);

            expect(output.pickupData.pickupOnDate).toBe('2022-01-01T00:00:00Z');
            expect(output.pickupData.pickupFromTime).toBe(null);
        });
    });

    describe('isServiceLegActive', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, true],
            [ServiceLegStatusEnum.UPDATED, true],
            [ServiceLegStatusEnum.SENT, true],
            [ServiceLegStatusEnum.ACCEPTED, true],
            [ServiceLegStatusEnum.REJECTED, false],
            [ServiceLegStatusEnum.CANCELLED, false],
        ])('for leg with status: %s, isServiceLegActive returns %s', (status: ServiceLegStatusEnum, expectedOutput: boolean) => {
            expect(isServiceLegActive({ status } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('isServiceLegSent', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, undefined, false],
            [ServiceLegStatusEnum.CREATED, 'TEST_DO_NUMBER', false],
            [ServiceLegStatusEnum.UPDATED, undefined, false],
            [ServiceLegStatusEnum.UPDATED, 'TEST_DO_NUMBER', true],
            [ServiceLegStatusEnum.SENT, undefined, false],
            [ServiceLegStatusEnum.SENT, 'TEST_DO_NUMBER', true],
            [ServiceLegStatusEnum.ACCEPTED, undefined, false],
            [ServiceLegStatusEnum.ACCEPTED, 'TEST_DO_NUMBER', true],
            [ServiceLegStatusEnum.REJECTED, undefined, false],
            [ServiceLegStatusEnum.REJECTED, 'TEST_DO_NUMBER', false],
            [ServiceLegStatusEnum.CANCELLED, undefined, false],
            [ServiceLegStatusEnum.CANCELLED, 'TEST_DO_NUMBER', false],
        ])(
            'for leg with status: %s and deliveryOrder: %s, isServiceLegSent returns %s',
            (status: ServiceLegStatusEnum, deliveryOrder: string | undefined, expectedOutput: boolean) => {
                expect(isServiceLegSent({ status, deliveryOrder } as IServiceLeg)).toBe(expectedOutput);
            },
        );
    });

    describe('isServiceLegStatusSentOrAccepted', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, undefined, false],
            [ServiceLegStatusEnum.CREATED, 'TEST_DO_NUMBER', false],
            [ServiceLegStatusEnum.UPDATED, undefined, false],
            [ServiceLegStatusEnum.UPDATED, 'TEST_DO_NUMBER', false],
            [ServiceLegStatusEnum.SENT, undefined, false],
            [ServiceLegStatusEnum.SENT, 'TEST_DO_NUMBER', true],
            [ServiceLegStatusEnum.ACCEPTED, undefined, false],
            [ServiceLegStatusEnum.ACCEPTED, 'TEST_DO_NUMBER', true],
            [ServiceLegStatusEnum.REJECTED, undefined, false],
            [ServiceLegStatusEnum.REJECTED, 'TEST_DO_NUMBER', false],
            [ServiceLegStatusEnum.CANCELLED, undefined, false],
            [ServiceLegStatusEnum.CANCELLED, 'TEST_DO_NUMBER', false],
        ])(
            'for leg with status: %s and deliveryOrder: %s, isServiceLegStatusSentOrAccepted returns %s',
            (status: ServiceLegStatusEnum, deliveryOrder: string | undefined, expectedOutput: boolean) => {
                expect(isServiceLegStatusSentOrAccepted({ status, deliveryOrder } as IServiceLeg)).toBe(expectedOutput);
            },
        );
    });

    describe('isServiceLegCancelled', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, false],
            [ServiceLegStatusEnum.UPDATED, false],
            [ServiceLegStatusEnum.SENT, false],
            [ServiceLegStatusEnum.ACCEPTED, false],
            [ServiceLegStatusEnum.REJECTED, false],
            [ServiceLegStatusEnum.CANCELLED, true],
        ])('for leg with status: %s, isServiceLegCancelled returns %s', (status: ServiceLegStatusEnum, expectedOutput: boolean) => {
            expect(isServiceLegCancelled({ status } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('isServiceLegRejected', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, false],
            [ServiceLegStatusEnum.UPDATED, false],
            [ServiceLegStatusEnum.SENT, false],
            [ServiceLegStatusEnum.ACCEPTED, false],
            [ServiceLegStatusEnum.REJECTED, true],
            [ServiceLegStatusEnum.CANCELLED, false],
        ])('for leg with status: %s, isServiceLegRejected returns %s', (status: ServiceLegStatusEnum, expectedOutput: boolean) => {
            expect(isServiceLegRejected({ status } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('isEmptyReturnLeg', () => {
        it.each([
            [ServiceLegTypeEnum.SERVICE_LEG, false],
            [ServiceLegTypeEnum.EMPTY_RETURN_LEG, true],
        ])('for leg with legType: %s, isEmptyReturnLeg returns %s', (legType: ServiceLegTypeEnum, expectedOutput: boolean) => {
            expect(isEmptyReturnLeg({ legType } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('isEmptyReturnLeg', () => {
        it.each([
            [ServiceLegTypeEnum.SERVICE_LEG, false],
            [ServiceLegTypeEnum.EMPTY_RETURN_LEG, true],
        ])('for leg with legType: %s, isEmptyReturnLeg returns %s', (legType: ServiceLegTypeEnum, expectedOutput: boolean) => {
            expect(isEmptyReturnLeg({ legType } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('isNotEmptyReturnLeg', () => {
        it.each([
            [ServiceLegTypeEnum.SERVICE_LEG, true],
            [ServiceLegTypeEnum.EMPTY_RETURN_LEG, false],
        ])('for leg with legType: %s, isNotEmptyReturnLeg returns %s', (legType: ServiceLegTypeEnum, expectedOutput: boolean) => {
            expect(isNotEmptyReturnLeg({ legType } as IServiceLeg)).toBe(expectedOutput);
        });
    });

    describe('mapLocationToAddress', () => {
        it('return empty object when location is undefined', () => {
            expect(mapLocationToAddress(undefined as any)).toStrictEqual({
                beCode: undefined,
                displayName: undefined,
                displayText: undefined,
            });
        });

        it('return address from location', () => {
            const facilityCode: string = 'TEST_FACILITY_CODE';
            const displayName: string = 'TEST_DISPLAY_NAME';
            const displayText: string = 'TEST_DISPLAY_TEXT';

            expect(mapLocationToAddress({ facilityCode, displayName, displayText } as ILocationFullAddress)).toStrictEqual({
                beCode: facilityCode,
                displayName,
                displayText,
            });
        });
    });

    describe('mapDeliveryPlanToPaylaod', () => {
        it('returns null when deliveryPlan is null', () => {
            expect(mapDeliveryPlanToPaylaod(null as any)).toBe(null);
        });

        it('returns null when deliveryPlan.serviceLegs is null', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();
            MOCK_SERVICE_PLAN.serviceLegs = null as any;

            expect(mapDeliveryPlanToPaylaod(MOCK_SERVICE_PLAN)).toBe(null);
        });

        it('returns null when deliveryPlan.serviceLegs is empty', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();
            MOCK_SERVICE_PLAN.serviceLegs = [];

            expect(mapDeliveryPlanToPaylaod(MOCK_SERVICE_PLAN)).toBe(null);
        });

        it('returns delivery plan payload', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan();
            const MOCK_SERVICE_LEGS = [
                createMockServiceLeg({
                    sequence: 100,
                    serviceLegId: 2002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    status: ServiceLegStatusEnum.REJECTED,
                }),
                createMockServiceLeg({
                    sequence: 100,
                    serviceLegId: 2001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    status: ServiceLegStatusEnum.CANCELLED,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1901,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    status: ServiceLegStatusEnum.CREATED,
                }),
                createMockServiceLeg({
                    sequence: 1000,
                    serviceLegId: 1902,
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    status: ServiceLegStatusEnum.UPDATED,
                }),
                createMockServiceLeg({
                    sequence: 101,
                    serviceLegId: 1001,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                }),
                createMockServiceLeg({
                    sequence: 102,
                    serviceLegId: 1002,
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                }),
            ];
            MOCK_SERVICE_PLAN.serviceLegs = MOCK_SERVICE_LEGS;
            const isSendServicePlanRequest = false;

            const output = mapDeliveryPlanToPaylaod(MOCK_SERVICE_PLAN, isSendServicePlanRequest) as IServicePlanPayload;

            expect(output.deliveryPlanType).toBe(MOCK_SERVICE_PLAN.deliveryPlanType);
            expect(output.isSendServicePlanRequest).toBe(isSendServicePlanRequest);
            expect(output.serviceLegs?.[0].serviceLegId).toBe(1001);
            expect(output.serviceLegs?.[1].serviceLegId).toBe(1002);
            expect(output.serviceLegs?.[2].serviceLegId).toBe(undefined);
            expect(output.serviceLegs?.[3].serviceLegId).toBe(1902);
            expect(output.serviceLegs?.[4].serviceLegId).toBe(2001);
            expect(output.serviceLegs?.[5].serviceLegId).toBe(2002);
        });
    });

    describe('mapAdditionalReferencesToPaylaod', () => {
        it('returns null when additionalReferences is null', () => {
            expect(mapAdditionalReferencesToPaylaod(null as any)).toBe(null);
        });

        it('returns null when additionalReferences.size is 0', () => {
            expect(mapAdditionalReferencesToPaylaod(new Map())).toBe(null);
        });

        it('returns additionalReferences payload', () => {
            const additionalReferenceFields: Array<ICustomizableFieldPayload> = [
                {
                    relatedObjectId: 1001,
                    relatedObjectType: RelatedObjectTypeEnum.CargoStuffing,
                    fieldReferenceId: 101,
                    referenceCode: 'TEST_REFERENCE_CODE',
                    value: 'TEST_VALUE',
                },
            ];
            const additionalReferences = new Map(additionalReferenceFields.map((field) => [field.fieldReferenceId, field]));

            expect(mapAdditionalReferencesToPaylaod(additionalReferences)).toEqual({ customizableFields: additionalReferenceFields });
        });
    });

    describe('createEmptyDeliveryLeg', () => {
        it('creates a new leg when last leg is not present', () => {
            const output = createEmptyDeliveryLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG });

            expect(output.sequence).toBe(101);
        });

        it('creates a new leg when last leg is present', () => {
            const lastActiveDeliveryLeg = createMockServiceLeg({
                sequence: 101,
                pickupData: {
                    pickUpAddress: {
                        beCode: 'TEST_BE_CODE',
                        displayName: 'TEST_CITY_NAME',
                        displayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
                    },
                },
            } as IServiceLeg);
            const output = createEmptyDeliveryLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG, lastActiveDeliveryLeg });

            expect(output.sequence).toBe(102);
            expect(output.pickupData.pickUpAddress).toStrictEqual({
                beCode: undefined,
                displayName: undefined,
                displayText: undefined,
            });
        });

        it('creates a new leg and copy pickup address from last leg', () => {
            const lastActiveDeliveryLeg = createMockServiceLeg({
                sequence: 101,
                pickupData: {
                    pickUpAddress: {
                        beCode: 'TEST_BE_CODE',
                        displayName: 'TEST_CITY_NAME',
                        displayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
                    },
                },
            } as IServiceLeg);
            const output = createEmptyDeliveryLeg({ legType: ServiceLegTypeEnum.SERVICE_LEG, copyLastLegDeliveryToPickup: true, lastActiveDeliveryLeg });

            expect(output.sequence).toBe(102);
            expect(output.pickupData.pickUpAddress).toStrictEqual({
                beCode: 'TEST_BE_CODE',
                displayName: 'TEST_CITY_NAME',
                displayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
            });
        });

        it('creates a new empty return leg', () => {
            const lastActiveDeliveryLeg = createMockServiceLeg({
                sequence: 101,
            } as IServiceLeg);
            const output = createEmptyDeliveryLeg({ legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG, lastActiveDeliveryLeg });

            expect(output.sequence).toBe(1000);
        });
    });

    describe('createDuplicateDeliveryLeg', () => {
        it('creates a duplicate leg with sequence as 1 when last leg is not present', () => {
            const output = createDuplicateDeliveryLeg({
                leg: createMockServiceLeg({
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    status: ServiceLegStatusEnum.CANCELLED,
                }),
            });

            expect(output.sequence).toBe(101);
            expect(output.status).toBe(ServiceLegStatusEnum.CREATED);
        });

        it('creates a duplicate leg with sequence as +1 when last leg is present', () => {
            const lastActiveDeliveryLeg = createMockServiceLeg({ sequence: 101 } as IServiceLeg);
            const output = createDuplicateDeliveryLeg({
                leg: createMockServiceLeg({
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    status: ServiceLegStatusEnum.CANCELLED,
                }),
                lastActiveDeliveryLeg,
            });

            expect(output.sequence).toBe(102);
            expect(output.status).toBe(ServiceLegStatusEnum.CREATED);
        });
    });
});
