import i18n from '@/i18n';

export enum ServiceLegSpecialInstructionEnum {
    NONE = 'NONE',
    PRE_PULL = 'PRE_PULL',
    OFF_DOCK_STORAGE = 'OFF_DOCK_STORAGE',
}

export const ServiceLegSpecialInstructionDisplayName: { [key in ServiceLegSpecialInstructionEnum]: string } = {
    [ServiceLegSpecialInstructionEnum.NONE]: i18n.t('SPECIAL_INSTRUCTION.NONE').toString(),
    [ServiceLegSpecialInstructionEnum.PRE_PULL]: i18n.t('SPECIAL_INSTRUCTION.PRE_PULL').toString(),
    [ServiceLegSpecialInstructionEnum.OFF_DOCK_STORAGE]: i18n.t('SPECIAL_INSTRUCTION.OFF_DOCK_STORAGE').toString(),
};
