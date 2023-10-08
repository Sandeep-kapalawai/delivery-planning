import i18n from '@/i18n';

export enum CommentContentTypeEnum {
    ETA = 'ETA',
    ATA = 'ATA',
    ETD = 'ETD',
    ATD = 'ATD',
    CarrierRelease = 'Carrier Release',
    UnloadedFromVessel = 'Unloaded From Vessel',
    CarrierEquipmentRelease = 'Carrier Equipment Release',
    GateIn = 'Gate In',
    EmptyReturn = 'Empty Return'
}

export function getCommentContentTypeDisplayName(commentContentType: CommentContentTypeEnum): string {
    switch (commentContentType) {
        case CommentContentTypeEnum.ETA:
            return i18n.t('COMMENT_CONTENT_TYPE.ETA').toString();
        case CommentContentTypeEnum.ATA:
            return i18n.t('COMMENT_CONTENT_TYPE.ATA').toString();
        case CommentContentTypeEnum.ETD:
            return i18n.t('COMMENT_CONTENT_TYPE.ETD').toString();
        case CommentContentTypeEnum.ATD:
            return i18n.t('COMMENT_CONTENT_TYPE.ATD').toString();
        case CommentContentTypeEnum.CarrierRelease:
            return i18n.t('COMMENT_CONTENT_TYPE.CARRIER_RELEASE').toString();
        case CommentContentTypeEnum.UnloadedFromVessel:
            return i18n.t('COMMENT_CONTENT_TYPE.UNLOADED_FROM_VESSEL').toString();
        case CommentContentTypeEnum.CarrierEquipmentRelease:
            return i18n.t('COMMENT_CONTENT_TYPE.CARRIER_EQUIPMENT_RELEASE').toString();
        case CommentContentTypeEnum.GateIn:
            return i18n.t('COMMENT_CONTENT_TYPE.GATE_IN').toString();
        case CommentContentTypeEnum.EmptyReturn:
            return i18n.t('COMMENT_CONTENT_TYPE.EMPTY_RETURN').toString();
        default:
            return commentContentType;
    }
}
