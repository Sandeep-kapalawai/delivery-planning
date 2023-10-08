import i18n from '@/i18n';

export enum UpdatedViaOptionsEnum {
    EXCEL_UPLOAD = '2',
    DELIVERY_PLANNING_SCREEN = '1',
    BOTH = '0',
}

export const UpdatedViaOptionsDisplayName: { [key in UpdatedViaOptionsEnum]: string } = {
    [UpdatedViaOptionsEnum.EXCEL_UPLOAD]: i18n.t('UPDATE_VIA_OPTIONS.EXCEL_UPLOAD').toString(),
    [UpdatedViaOptionsEnum.DELIVERY_PLANNING_SCREEN]: i18n.t('UPDATE_VIA_OPTIONS.DELIVERY_PLANNING_SCREEN').toString(),
    [UpdatedViaOptionsEnum.BOTH]: i18n.t('UPDATE_VIA_OPTIONS.BOTH').toString(),
};
