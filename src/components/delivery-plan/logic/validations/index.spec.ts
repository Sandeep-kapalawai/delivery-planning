import { ICargoStuffingDetails } from '@/interfaces';
import { getDeliveryPlanMinimumDate, getDeliveryPlanTimeValidationError } from '.';

function getDateStringWithOffsetFromToday(offset: number = 0): string {
    const today = new Date();
    today.setDate(today.getDate() + offset);
    return today.toLocaleDateString();
}

describe('delivery-plan validations logic', () => {
    describe('getDeliveryPlanMinimumDate', () => {
        it.each([
            ['ata && ata > today = ata', getDateStringWithOffsetFromToday(10), getDateStringWithOffsetFromToday(5), getDateStringWithOffsetFromToday(10)],
            ['ata && ata < today = today', getDateStringWithOffsetFromToday(-5), getDateStringWithOffsetFromToday(-10), getDateStringWithOffsetFromToday()],
            ['!ata && eta && eta > today = eta', undefined, getDateStringWithOffsetFromToday(5), getDateStringWithOffsetFromToday(5)],
            ['!ata && eta && eta < today = today', undefined, getDateStringWithOffsetFromToday(-10), getDateStringWithOffsetFromToday()],
            ['!ata && !eta = today', undefined, undefined, getDateStringWithOffsetFromToday()],
        ])(
            `%s :: ata: %s, eta: %s, today: ${getDateStringWithOffsetFromToday()} :: output: %s`,
            (_: string, ata: string | undefined, eta: string | undefined, expectedOutput: string) => {
                const actualOutput = getDeliveryPlanMinimumDate({
                    result: {
                        actualTimeOfArrivalDateTimeLocal: ata,
                        estimatedTimeOfArrivalDateTimeLocal: eta,
                    } as ICargoStuffingDetails,
                });

                expect(actualOutput.toLocaleDateString()).toEqual(new Date(expectedOutput).toLocaleDateString());
            },
        );
    });

    describe('getDeliveryPlanTimeValidationError', () => {
        it('returns validation error message for delivery time field', () => {
            const validationError = getDeliveryPlanTimeValidationError({
                test_date_field: ['test_date_field error message'],
                test_from_time_field: ['test_from_time_field error message'],
                test_to_time_field: ['test_to_time_field error message'],
            });

            expect(validationError).toEqual('test_from_time_field error message');
        });
    });
});
