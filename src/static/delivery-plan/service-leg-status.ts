import i18n from '@/i18n';

export enum ServiceLegStatusEnum {
    CREATED = 'CREATED',
    SENT = 'SENT',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    UPDATED = 'UPDATED',
}

export function getServiceLegStatusDisplayName(serviceLegStatus: ServiceLegStatusEnum): string {
    switch (serviceLegStatus) {
        case ServiceLegStatusEnum.CREATED:
            return i18n.t('DELIVERY_LEG_STATUS.CREATED').toString();
        case ServiceLegStatusEnum.SENT:
            return i18n.t('DELIVERY_LEG_STATUS.SENT').toString();
        case ServiceLegStatusEnum.ACCEPTED:
            return i18n.t('DELIVERY_LEG_STATUS.ACCEPTED').toString();
        case ServiceLegStatusEnum.REJECTED:
            return i18n.t('DELIVERY_LEG_STATUS.REJECTED').toString();
        case ServiceLegStatusEnum.CANCELLED:
            return i18n.t('DELIVERY_LEG_STATUS.CANCELLED').toString();
        case ServiceLegStatusEnum.UPDATED:
            return i18n.t('DELIVERY_LEG_STATUS.UPDATED').toString();
        default:
            return serviceLegStatus;
    }
}
