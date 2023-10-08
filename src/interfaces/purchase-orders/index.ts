export interface CustomerOrderLinesResult {
    totalRecords: number;
    filteredRecords: number;
    stockKeepingUnitDataSummary?: StockKeepingUnitDataSummary;
    poskUs: CustomerOrderLineModel[];
}

export interface StockKeepingUnitDataSummary {
    packagesWithUnitType: string[];
    quantitiesWithUnitType: string[];
    grossWeightsWithUnitType: string[];
    volumesWithUnitType: string[];
}

export interface CustomerOrderLineModel {
    purchaseOrderNumber: string;
    packagesWithUnitType: string[];
    quantitiesWithUnitType: string[];
    grossWeightsWithUnitType: string[];
    volumesWithUnitType: string[];
    stockKeepingUnitData: StockKeepingUnitData[];
}

export interface StockKeepingUnitData {
    stockKeepingUnitNumber: string;
    description: string;
    packages: number;
    packagesUnitType: string;
    packagesWithUnitType: string;
    quantity: number;
    quantityUnitType: string;
    quantitiesWithUnitType: string;
    commodityCode: string;
    volumesWithUnitType: string;
    grossWeightsWithUnitType: string;
    volume: number;
    volumeUnitType: string;
    grossWeight: number;
    grossWeightUnitType: string;
}
