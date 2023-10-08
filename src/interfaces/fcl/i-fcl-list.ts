import { ShipmentStatusEnum, PrimaryExecutiveStatus, SecondaryExecutiveStatus, PlanningStatusEnum } from '@/static';
import { IFees, ILegDetails } from '@/interfaces';

export interface IFclList {
    result: Array<IFclListItem>;
    resultTotalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface IFclListItem {
    deliveryPlanId: string;
    cargoStuffingId: number;
    cargoStuffingNumber: string;
    cargoStuffingType: string;
    demurrageAndDetentionStatus: null; //TODO
    customerFinalPlaceOfDeliveryFacilityCode: string;
    customerFinalPlaceOfDeliveryFacilityDetails: string;
    primaryExecutiveStatus: PrimaryExecutiveStatus;
    secondaryExecutiveStatus: SecondaryExecutiveStatus;
    hasGarmentOnHanger: boolean;
    hasDangerousGoods: boolean;
    isReefer: boolean;
    pickupReference: string;
    pickupReferenceExpiryDateTimeLocal: string;
    pickupReferenceExpiryDateTimeUTC: string;
    pickupReferenceExpiryTimeZone: string;
    emptyReturnReference: string;
    emptyReturnReferenceExpiryDateTimeUTC: string;
    emptyReturnReferenceExpiryDateTimeLocal: string;
    emptyReturnReferenceExpiryTimeZone: string;
    containerLastUserUpdated: string;
    containerLastUserUpdatedDateTime: string;
    containerIsLastUpdatedByExcel: boolean;
    lastUpdateDate: string;
    purchaseOrdersCount: number;
    deliveryOrderCount: number;
    consigneeBECode: string;
    consigneeName: string;
    shipmentMessageSource: null; //TODO
    shipmentStatus: ShipmentStatusEnum;
    haveMultipleTransportDocuments: boolean;
    transportDocumentNumber: string;
    maerskCarrierName: string;
    maerskCarrierCode: string;
    planningStatus: PlanningStatusEnum;
    servicePlanId: number;
    countLastFreeDate: number;
    cargoStuffingFeeType: null; //TODO
    lastFreeDateTimeLocal: string;
    lastFreeDateTimeUTC: string;
    lastFreeTimeZone: string;
    contractStartEvent: string;
    cargoStuffingPriorityLevel: null; //TODO
    cargoStuffingPriorityDisplayName: string;
    cargoStuffingPriorityProgramName: string;
    cargoStuffingPriorityProgramGroupName: string;
    vesselName: string;
    voyageReference: string;
    portOfDischargeCountry: string;
    portOfDischargeLocation: string;
    estimatedTimeOfArrivalDateTimeLocal: string;
    estimatedTimeOfArrivalDateTimeUTC: string;
    estimatedTimeOfArrivalTimeZone: string;
    originalEstimatedTimeOfArrivalDateTimeLocal: string;
    originalEstimatedTimeOfArrivalDateTimeUTC: string;
    originalEstimatedTimeOfArrivalTimeZone: string;
    predictiveEstimatedTimeOfArrivalDateTimeUTC: string;
    actualTimeOfArrivalDateTimeLocal: string;
    actualTimeOfArrivalDateTimeUTC: string;
    actualTimeOfArrivalTimeZone: string;
    estimatedTimeOfDischargeDateTimeLocal: string;
    estimatedTimeOfDischargeDateTimeUTC: string;
    fees: {
        demurrage: IFees;
        detention: IFees;
    };
    legDetails: Array<ILegDetails>
}
