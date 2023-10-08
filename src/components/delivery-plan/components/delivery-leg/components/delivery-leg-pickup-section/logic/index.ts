import { getFormattedDate } from 'destination/utilities';
import { ICargoStuffingDetails, IServicePlan } from '@/interfaces';
import { ServicePlanFeeTypeEnum } from '@/static';

export function getLastFreeDateValue(deliveryPlan: { response: IServicePlan }) {
    const deliveryPlanResponse: IServicePlan = deliveryPlan.response || {};
    if (!deliveryPlanResponse.lastFreeDateTimeLocal) {
        return '';
    }

    if (deliveryPlanResponse.feeType == ServicePlanFeeTypeEnum.Combined) {
        const result = 'Combined - ';
        if (deliveryPlanResponse.isUnloadedFromVessel) {
            return `${result}${getFormattedDate({ date: deliveryPlanResponse.lastFreeDateTimeLocal })}`;
        } else {
            return `${result}${deliveryPlanResponse.countLastFreeDate} day(s) after UV`;
        }
    } else {
        return getFormattedDate({ date: deliveryPlanResponse.lastFreeDateTimeLocal });
    }
}

export function getPickupReferenceExpiryValue(details: { result: ICargoStuffingDetails }) {
    const detailsResult: ICargoStuffingDetails = details.result || {};
    return getFormattedDate({ date: detailsResult.pickupReferenceExpiryDateTimeLocal });
}

export function getPickupReferenceValue(details: { result: ICargoStuffingDetails }) {
    const detailsResult: ICargoStuffingDetails = details.result || {};
    return detailsResult.pickupReference;
}
