import { datePickerDefaultSelectedDateRange, getDatePickerValuesFromFilterState } from '.';
import { format, subDays } from 'date-fns';

describe('getDatePickerValuesFromFilterState', () => {
    it('returns the expected date range', () => {
        const result = datePickerDefaultSelectedDateRange();

        expect(result.from).toMatch(/^\d{2} [A-Z]{3} \d{4}$/);
        expect(result.to).toMatch(/^\d{2} [A-Z]{3} \d{4}$/);
        expect(result.to).toBe(format(new Date(), 'dd MMM yyyy').toUpperCase());
        expect(result.from).toBe(format(subDays(new Date(), 1), 'dd MMM yyyy').toUpperCase());
    });

    it('returns the expected values out of filterState', () => {
        const filterState = {
            daysDifference: { from: 14, to: 14 },
            selectedDateRange: { from: '01 APR 2022', to: '07 APR 2022' },
            selectedDropdownValue: { value: '14' },
        };

        const result = getDatePickerValuesFromFilterState(filterState);

        expect(result.daysDifference).toStrictEqual({ from: 14, to: 14 });
        expect(result.selectedDateRange).toStrictEqual({ from: '01 APR 2022', to: '07 APR 2022' });
        expect(result.datePickerSelectedIndex).toStrictEqual(1); // the index of the 'last_week' option in the dropdown
    });
});
