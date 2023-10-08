import i18n from '@/i18n';

export enum DeliveryPlanTypeEnum {
    SINGLE_DROP = 'SINGLE_DROP',
    MULTI_DROP = 'MULTI_DROP',
}

export const DeliveryPlanTypeDisplayName: { [key in DeliveryPlanTypeEnum]: string } = {
    [DeliveryPlanTypeEnum.SINGLE_DROP]: i18n.t('DELIVERY_PLAN_TYPE.SINGLE_DROP').toString(),
    [DeliveryPlanTypeEnum.MULTI_DROP]: i18n.t('DELIVERY_PLAN_TYPE.MULTI_DROP').toString(),
};
