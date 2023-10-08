export interface ICustomerConfiguration {
    customerBECode: string;
    customerConfigurationData: {
        stopOffLocationConfig: {
            isStopOffLocationEnable: boolean;
        };
        finalDeliveryLocationExclusionConfig: {
            isPrepopulateFDLExcluded: boolean;
        };
        readyToPlanConfiguration: {
            countryCode: string;
            numberOfDays: number;
            validFrom: string;
            validTo: string;
        };
    };
}
