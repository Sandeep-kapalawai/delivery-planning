import { PageSizeOption } from '@/interfaces';

export interface IState {
    pageSizeOptions: Array<PageSizeOption>;
    limit: number;
    page: number;
}
