import { IFilterField, IAppliedFilters } from '@/interfaces';

export interface IData {}

export interface IMethods {
    onFilterFieldChange(event: any): void;
}

export interface IComputed {
    fieldsToRender: Array<IFilterField>;
}

export interface IProps {
    fields: Array<IFilterField>;
    filterState: IAppliedFilters;
}
