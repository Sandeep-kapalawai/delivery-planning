import { IDaysDifference, ISelectedDateRange } from '@/interfaces';
import { datePickerDefaultSelectedDateRange } from '@/logic/filter';

export const DATE_PICKER_RANGE_OPTIONS: Array<string> = ['7', '14'];
export const DATE_PICKER_DEFAULT_DAYS_DIFFERENCE: IDaysDifference = { from: 0, to: 7 };
export const DATE_PICKER_DEFAULT_SELECTED_INDEX: number = -1;
export const DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE: ISelectedDateRange = datePickerDefaultSelectedDateRange();
