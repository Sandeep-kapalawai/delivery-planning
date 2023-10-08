import { ICargoStuffingDetails, IServiceLeg } from '@/interfaces';

export function getDeliveryPlanMinimumDate(details: { result: ICargoStuffingDetails }): Date {
    function returnLatestDate(date1: Date, date2: Date): Date {
        return date1 > date2 ? date1 : date2;
    }

    const detailsResult: ICargoStuffingDetails = details.result || {};
    const ata = detailsResult.actualTimeOfArrivalDateTimeLocal;
    const eta = detailsResult.estimatedTimeOfArrivalDateTimeLocal;
    const today = new Date();

    if (ata) {
        return returnLatestDate(new Date(ata), today);
    } else if (eta) {
        return returnLatestDate(new Date(eta), today);
    } else {
        return today;
    }
}

export function getDeliveryPlanTimeValidationError(errors: Record<string, string[]>): string {
    for (const fieldName in errors) {
        const fieldErrors: Array<string> = errors[fieldName];
        if (fieldName.includes('time') && fieldErrors.length) {
            return fieldErrors[0];
        }
    }
    return '';
}
