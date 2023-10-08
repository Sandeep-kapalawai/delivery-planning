import { IGroupedQuickFilters, IQuickFiltersList } from '@/interfaces';

export interface IState {
    groupedQuickFilters: IGroupedQuickFilters;
    quickFilters: IQuickFiltersList;
    appliedQuickFilters: Array<IGroupedQuickFilters>;
}
