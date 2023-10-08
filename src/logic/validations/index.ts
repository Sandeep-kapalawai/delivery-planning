/* istanbul ignore file */
import { isEmpty } from 'lodash';
import { extend } from 'vee-validate';
import { required as requiredRule } from 'vee-validate/dist/rules';
import i18n from '@/i18n';
import { ServiceLegDeliveryTimeOptionEnum } from '@/static';
import { getFormattedDateInISO8601, getFormattedDate } from 'destination/utilities';

export function initializeValidations() {
    extend('required', {
        ...requiredRule,
        message: i18n.t('MESSAGE.FIELD_REQUIRED').toString(),
    });

    /**
     * This Validation is used in date-time-field.vue
     */
    extend('dateTimeRequired', {
        ...requiredRule,
        params: ['date', 'time'],
        validate(value, params: any) {
            const { date, time }: { date: string; time: string } = params;
            const required = !isEmpty(date) || !isEmpty(time);
            const valid = required ? !isEmpty(value) : true;

            return {
                valid,
                data: {
                    required,
                },
            };
        },
        message: i18n.t('MESSAGE.FIELD_REQUIRED').toString(),
    });

    /**
     * This Validation is used in delivery-leg-delivery-section.vue and empty-return-leg.vue
     */
    extend('deliveryDateTimeRequired', {
        ...requiredRule,
        params: ['date', 'timeOption', 'fromTime', 'toTime'],
        validate(value, params: any) {
            const { date, timeOption, fromTime, toTime }: { date: string; timeOption: ServiceLegDeliveryTimeOptionEnum; fromTime: string; toTime: string } =
                params;
            const required = !isEmpty(date) || !isEmpty(fromTime) || (timeOption === ServiceLegDeliveryTimeOptionEnum.TIME_SLOT ? !isEmpty(toTime) : false);
            const valid = required ? !isEmpty(value) : true;

            return {
                valid,
                data: {
                    required,
                },
            };
        },
        message: i18n.t('MESSAGE.FIELD_REQUIRED').toString(),
    });

    extend('minimumDate', {
        params: ['disabled', 'date'],
        validate(value, params: any) {
            const { disabled, date }: { disabled: boolean; date: string } = params;
            if (disabled) {
                return true;
            }

            const formattedDate = getFormattedDateInISO8601({ date });
            const formattedValue = getFormattedDateInISO8601({ date: value });
            const required = !isEmpty(formattedDate) || !isEmpty(formattedValue);
            const valid = new Date(formattedValue) >= new Date(formattedDate);
            return {
                valid,
                data: {
                    required,
                },
            };
        },
        message: (field, params: any) => {
            const { date }: { date: string } = params;
            const formattedDate = getFormattedDate({ date });
            return `${i18n.t('MESSAGE.MIN_DATE_VALIDATION_MESSAGE', { date: formattedDate }).toString()}`;
        },
    });

    extend('uniquePickUpAndDeliveryLocation', {
        params: ['pickUpLocation', 'deliveryLocation'],
        validate(value, params: any) {
            const { pickUpLocation, deliveryLocation }: { pickUpLocation: string; deliveryLocation: string } = params;
            if (isEmpty(pickUpLocation) || isEmpty(deliveryLocation)) {
                return true;
            }

            return pickUpLocation !== deliveryLocation;
        },
        message: i18n.t('MESSAGE.PICKUP_LOCATION_DELIVERY_LOCATION_MESSAGE').toString(),
    });
}
