import { PageSizeOption } from '@/interfaces';

export interface IData {}

export interface IMethods {
    onUpdateCurrentPage(page: number): void;
    onUpdatePageSize(limit: number): void;
}

export interface IComputed {
    tableId: string;
    pageSizeOptions: Array<PageSizeOption>;
    currentPage: number;
    pageSize: number;
    totalRows: number;
}

export interface IProps {
    listViewModule: string;
}
