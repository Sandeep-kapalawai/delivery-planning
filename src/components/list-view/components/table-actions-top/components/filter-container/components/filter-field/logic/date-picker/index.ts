import { IAppliedFilters, IDaysDifference, ISelectedDateRange } from '@/interfaces';
import { DATE_PICKER_RANGE_OPTIONS } from '@/static/filter';
import { format, subDays } from 'date-fns';

export function datePickerDropdownValues(): Array<string> {
    return DATE_PICKER_RANGE_OPTIONS.concat(['custom_stepper', 'custom_datepicker']);
}

export function datePickerDefaultSelectedDateRange(): ISelectedDateRange {
    const from = format(subDays(new Date(), 1), 'dd MMM yyyy').toUpperCase();
    const to = format(new Date(), 'dd MMM yyyy').toUpperCase();
    return {
        from,
        to,
    };
}

export function getDatePickerValuesFromFilterState(filterState: IAppliedFilters): {
    daysDifference: IDaysDifference;
    selectedDateRange: ISelectedDateRange;
    datePickerSelectedIndex: number;
} {
    const { daysDifference, selectedDateRange, selectedDropdownValue } = filterState;
    const datePickerSelectedIndex = datePickerDropdownValues().findIndex((item: string) => item === (selectedDropdownValue?.value).toString());
    return { daysDifference, selectedDateRange, datePickerSelectedIndex };
}
