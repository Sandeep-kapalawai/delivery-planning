import { IAppliedFilters, IDatePicker, IFilterField, IFilterSection } from '@/interfaces';
import { DATE_PICKER_DEFAULT_DAYS_DIFFERENCE, DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE } from '@/static/filter';
import { isEmpty, isFunction, cloneDeep } from 'lodash';

enum MAPPING_RULES {
    TEXT = 'TEXT',
    DROPDOWN = 'DROPDOWN',
    MULTISELECT = 'MULTISELECT',
    DATE_PICKER = 'DATE_PICKER',
    SWITCH = 'SWITCH',
    RADIO = 'RADIO',
}

const MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ field, value, appliedFilters }: { field: IFilterField; value: any; appliedFilters: IAppliedFilters }) => IAppliedFilters;
} = {
    [MAPPING_RULES.TEXT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.DROPDOWN]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.map((item: any) => `${item.label}:${item.value}`).join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.MULTISELECT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.DATE_PICKER]: ({ field, value, appliedFilters }: { field: IFilterField; value: IDatePicker; appliedFilters: IAppliedFilters }) => {
        const { selectedDateRange, daysDifference, selectedDropdownValue } = value;
        if (selectedDropdownValue.value === 'custom_datepicker') {
            appliedFilters[field.id] = [selectedDropdownValue.value, selectedDateRange.from, selectedDateRange.to].join(',');
        } else {
            appliedFilters[field.id] = [selectedDropdownValue.value, daysDifference.from, daysDifference.to].join(',');
        }
        return appliedFilters;
    },
    [MAPPING_RULES.SWITCH]: ({ field, value, appliedFilters }) => {
        if (value.toString() === 'false') {
            delete appliedFilters[field.id];
        }
        return appliedFilters;
    },
    [MAPPING_RULES.RADIO]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value;
        return appliedFilters;
    },
};

const REVERSE_MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ field, value, appliedFilters }: { field: IFilterField; value: any; appliedFilters: IAppliedFilters }) => IAppliedFilters;
} = {
    [MAPPING_RULES.DROPDOWN]: ({ field, value, appliedFilters }) => {
        const queryValues = value.split(',').map((item: any) => {
            const [label, val] = item.split(':');
            return { label, value: val };
        });
        appliedFilters[field.id] = queryValues;
        return appliedFilters;
    },
    [MAPPING_RULES.MULTISELECT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.split(',');
        return appliedFilters;
    },

    [MAPPING_RULES.RADIO]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value;
        return appliedFilters;
    },

    [MAPPING_RULES.TEXT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.split(',');
        return appliedFilters;
    },

    [MAPPING_RULES.DATE_PICKER]: ({ field, value, appliedFilters }) => {
        const [selectedDropdownValue, from, to] = value.split(',');
        if (selectedDropdownValue === 'custom_datepicker') {
            appliedFilters[field.id] = {
                selectedDateRange: {
                    from,
                    to,
                },
                daysDifference: DATE_PICKER_DEFAULT_DAYS_DIFFERENCE,
                selectedDropdownValue: {
                    label: 'Specific date range...',
                    value: selectedDropdownValue,
                },
            };
        } else {
            appliedFilters[field.id] = {
                selectedDateRange: DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE,
                daysDifference: {
                    from: parseInt(from),
                    to: parseInt(to),
                },
                selectedDropdownValue: {
                    label: selectedDropdownValue,
                    value: selectedDropdownValue,
                },
            };
        }
        return appliedFilters;
    },

    [MAPPING_RULES.SWITCH]: ({ field, value, appliedFilters }) => {
        if (value.toString() === 'false') {
            delete appliedFilters[field.id];
        }
        return appliedFilters;
    },
};

export function mapBrowserQueryParamsToAppliedFilters({
    filters,
    browserQueryParams,
}: {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    browserQueryParams: IAppliedFilters;
}): IAppliedFilters {
    let appliedFilters: IAppliedFilters = cloneDeep(browserQueryParams);
    for (const filterId in appliedFilters) {
        const field = filters?.fieldMap?.[filterId];
        if (isEmpty(field)) {
            delete appliedFilters[filterId];
            continue;
        }

        const mappingRules = field?.browserQueryMappingRules as Array<MAPPING_RULES>;
        if (isEmpty(mappingRules)) {
            continue;
        }

        mappingRules.forEach((rule) => {
            if (!isFunction(REVERSE_MAPPING_RULES_CONFIG[rule])) {
                return;
            }

            appliedFilters = REVERSE_MAPPING_RULES_CONFIG[rule]({
                field,
                value: appliedFilters[filterId],
                appliedFilters: appliedFilters,
            });
        });
    }

    return appliedFilters;
}

export function mapAppliedFiltersToBrowserQueryParams({
    filters,
    appliedFilters,
}: {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    appliedFilters: IAppliedFilters;
}): IAppliedFilters {
    let browserQueryParams: IAppliedFilters = cloneDeep(appliedFilters);

    for (const filterId in browserQueryParams) {
        const field = filters?.fieldMap?.[filterId];

        // if (isEmpty(field)) {
        //     delete browserQueryParams[filterId];
        //     continue;
        // }

        const mappingRules = field?.browserQueryMappingRules as Array<MAPPING_RULES>;
        if (isEmpty(mappingRules)) {
            continue;
        }

        mappingRules.forEach((rule) => {
            if (!isFunction(MAPPING_RULES_CONFIG[rule])) {
                return;
            }

            browserQueryParams = MAPPING_RULES_CONFIG[rule]({
                field,
                value: browserQueryParams[filterId],
                appliedFilters: browserQueryParams,
            });
        });
    }


    return browserQueryParams;
}
