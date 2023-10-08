import { isEmpty, isNull, isUndefined } from 'lodash';
import { IAppliedFilters, IFilterFieldChangeEvent } from '@/interfaces';

export function mapAppliedFiltersToFilterState(appliedFilters: IAppliedFilters): IAppliedFilters {
    const filterState: IAppliedFilters = {};
    if (isEmpty(appliedFilters)) {
        return filterState;
    }

    for (const id in appliedFilters) {
        if (Object.prototype.hasOwnProperty.call(appliedFilters, id)) {
            filterState[id] = appliedFilters[id];
        }
    }

    return filterState;
}

export function updateFieldChangeInFilterState(filterState: IAppliedFilters, filterFieldChange: IFilterFieldChangeEvent): IAppliedFilters {
    if (isEmpty(filterFieldChange.id)) {
        return filterState;
    }

    if (isNull(filterState) || isUndefined(filterState)) {
        filterState = {};
    }

    if (Array.isArray(filterFieldChange.value) && filterFieldChange.value.join() === '') {
        delete filterState[filterFieldChange.id];
        return filterState;
    }

    if (typeof(filterFieldChange.value)!=='boolean' && isEmpty(filterFieldChange.value)) {
        delete filterState[filterFieldChange.id];
    } else {
        filterState[filterFieldChange.id] = filterFieldChange.value;
    }

    return filterState;
}
