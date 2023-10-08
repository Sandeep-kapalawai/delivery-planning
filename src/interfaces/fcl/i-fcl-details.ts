import { ShipmentStatusEnum, PrimaryExecutiveStatus, SecondaryExecutiveStatus } from '@/static';

export interface ICargoStuffingDetails {
    deliveryPlanId: string;
    cargoStuffingId: number | string;
    cargoStuffingNumber: string;
    consigneeName: string;
    consigneeBECode: string;
    sealNumber: string;
    cargoStuffingType: string;
    carrierName: string;
    carrierCode: string;
    primaryExecutiveStatus?: PrimaryExecutiveStatus;
    secondaryExecutiveStatus?: SecondaryExecutiveStatus;
    cargoStuffingPriority: {
        id: number;
        level: number;
        displayName: string;
        programName: string;
        programGroupName: string;
    };
    hasDangerousGoods: boolean;
    hasGarmentOnHanger: boolean;
    isReefer: boolean;
    vesselVoyage: string;
    portOfDischargeLocation: string;
    portOfDischargeCountry: string;
    transportDocumentNumber: string;
    transportDocumentTypeCode: string;
    latestDeliveryDateTimeUTC: string;
    latestDeliveryDateTimeLocal: string;
    predictiveEstimatedTimeOfArrivalDateTimeUTC: string;
    estimatedTimeOfArrivalDateTimeUTC: string;
    estimatedTimeOfArrivalDateTimeLocal: string;
    estimatedTimeOfArrivalTimeZone: string;
    terminalReadyDateTimeUTC: string;
    carrierReleasedDateTimeUTC: string;
    carrierReleasedDateTimeLocal: string;
    carrierReleasedTimeZone: string;
    inDCDateTimeUTC?: string;
    inDCDateTimeLocal?: string;
    inDCTimeZone?: string;
    customsClearedDateTimeUTC: string;
    pickupReference: string;
    pickupReferenceExpiryDateTimeUTC: string;
    pickupReferenceExpiryDateTimeLocal: string;
    pickupReferenceExpiryTimeZone: string;
    emptyReturnReference: string;
    emptyReturnReferenceExpiryDateTimeUTC: string;
    emptyReturnReferenceExpiryDateTimeLocal: string;
    emptyReturnReferenceExpiryTimeZone: string;
    actualTimeOfArrivalDateTimeLocal: string;
    cargoStuffingGateOutDateTimeLocal: string;
    cargoStuffingFeeType: null; //TODO
    lastFreeDateTimeLocal: string;
    haveMultipleTransportDocuments: boolean;
    specialProgram: {
        id: number;
        specialProgramName: string;
    };
    countLastFreeDate: string;
    contractStartEvent: null; //TODO
    lastFreeTimeZone: string;
    serviceScope?: string;
    shipmentMessageSource: null; //TODO
    customerFinalPlaceOfDeliveryFacilityCode: string;
    customerFinalPlaceOfDeliveryFacilityDetails: string;
    shipmentStatus?: ShipmentStatusEnum;
    estimatedTimeOfDischargeDateTimeLocal: string;
    estimatedTimeOfDischargeDateTimeUTC: string;
    gasCheckDetails: {
        gasCheckRequired: boolean;
        gasCheckResult: string;
        gasCheckRequestedBy: string;
        gasCheckRequestedDate: string;
    };
}
