import { getFormattedDate } from 'destination/utilities';
import { ICargoStuffingDetails } from '@/interfaces';

export function getEmptyReturnReferenceValue(details: { result: ICargoStuffingDetails }) {
    const detailsResult: ICargoStuffingDetails = details.result || {};
    return detailsResult.emptyReturnReference;
}
export function getEmptyReturnReferenceExpiryValue(details: { result: ICargoStuffingDetails }) {
    const detailsResult: ICargoStuffingDetails = details.result || {};
    return getFormattedDate({ date: detailsResult.emptyReturnReferenceExpiryDateTimeLocal });
}
