import { IFilterField, IAppliedFilters, IFilterSection, ISavedFilterItem, ISavedFilters } from '@/interfaces';

export interface IState {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    appliedFilters: IAppliedFilters;
    resolvedAppliedFilters: IAppliedFilters;
    savedFilters: {isFetching: boolean, list: Array<ISavedFilterItem>, errorMessage: Array<any>, appliedFilter: ISavedFilterItem | any};
    isInitialized: boolean;
}
