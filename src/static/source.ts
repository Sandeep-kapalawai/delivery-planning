import i18n from '@/i18n';

export enum Source {
    NETWORK = 'NETWORK',
    NON_NETWORK = 'NON_NETWORK',
}

export function getSourceDisplayName(source: Source): string {
    switch (source) {
        case Source.NETWORK:
            return i18n.t('SOURCE.NETWORK').toString();
        case Source.NON_NETWORK:
            return i18n.t('SOURCE.NON_NETWORK').toString();
        default:
            return source;
    }
}
