import i18n from '@/i18n';

export enum CustomsStatusEnum {
    UpdateEntryType = 'UPDATE_ENTRY_TYPE',
    NotDue = 'NOT_DUE',
    UpdateCustomsBroker = 'UPDATE_CUSTOMS_BROKER',
    InitiateCustomsProcess = 'INITIATE_CUSTOMS_PROCESS',
    InitiateInTransitProcess = 'INITIATE_INTRANSIT_PROCESS',
    CustomsRequestSent = 'CUSTOMS_REQUEST_SENT',
    InProgress = 'IN_PROGRESS',
    SubmittedToCustoms = 'SUBMITTED_TO_CUSTOMS',
    CustomsHold = 'ON_HOLD',
    CustomsCleared = 'CUSTOMS_CLEARED',
}

export function getCustomsStatusDisplayName(customsStatusEnum: CustomsStatusEnum): string {
    switch (customsStatusEnum) {
        case CustomsStatusEnum.UpdateEntryType:
            return i18n.t('CUSTOMS_STATUS.UPDATE_ENTRY_TYPE').toString();
        case CustomsStatusEnum.NotDue:
            return i18n.t('CUSTOMS_STATUS.NOT_DUE').toString();
        case CustomsStatusEnum.UpdateCustomsBroker:
            return i18n.t('CUSTOMS_STATUS.UPDATE_CUSTOMS_BROKER').toString();
        case CustomsStatusEnum.InitiateCustomsProcess:
            return i18n.t('CUSTOMS_STATUS.INITIATE_CUSTOMS_PROCESS').toString();
        case CustomsStatusEnum.InitiateInTransitProcess:
            return i18n.t('CUSTOMS_STATUS.INITIATE_IN_TRANSIT_PROCESS').toString();
        case CustomsStatusEnum.CustomsRequestSent:
            return i18n.t('CUSTOMS_STATUS.CUSTOMS_REQUEST_SENT').toString();
        case CustomsStatusEnum.InProgress:
            return i18n.t('CUSTOMS_STATUS.IN_PROGRESS').toString();
        case CustomsStatusEnum.SubmittedToCustoms:
            return i18n.t('CUSTOMS_STATUS.SUBMITTED_TO_CUSTOMS').toString();
        case CustomsStatusEnum.CustomsHold:
            return i18n.t('CUSTOMS_STATUS.CUSTOMS_HOLD').toString();
        case CustomsStatusEnum.CustomsCleared:
            return i18n.t('CUSTOMS_STATUS.CUSTOMS_CLEARED').toString();
        default:
            return customsStatusEnum;
    }
}
