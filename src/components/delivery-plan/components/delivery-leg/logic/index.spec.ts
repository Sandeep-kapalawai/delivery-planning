import { getColorForStatus } from '.';
import { ServiceLegStatusEnum } from '@/static';

describe('delivery-leg logic', () => {
    describe('getColorForStatus', () => {
        it.each([
            [ServiceLegStatusEnum.CREATED, null],
            [ServiceLegStatusEnum.SENT, 'var(--mdt-theme-palette-primary-300)'],
            [ServiceLegStatusEnum.ACCEPTED, 'var(--mdt-theme-palette-feedback-success-dark)'],
            [ServiceLegStatusEnum.REJECTED, null],
            [ServiceLegStatusEnum.CANCELLED, null],
            [ServiceLegStatusEnum.UPDATED, 'var(--mdt-theme-palette-secondary-orange-600)'],
        ])('for status %s, getColorForStatus returns %s', (status: ServiceLegStatusEnum, color: string | null) => {
            expect(getColorForStatus(status)).toBe(color);
        });
    });
});
