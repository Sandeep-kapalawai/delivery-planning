import i18n from '@/i18n';

export enum ServiceLegDeliveryTypeEnum {
    LIVE_UNLOAD = 'LIVE_UNLOAD',
    DROP_AND_SWAP = 'DROP_AND_SWAP',
}

export const ServiceLegDeliveryTypeDisplayName: { [key in ServiceLegDeliveryTypeEnum]: string } = {
    [ServiceLegDeliveryTypeEnum.LIVE_UNLOAD]: i18n.t('DELIVERY_TYPE.LIVE_UNLOAD').toString(),
    [ServiceLegDeliveryTypeEnum.DROP_AND_SWAP]: i18n.t('DELIVERY_TYPE.DROP_&_SWAP').toString(),
};
