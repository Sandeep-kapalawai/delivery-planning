export interface IDeliveryOrders {
    header: IDeliveryOrderHeaders;
    items: Array<ITransportplanItems>;
    invalidItems: Array<any>;
    notChangedItems: Array<any>;
    missingLCLFinalDeliveryLocationModel?: Array<string>;
    missingFinalDeliveryLocations?: Array<string>;
}

export interface IDeliveryOrderHeaders {
    cargoStuffingNumber: string;
    carrierCode: string;
    carrierName: string;
    consigneeBECode: string;
    consigneeName: string;
    equipmentNumber: string;
}
export interface ITransportplanItems {
    cancelledOrders: Array<IDeliveryPlan>;
    containersCount: number;
    newOrders: Array<IDeliveryPlan>;
    revisedOrders: Array<IDeliveryPlan>;
    transportProviderCode: string;
    transportProviderName: string;
}

export interface IDeliveryPlan {
    cargoStuffingId: number;
    cargoStuffingNumber: string;
    containerSize: string;
    deliveryLocationBeCode: string;
    hasDangerousGoods?: boolean;
    hasGarmentOnHanger?: boolean;
    deliveryOrderNumber: string | null;
    isReefer?: boolean;
    pickupLocationBeCode: string;
    transportModeType: string;
    plannedDeliveryDateTimes: Array<IPlannedDeliveryDateTimes>;
    reasonCodeId?: number;
    comment?: string;
    deliveryDateTimes?: [] | Array<IMutipleCellValue>;
    transportModes?: any | Array<IMutipleCellValue>;
}

export interface IInvalidItems {
    cargoStuffingId: number;
    cargoStuffingNumber: string;
    equipmentNumber: string;
}

export interface IMissingFDL {
    cargoStuffingNumber: string;
    equipmentNumber: string;
    missingFinalDeliveryLocations: string;
}

export interface IReasonCodes {
    reasonCodeId: number;
    reasonCodeName: string;
    label?: string;
    value?: string;
}

export interface IPlannedDeliveryDateTimes {
    dateTime: boolean;
    timeZone: boolean;
}

export interface IGetOrderList {
    cargoStuffingId: number;
    cargoStuffingNumber: string;
    deliveryOrderNumber: string | null;
    hasDangerousGoods: boolean;
    hasGarmentOnHanger: boolean;
    isReefer: boolean;
    containerSize: string;
    pickupLocationBeCode: string;
    deliveryLocationBeCode: string;
    transportModeType: string;
    plannedDeliveryDateTimes: string;
    version: number;
    id: number;
    reasonCodes: {
        selectedValue: number;
        dropdownOptions: Array<IReasonCodes>;
    };
    reasonCodeId: Number;
    comment: String;
}

export interface ISendDOPayload {
    CargoStuffings: Array<IDeliveryPlan>;
}

export interface IMutipleCellValue {
    value: string;
}
