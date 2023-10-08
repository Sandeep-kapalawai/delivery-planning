import i18n from '@/i18n';

export enum ServicePlanTransportModeEnum {
    ROAD = 'ROAD',
    RAIL = 'RAIL',
    BARGE = 'BARGE',
}

export const ServicePlanTransportModeDisplayName: { [key in ServicePlanTransportModeEnum]: string } = {
    [ServicePlanTransportModeEnum.ROAD]: i18n.t('SERVICE_MODE.ROAD').toString(),
    [ServicePlanTransportModeEnum.RAIL]: i18n.t('SERVICE_MODE.RAIL').toString(),
    [ServicePlanTransportModeEnum.BARGE]: i18n.t('SERVICE_MODE.BARGE').toString(),
};


export function getTransportModeIcons(mode: ServicePlanTransportModeEnum): string {
    switch (mode) {
        case ServicePlanTransportModeEnum.ROAD:
            return 'truck-side';
        case ServicePlanTransportModeEnum.RAIL:
            return 'train-front';
        case ServicePlanTransportModeEnum.BARGE:
            return 'vessel-front';
        default:
            return 'truck-side';
    }
}
