export interface IDeliveryPlanIdQueryParam {
    deliveryPlanId?: string | number;
    cargoStuffingId?: string | number;
    transportDocumentId?: string | number;
}

export interface IMultipleDeliveryPlanIdQueryParam {
    deliveryPlanIds?: Array<string | number>;
    cargoStuffingIds?: Array<string | number>;
    transportDocumentIds?: Array<string | number>;
}

export interface IMultipleObjectIdQueryParam {
    deliveryPlanIds?: Array<string | number>;
    objectIds?: Array<string | number>;
}
