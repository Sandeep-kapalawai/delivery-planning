export const dateRangeConfig: { [key: string]: { bottomRangeKey: string; upperRangeKey: string } } = {
    estimatedTimeOfArrivalDateRange: {
        bottomRangeKey: 'estimatedTimeOfArrivalFromDateTimeLocal',
        upperRangeKey: 'estimatedTimeOfArrivalToDateTimeLocal',
    },
    actualTimeOfArrivalDateRange: {
        bottomRangeKey: 'actualTimeOfArrivalFromDateTimeLocal',
        upperRangeKey: 'actualTimeOfArrivalToDateTimeLocal',
    },
    estimatedTimeOfDischargeDateRange: {
        bottomRangeKey: 'estimatedTimeOfDischargeFromDateTimeLocal',
        upperRangeKey: 'estimatedTimeOfDischargeToDateTimeLocal',
    },
    deliveryToDateDateRange: {
        bottomRangeKey: 'deliveryFromDateTimeLocal',
        upperRangeKey: 'deliveryToDateTimeLocal',
    },
};