import i18n from '@/i18n';

export enum LevelTypeEnum {
    BL = 'TransportDocument',
    Container = 'CargoStuffing',
}

export function getLevelTypeDisplayName(levelType: LevelTypeEnum): string {
    switch (levelType) {
        case LevelTypeEnum.BL:
            return i18n.t('LEVEL_TYPE.BL').toString();
        case LevelTypeEnum.Container:
            return i18n.t('LEVEL_TYPE.CONTAINER').toString();
        default:
            return levelType;
    }
}
