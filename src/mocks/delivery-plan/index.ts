import { merge } from 'lodash';
import { IServicePlan, IServiceLeg } from '@/interfaces';
import {
    DeliveryPlanTypeEnum,
    ServicePlanTransportModeEnum,
    PlanningStatusEnum,
    ServicePlanFeeTypeEnum,
    ServiceLegTypeEnum,
    ServiceLegStatusEnum,
    ServiceLegSpecialInstructionEnum,
    ServiceLegDeliveryTypeEnum,
    ServiceLegDeliveryTimeOptionEnum,
} from '@/static';

export function createMockServicePlan(servicePlan?: Partial<IServicePlan>): IServicePlan {
    const mockServicePlan = merge(
        {
            deliveryPlanType: DeliveryPlanTypeEnum.SINGLE_DROP,
            isFinalized: false,
            planningStatus: PlanningStatusEnum.PLANNING_IN_PROGRESS,
            emptyReturnLocationCode: 'TEST_BE_CODE',
            emptyReturnDisplayName: 'TEST_CITY_NAME',
            emptyReturnDisplayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
            pickupReference: 'TEST_PICKUP_REFERENCE',
            pickupReferenceExpiryDateTimeLocal: '2023-01-01T00:00:00Z',
            lastFreeDateTimeLocal: '2023-01-01T00:00:00Z',
            countLastFreeDate: 1,
            feeType: ServicePlanFeeTypeEnum.Storage,
            freeReturnDateTimeLocal: '2023-01-01T00:00:00Z',
            countFreeRetunrDate: 1,
            feeTypeReturn: 'TEST_FEE_TYPE_RETURN',
            isUnloadedFromVessel: false,
            isStopOffLocation: false,
            lastFreeTimeZone: 'UTC',
            freeReturnTimeZone: 'UTC',
            serviceLegs: [],
        } as IServicePlan,
        servicePlan,
    );

    mockServicePlan.serviceLegs = servicePlan?.serviceLegs ?? [
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
    ];

    return mockServicePlan;
}

export function createMockServiceLeg(serviceLeg?: Partial<IServiceLeg>): IServiceLeg {
    return merge(
        {
            sequence: 101,
            serviceLegId: 1001,
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            returnSameAsPickup: false,
            deliveryOrder: 'TEST_DELIVERY_ORDER',
            version: 1,
            isLastUpdateFromITM: null,
            status: ServiceLegStatusEnum.CREATED,
            createdDateTimeUTC: '2023-01-01T00:00:00Z',
            pickupData: {
                pickUpAddress: {
                    beCode: 'TEST_BE_CODE',
                    displayName: 'TEST_CITY_NAME',
                    displayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
                },
                specialInstruction: ServiceLegSpecialInstructionEnum.NONE,
                pickupDateTimeZone: 'UTC',
                pickupFromDateTimeUTC: '2023-01-01T00:00:00Z',
                pickupFromDateTime: '2023-01-01T00:00:00Z',
                pickupUtcOffsetMinutes: 0,
                isScheduledPickupFromTimeSetByUser: false,
                pickupOnDate: '01 Jan 2023',
                pickupFromTime: '01:00',
            },
            deliveryData: {
                deliveryAddress: {
                    beCode: 'TEST_BE_CODE',
                    displayName: 'TEST_CITY_NAME',
                    displayText: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
                },
                deliveryReference: 'TEST_DELIVERY_REFERENCE',
                deliveryType: ServiceLegDeliveryTypeEnum.LIVE_UNLOAD,
                deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum.SPECIFIC_TIME,
                deliveryTimeZone: 'UTC',
                deliveryFromDateTimeUTC: '2023-01-01T00:00:00Z',
                deliveryFromDateTime: '2023-01-01T00:00:00Z',
                deliveryToDateTimeUTC: '2023-01-01T00:00:00Z',
                deliveryToDateTime: '2023-01-01T00:00:00Z',
                deliveryUtcOffsetMinutes: 0,
                isScheduledArrivalFromTimeSetByUser: false,
                isScheduledArrivalToTimeSetByUser: false,
                deliveryOnDate: '01 Jan 2023',
                deliveryFromTime: '01:00',
                deliveryToTime: '02:00',
            },
            transportData: {
                transportMode: ServicePlanTransportModeEnum.ROAD,
                provider: { providerName: 'TEST_PROVIDER_NAME', providerBECode: 'TEST_PROVIDER_BE_CODE' },
                additionalInstruction: 'TEST_ADDITIONAL_INSTRUCTION',
            },
        } as IServiceLeg,
        serviceLeg,
    );
}
