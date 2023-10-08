import { ServiceLegStatusEnum } from '@/static';

export function getColorForStatus(status: ServiceLegStatusEnum): string | null {
    switch (status) {
        case ServiceLegStatusEnum.SENT:
            return 'var(--mdt-theme-palette-primary-300)';
        case ServiceLegStatusEnum.ACCEPTED:
            return 'var(--mdt-theme-palette-feedback-success-dark)';
        case ServiceLegStatusEnum.UPDATED:
            return 'var(--mdt-theme-palette-secondary-orange-600)';
        default:
            return null;
    }
}
