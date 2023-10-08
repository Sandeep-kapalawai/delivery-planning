import {
    DeliveryPlanningViewNameEnum,
    DeliveryPlanTypeEnum,
    RelatedObjectTypeEnum,
    ServicePlanTransportModeEnum,
    PlanningStatusEnum,
    ServicePlanFeeTypeEnum,
    ServiceLegTypeEnum,
    ServiceLegStatusEnum,
    ServiceLegSpecialInstructionEnum,
    ServiceLegDeliveryTypeEnum,
    ServiceLegDeliveryTimeOptionEnum,
} from '@/static';
import { CustomizableFieldFormatEnum } from '@/static/delivery-plan';

export interface IServicePlan {
    deliveryPlanType: DeliveryPlanTypeEnum;
    isFinalized: boolean;
    planningStatus: PlanningStatusEnum;
    emptyReturnLocationCode: string;
    emptyReturnDisplayName: string;
    emptyReturnDisplayText: string;
    pickupReference: string;
    pickupReferenceExpiryDateTimeLocal: string;
    lastFreeDateTimeLocal: string;
    lastFreeTimeZone: string;
    countLastFreeDate: number;
    feeType: ServicePlanFeeTypeEnum;
    freeReturnDateTimeLocal: string;
    freeReturnTimeZone: string;
    countFreeRetunrDate: number;
    feeTypeReturn: string;
    isUnloadedFromVessel: boolean;
    isStopOffLocation: boolean;
    serviceLegs: Array<IServiceLeg>;
}

export interface IServiceLeg {
    sequence: number;
    serviceLegId?: number | string;
    legType: ServiceLegTypeEnum;
    returnSameAsPickup?: boolean;
    deliveryOrder?: string;
    version?: number;
    isLastUpdateFromITM?: boolean | null;
    status: ServiceLegStatusEnum;
    createdDateTimeUTC?: string;
    pickupData: {
        pickUpAddress: {
            beCode?: string;
            displayName?: string;
            displayText?: string;
        };
        specialInstruction: ServiceLegSpecialInstructionEnum;
        pickupDateTimeZone?: string;
        pickupFromDateTimeUTC?: string | null;
        pickupFromDateTime?: string | null;
        pickupUtcOffsetMinutes: number | null;
        isScheduledPickupFromTimeSetByUser: boolean;
        pickupOnDate: string | null; // Custom Property
        pickupFromTime: string | null; // Custom Property
    };
    deliveryData: {
        deliveryAddress: {
            beCode?: string;
            displayName?: string;
            displayText?: string;
        };
        deliveryReference?: string;
        deliveryType: ServiceLegDeliveryTypeEnum | null;
        deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum;
        deliveryTimeZone?: string;
        deliveryFromDateTimeUTC?: string | null;
        deliveryFromDateTime?: string | null;
        deliveryToDateTimeUTC?: string | null;
        deliveryToDateTime?: string | null;
        deliveryUtcOffsetMinutes: number | null;
        isScheduledArrivalFromTimeSetByUser: boolean;
        isScheduledArrivalToTimeSetByUser: boolean;
        deliveryOnDate: string | null; // Custom Property
        deliveryFromTime: string | null; // Custom Property
        deliveryToTime: string | null; // Custom Property
    };
    transportData: {
        transportMode: ServicePlanTransportModeEnum;
        provider: {
            providerName?: string;
            providerBECode?: string;
        };
        additionalInstruction?: string;
    };
    statusBeforeAction?: ServiceLegStatusEnum; // Custom Property, Required in the Cancel/Reject Leg flow
    actionTakenAsPartOfDeliveryOrder?: string; // Custom Property, Required in the Cancel/Reject Leg flow
}

export interface IServicePlanPayload {
    deliveryPlanType: DeliveryPlanTypeEnum;
    isFinalized: boolean;
    isSendServicePlanRequest: boolean;
    isStopOffLocation: boolean;
    serviceLegs?: Array<IServiceLegPayload>;
}

export interface IServiceLegPayload {
    sequence: number;
    serviceLegId?: number | string;
    legType: string;
    version?: number;
    status: ServiceLegStatusEnum;
    pickupData: {
        pickUpAddress: {
            beCode?: string;
            displayName?: string;
            displayText?: string;
        };
        specialInstruction: ServiceLegSpecialInstructionEnum;
        pickupDateTimeZone?: string;
        pickupFromDateTimeUTC?: string | null;
        pickupFromDateTime?: string | null;
        pickupUtcOffsetMinutes: number | null;
        isScheduledPickupFromTimeSetByUser: boolean;
    };
    deliveryData: {
        deliveryAddress: {
            beCode?: string;
            displayName?: string;
            displayText?: string;
        };
        deliveryReference?: string;
        deliveryType: ServiceLegDeliveryTypeEnum | null;
        deliveryTimeZone?: string;
        deliveryFromDateTimeUTC?: string | null;
        deliveryFromDateTime?: string | null;
        deliveryToDateTimeUTC?: string | null;
        deliveryToDateTime?: string | null;
        deliveryUtcOffsetMinutes: number | null;
        isScheduledArrivalFromTimeSetByUser: boolean;
        isScheduledArrivalToTimeSetByUser: boolean;
    };
    transportData: {
        transportMode: ServicePlanTransportModeEnum;
        provider: {
            providerName?: string;
            providerBECode?: string;
        };
        additionalInstruction?: string;
    };
}

export interface ICustomizableFieldRequestParams {
    relatedObjectId: number | string;
    relatedObjectType: RelatedObjectTypeEnum;
    screen: DeliveryPlanningViewNameEnum;
}

export interface ICustomizableField {
    fieldId: number;
    fieldReferenceId: number;
    format: CustomizableFieldFormatEnum;
    referenceCode: string;
    referenceDescription: string;
    referenceName: string;
    isMandatory: boolean;
    value: string | null;
}

export interface ICustomizableFieldPayload {
    relatedObjectId: number | string;
    relatedObjectType: RelatedObjectTypeEnum;
    fieldReferenceId: number;
    referenceCode: string;
    value: string | null;
}
