import { PlanningStatusEnum, ShipmentStatusEnum } from '@/static';
import { ILegDetails } from '../leg-details';

export interface ILclList {
    result: Array<ILclListItem>;
    resultTotalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface ILclListItem {
    deliveryPlanId: string;
    actualTimeOfArrivalDateTimeUTC: string;
    actualTimeOfArrivalDateTimeLocal: string;
    actualTimeOfArrivalTimeZone: string;
    cargoStuffingId: number;
    cargoStuffingNumber: string;
    cargoStuffingPriorityDisplayName?: string;
    cargoStuffingPriorityLevel?: number;
    cargoStuffingType: string;
    estimatedTimeOfArrivalDateTimeUTC: string;
    estimatedTimeOfArrivalDateTimeLocal: string;
    estimatedTimeOfArrivalTimeZone: string;
    expiryDateTimeUTC: string;
    expiryDateTimeLocal: string;
    expiryTimeZone: string;
    hasDangerousGoods: boolean;
    hasGarmentOnHanger: boolean;
    isReefer: boolean;
    shipmentMessageSource: string;
    shipmentStatus: ShipmentStatusEnum;
    lastFreeDateTimeUTC: string;
    lastFreeDateTimeLocal?: string;
    lastFreeTimeZone?: string;
    maerskCarrierCode: string;
    maerskCarrierName: string;
    originalEstimatedTimeOfArrivalDateTimeUTC: string;
    originalEstimatedTimeOfArrivalDateTimeLocal: string;
    originalEstimatedTimeOfArrivalTimeZone: string;
    pickUpReference: string;
    planningStatus: PlanningStatusEnum;
    portOfDischargeCountry: string;
    portOfDischargeLocation: string;
    predictiveEstimatedTimeOfArrivalDateTimeUTC: string;
    predictiveEstimatedTimeOfArrivalDateTimeLocal: string;
    predictiveEstimatedTimeOfArrivalTimeZone: string;
    purchaseOrdersCount: number;
    transportDocumentNumber: string;
    transportDocumentId: number;
    vesselName: string;
    voyageReference: string;
    cargoStuffingFeeType?: string;
    countLastFreeDate?: number;
    contractStartEvent?: string;
    cargoVolume: number;
    volumeUnit: string;
    availableToPickupDateTimeUTC: string;
    availableToPickupDateTimeLocal: string;
    availableToPickupDateTimeZone: string;
    availableLocationCity: string;
    availableLocationCountry: string;
    deliveryLocationCity: string;
    deliveryLocationCountry: string;
    cargoStuffingPriorityProgramName: string;
    consigneeName: string;
    primaryExecutiveStatus: string;
    secondaryExecutiveStatus: string;
    demurrageAndDetentionStatus: string;
    containerLastUserUpdatedDateTime: string;
    containerLastUserUpdated: string;
    containerIsLastUpdatedByExcel: string;
    warehouseDeliveryReference: string;
    consigneeBECode: string;
    legDetails: Array<ILegDetails>
}
