/* istanbul ignore file */
import i18n from '@/i18n';
import { ICommentFilterField, CommentFilterTypeEnum } from '@/interfaces';
import {
    CommentTypeEnum,
    getCommentTypeDisplayName,
    CommentContentTypeEnum,
    getCommentContentTypeDisplayName,
    getLevelTypeDisplayName,
    LevelTypeEnum,
} from '@/static';

export function getFilters(): Array<ICommentFilterField> {
    return [
        {
            id: 'filter.commentTypes',
            label: i18n.t('FIELD_COMMENT_TYPE').toString(),
            type: CommentFilterTypeEnum.dropdown,
            dropdownConfig: {
                variant: 'multiple',
                options: [
                    {
                        label: getCommentTypeDisplayName(CommentTypeEnum.User),
                        value: CommentTypeEnum.User,
                    },
                    {
                        label: getCommentTypeDisplayName(CommentTypeEnum.System),
                        value: CommentTypeEnum.System,
                    },
                    {
                        label: getCommentTypeDisplayName(CommentTypeEnum.Inbound),
                        value: CommentTypeEnum.Inbound,
                    },
                    {
                        label: getCommentTypeDisplayName(CommentTypeEnum.Outbound),
                        value: CommentTypeEnum.Outbound,
                    },
                ],
            },
        },
        {
            id: 'filter.eventType',
            label: i18n.t('FIELD_EVENT_TYPE').toString(),
            type: CommentFilterTypeEnum.dropdown,
            dropdownConfig: {
                variant: 'multiple',
                options: [
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.ETA),
                        value: CommentContentTypeEnum.ETA,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.ATA),
                        value: CommentContentTypeEnum.ATA,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.ETD),
                        value: CommentContentTypeEnum.ETD,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.ATD),
                        value: CommentContentTypeEnum.ATD,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.CarrierRelease),
                        value: CommentContentTypeEnum.CarrierRelease,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.UnloadedFromVessel),
                        value: CommentContentTypeEnum.UnloadedFromVessel,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.CarrierEquipmentRelease),
                        value: CommentContentTypeEnum.CarrierEquipmentRelease,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.GateIn),
                        value: CommentContentTypeEnum.GateIn,
                    },
                    {
                        label: getCommentContentTypeDisplayName(CommentContentTypeEnum.EmptyReturn),
                        value: CommentContentTypeEnum.EmptyReturn,
                    },
                ],
            },
        },

        {
            id: 'filter.commentLevel',
            label: i18n.t('FIELD_LEVEL_TYPE').toString(),
            type: CommentFilterTypeEnum.dropdown,
            dropdownConfig: {
                variant: 'multiple',
                options: [
                    {
                        label: getLevelTypeDisplayName(LevelTypeEnum.BL),
                        value: LevelTypeEnum.BL,
                    },
                    {
                        label: getLevelTypeDisplayName(LevelTypeEnum.Container),
                        value: LevelTypeEnum.Container,
                    },
                ],
            },
        },
    ];
}
