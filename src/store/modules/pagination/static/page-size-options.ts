/* istanbul ignore file */
import { PageSizeOption } from '@/interfaces';

export function getMainListPageSizeOptions(): Array<PageSizeOption> {
    return getPageSizeOptions([50, 100, 150]);
}

export function getSubListPageSizeOptions(): Array<PageSizeOption> {
    return getPageSizeOptions([5, 10, 20, 25, 50, 100]);
}

function getPageSizeOptions(options: Array<number>): Array<PageSizeOption> {
    return options.map((pageSize) => ({ label: `${pageSize} rows per page`, value: pageSize }));
}
