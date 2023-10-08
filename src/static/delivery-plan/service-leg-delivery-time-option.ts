import i18n from '@/i18n';

export enum ServiceLegDeliveryTimeOptionEnum {
    SPECIFIC_TIME = 'SPECIFIC_TIME',
    TIME_SLOT = 'TIME_SLOT',
}

export const ServiceLegDeliveryTimeOptionDisplayName: { [key in ServiceLegDeliveryTimeOptionEnum]: string } = {
    [ServiceLegDeliveryTimeOptionEnum.SPECIFIC_TIME]: i18n.t('DELIVERY_TIME_OPTION.SPECIFIC_TIME').toString(),
    [ServiceLegDeliveryTimeOptionEnum.TIME_SLOT]: i18n.t('DELIVERY_TIME_OPTION.TIME_SLOT').toString(),
};
