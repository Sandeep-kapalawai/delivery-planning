import { getEmptyReturnReferenceValue, getEmptyReturnReferenceExpiryValue } from '.';
import { ICargoStuffingDetails } from '@/interfaces';
import { createMockCargoStuffingDetails } from '@/mocks';

describe('empty-return-leg logic', () => {
    describe('getEmptyReturnReferenceValue', () => {
        it('returns emptyReturnReference when deliveryPlan exists', () => {
            const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();

            expect(getEmptyReturnReferenceValue({ result: MOCK_CARGO_STUFFING_DETAILS })).toBe(MOCK_CARGO_STUFFING_DETAILS.emptyReturnReference);
        });

        it('returns undefined when result does not exists', () => {
            expect(getEmptyReturnReferenceValue({ result: null as any })).toBe(undefined);
        });

        it('returns undefined when deliveryPlan does not exists', () => {
            expect(getEmptyReturnReferenceValue({ result: {} as ICargoStuffingDetails })).toBe(undefined);
        });
    });

    describe('getEmptyReturnReferenceExpiryValue', () => {
        it('returns emptyReturnReferenceExpiryDateTimeLocal when deliveryPlan exists', () => {
            const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();

            expect(getEmptyReturnReferenceExpiryValue({ result: MOCK_CARGO_STUFFING_DETAILS })).toBe(
                MOCK_CARGO_STUFFING_DETAILS.emptyReturnReferenceExpiryDateTimeLocal,
            );
        });

        it('returns undefined when result does not exists', () => {
            expect(getEmptyReturnReferenceExpiryValue({ result: null as any })).toBe(undefined);
        });

        it('returns undefined when deliveryPlan does not exists', () => {
            expect(getEmptyReturnReferenceExpiryValue({ result: {} as ICargoStuffingDetails })).toBe(undefined);
        });
    });
});
