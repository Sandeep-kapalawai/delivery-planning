import { datePickerDefaultSelectedDateRange } from '.';
import { format, subDays } from 'date-fns';

describe('datePickerDefaultSelectedDateRange', () => {
  test('should return the correct default selected date range', () => {
    const expectedOutput = {
      from: format(subDays(new Date(), 1), 'dd MMM yyyy').toUpperCase(),
      to: format(new Date(), 'dd MMM yyyy').toUpperCase(),
    };
    expect(datePickerDefaultSelectedDateRange()).toEqual(expectedOutput);
  });
});