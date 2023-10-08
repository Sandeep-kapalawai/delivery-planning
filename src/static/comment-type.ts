import i18n from '@/i18n';

export enum CommentTypeEnum {
    Outbound = 'Outbound',
    Inbound = 'Inbound',
    System = 'System',
    User = 'Comment',
}

export function getCommentTypeDisplayName(commentType: CommentTypeEnum): string {
    switch (commentType) {
        case CommentTypeEnum.User:
            return i18n.t('COMMENT_TYPE.USER').toString();
        case CommentTypeEnum.System:
            return i18n.t('COMMENT_TYPE.SYSTEM').toString();
        case CommentTypeEnum.Inbound:
            return i18n.t('COMMENT_TYPE.INBOUND').toString();
        case CommentTypeEnum.Outbound:
            return i18n.t('COMMENT_TYPE.OUTBOUND').toString();
        default:
            return commentType;
    }
}
