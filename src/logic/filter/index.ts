import { ISelectedDateRange } from '@/interfaces';
import { format, subDays } from 'date-fns';

export function datePickerDefaultSelectedDateRange(): ISelectedDateRange {
    const from = format(subDays(new Date(), 1), 'dd MMM yyyy').toUpperCase();
    const to = format(new Date(), 'dd MMM yyyy').toUpperCase();
    return {
        from,
        to,
    };
}