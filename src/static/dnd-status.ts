import i18n from '@/i18n';

export enum DemurrageAndDetentionStatusEnum {
    WITHIN_FREE_TIME = 'WITHIN_FREE_TIME',
    AT_RISK = 'AT_RISK',
    INCURRING = 'INCURRING',
    INCURRED = 'INCURRED',
    NOT_INCURRED = 'NOT_INCURRED',
}

export function getDemurrageAndDetentionStatusName(status: DemurrageAndDetentionStatusEnum, numberOfDays: number): string | null {
    switch (status) {
        case DemurrageAndDetentionStatusEnum.WITHIN_FREE_TIME:
            return i18n.t('DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME', { number: numberOfDays }).toString();
        case DemurrageAndDetentionStatusEnum.AT_RISK:
            return i18n.t('DEMURRAGE_AND_DETENTION_STATUS.AT_RISK', { number: numberOfDays }).toString();
        case DemurrageAndDetentionStatusEnum.INCURRING:
            return i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRING', { number: numberOfDays }).toString();
        case DemurrageAndDetentionStatusEnum.INCURRED:
            return i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRED', { number: numberOfDays }).toString();
        case DemurrageAndDetentionStatusEnum.NOT_INCURRED:
            return i18n.t('DEMURRAGE_AND_DETENTION_STATUS.NOT_INCURRED').toString();
        default:
            return null;
    }
}
