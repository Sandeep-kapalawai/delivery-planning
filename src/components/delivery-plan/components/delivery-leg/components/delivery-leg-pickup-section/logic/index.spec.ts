import { getLastFreeDateValue, getPickupReferenceExpiryValue, getPickupReferenceValue } from '.';
import { ICargoStuffingDetails } from '@/interfaces';
import { ServicePlanFeeTypeEnum } from '@/static';
import { createMockCargoStuffingDetails, createMockServicePlan } from '@/mocks';

describe('delivery-leg-pickup-section logic', () => {
    describe('getLastFreeDateValue', () => {
        it('returns empty string when response does not exists', () => {
            expect(getLastFreeDateValue({ response: null as any })).toBe('');
        });

        it('returns empty string when lastFreeDateTimeLocal does not exists', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan({
                lastFreeDateTimeLocal: '',
            });

            expect(getLastFreeDateValue({ response: MOCK_SERVICE_PLAN })).toBe('');
        });

        it('returns last free days count when feeType is Combined and isUnloadedFromVessel is false', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan({
                lastFreeDateTimeLocal: '2023-01-01T00:00:00Z',
                feeType: ServicePlanFeeTypeEnum.Combined,
                isUnloadedFromVessel: false,
                countLastFreeDate: 1,
            });

            expect(getLastFreeDateValue({ response: MOCK_SERVICE_PLAN })).toBe('Combined - 1 day(s) after UV');
        });

        it('returns last free date when feeType is Combined and isUnloadedFromVessel is true', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan({
                lastFreeDateTimeLocal: '2023-01-01T00:00:00Z',
                feeType: ServicePlanFeeTypeEnum.Combined,
                isUnloadedFromVessel: true,
            });

            expect(getLastFreeDateValue({ response: MOCK_SERVICE_PLAN })).toBe('Combined - 2023-01-01T00:00:00Z');
        });

        it('returns last free date when feeType is not Combined', () => {
            const MOCK_SERVICE_PLAN = createMockServicePlan({
                lastFreeDateTimeLocal: '2023-01-01T00:00:00Z',
                feeType: ServicePlanFeeTypeEnum.Storage,
            });

            expect(getLastFreeDateValue({ response: MOCK_SERVICE_PLAN })).toBe('2023-01-01T00:00:00Z');
        });
    });

    describe('getPickupReferenceExpiryValue', () => {
        it('returns pickupReferenceExpiryDateTimeLocal when deliveryPlan exists', () => {
            const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();

            expect(getPickupReferenceExpiryValue({ result: MOCK_CARGO_STUFFING_DETAILS })).toBe(MOCK_CARGO_STUFFING_DETAILS.pickupReferenceExpiryDateTimeLocal);
        });

        it('returns undefined when response does not exists', () => {
            expect(getPickupReferenceExpiryValue({ result: null as any })).toBe(undefined);
        });

        it('returns undefined when deliveryPlan does not exists', () => {
            expect(getPickupReferenceExpiryValue({ result: {} as ICargoStuffingDetails })).toBe(undefined);
        });
    });

    describe('getPickupReferenceValue', () => {
        it('returns pickupReference when deliveryPlan exists', () => {
            const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();

            expect(getPickupReferenceValue({ result: MOCK_CARGO_STUFFING_DETAILS })).toBe(MOCK_CARGO_STUFFING_DETAILS.pickupReference);
        });

        it('returns undefined when response does not exists', () => {
            expect(getPickupReferenceValue({ result: null as any })).toBe(undefined);
        });

        it('returns undefined when deliveryPlan does not exists', () => {
            expect(getPickupReferenceValue({ result: {} as ICargoStuffingDetails })).toBe(undefined);
        });
    });
});
