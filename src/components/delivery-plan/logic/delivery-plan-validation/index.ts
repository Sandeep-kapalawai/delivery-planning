import { isEmpty } from 'lodash';
import i18n from '@/i18n';
import { IDeliveryPlanValidationParams, IDeliveryPlanValidationResult } from '../../interfaces';

/**
 * @description Function to validate delivery plan before save/send plan operation.
 */
export function validateDeliveryPlan(params: IDeliveryPlanValidationParams): IDeliveryPlanValidationResult {
    for (const ruleName in VALIDATION_RULES) {
        if (params.isSavePlanOperation && !VALIDATION_RULES[ruleName].executeForSave) {
            continue;
        }

        const result: IDeliveryPlanValidationResult = VALIDATION_RULES[ruleName].validate(params);
        if (!result.isValid) {
            return result;
        }
    }

    return { isValid: true };
}

/**
 * @description Validation rules to execute during save/send plan operation. Add validation rules in the sequence you want it to be executed.
 */
const VALIDATION_RULES: {
    [rule: string]: { executeForSave: boolean; validate: (params: IDeliveryPlanValidationParams) => IDeliveryPlanValidationResult };
} = {
    STOP_OFF_LOCATION_SHOULD_NOT_EQUAL_FINAL_DELIVERY_LOCATION: {
        executeForSave: true,
        validate: ({ details, deliveryPlan, lastActiveDeliveryLeg }: IDeliveryPlanValidationParams): IDeliveryPlanValidationResult => {
            const { customerFinalPlaceOfDeliveryFacilityCode } = details;
            const { isStopOffLocation } = deliveryPlan;
            if (
                !isStopOffLocation ||
                isEmpty(customerFinalPlaceOfDeliveryFacilityCode) ||
                isEmpty(lastActiveDeliveryLeg?.deliveryData?.deliveryAddress?.beCode)
            ) {
                return { isValid: true };
            }

            const isInvalid: boolean = customerFinalPlaceOfDeliveryFacilityCode
                .split(',')
                .some((location) => location === lastActiveDeliveryLeg.deliveryData.deliveryAddress.beCode);
            return {
                isValid: !isInvalid,
                error: isInvalid ? i18n.t('MESSAGE.STOP_OFF_LOCATION_SHOULD_NOT_EQUAL_FINAL_DELIVERY_LOCATION_ERROR').toString() : undefined,
            };
        },
    },
};
