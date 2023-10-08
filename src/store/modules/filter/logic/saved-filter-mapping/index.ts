import { IAppliedFilters, IFilterField, IFilterSection } from '@/interfaces';
import { isEmpty, isFunction, cloneDeep } from 'lodash';

enum MAPPING_RULES {
    TEXT = 'TEXT',
    DROPDOWN = 'DROPDOWN',
    MULTISELECT = 'MULTISELECT',
    DATE_PICKER = 'DATE_PICKER',
    SWITCH = 'SWITCH',
}

const MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ field, value, appliedFilters }: { field: IFilterField; value: any; appliedFilters: IAppliedFilters }) => IAppliedFilters;
} = {
    [MAPPING_RULES.TEXT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.DROPDOWN]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value;
        return appliedFilters;
    },
    [MAPPING_RULES.MULTISELECT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.DATE_PICKER]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value;
        return appliedFilters;
    },
    [MAPPING_RULES.SWITCH]: ({ field, value, appliedFilters }) => {
        if (value.toString() === 'false') {
            delete appliedFilters[field.id];
        }
        return appliedFilters;
    },
};

const REVERSE_MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ field, value, appliedFilters }: { field: IFilterField; value: any; appliedFilters: IAppliedFilters }) => IAppliedFilters;
} = {
    [MAPPING_RULES.DROPDOWN]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] =value;
        return appliedFilters;
    },
    [MAPPING_RULES.MULTISELECT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.split(',');
        return appliedFilters;
    },

    [MAPPING_RULES.TEXT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.split(',');
        return appliedFilters;
    },

    [MAPPING_RULES.DATE_PICKER]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value;
        return appliedFilters;
    },

    [MAPPING_RULES.SWITCH]: ({ field, value, appliedFilters }) => {
        if (value.toString() === 'false') {
            delete appliedFilters[field.id];
        }
        return appliedFilters;
    },
};

export function mapAppliedFiltersToSaveFiltersPayload({
    filters,
    appliedFilters,
}: {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    appliedFilters: IAppliedFilters;
}): IAppliedFilters {
    let appliedFiltersClone: IAppliedFilters = cloneDeep(appliedFilters);
    for (const filterId in appliedFiltersClone) {
        const field = filters?.fieldMap?.[filterId];
        if (isEmpty(field)) {
            delete appliedFiltersClone[filterId];
            continue;
        }

        const mappingRules = field?.savedFilterMappingRules as Array<MAPPING_RULES>;
        if (isEmpty(mappingRules)) {
            continue;
        }

        mappingRules.forEach((rule) => {
            if (!isFunction(MAPPING_RULES_CONFIG[rule])) {
                return;
            }

            appliedFiltersClone = MAPPING_RULES_CONFIG[rule]({
                field,
                value: appliedFilters[filterId],
                appliedFilters: appliedFiltersClone,
            });
        });
    }
    return appliedFiltersClone;
}

export function mapSavedFiltersToAppliedFilters({
    filters,
    savedFilters,
}: {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    savedFilters: IAppliedFilters;
}): IAppliedFilters {
    let appliedFilters: IAppliedFilters = cloneDeep(savedFilters);
    for (const filterId in appliedFilters) {
        const field = filters?.fieldMap?.[filterId];
        if (isEmpty(field)) {
            delete appliedFilters[filterId];
            continue;
        }

        const mappingRules = field?.savedFilterMappingRules as Array<MAPPING_RULES>;
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
