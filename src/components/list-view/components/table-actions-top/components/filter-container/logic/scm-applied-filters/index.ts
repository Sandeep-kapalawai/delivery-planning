import { isEmpty, isFunction } from 'lodash';
import { IFilterField, IAppliedFilters, IFilterSection, IDatePicker } from '@/interfaces';
import { format, subDays, addDays } from 'date-fns';
import i18n from '@/i18n';

enum MAPPING_RULES {
    DROPDOWN = 'DROPDOWN',
    DATE_PICKER = 'DATE_PICKER',
    SWITCH = 'SWITCH',
    DAYS_TILL_ETA = 'DAYS_TILL_ETA',
    RADIO = 'RADIO',
}

const MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ value }: { value: any }) => any;
} = {
    [MAPPING_RULES.DROPDOWN]: ({ value }) => {
        return value.map((item: any) => item.label);
    },
    [MAPPING_RULES.RADIO]: ({ value }) => {
        return value.map((item: any) => item.value);
    },
    [MAPPING_RULES.DATE_PICKER]: ({ value }: { value: IDatePicker }) => {
        const { selectedDateRange, daysDifference, selectedDropdownValue } = value;
        if (selectedDropdownValue.value !== 'custom_datepicker') {
            const from = format(subDays(new Date(), daysDifference.from), 'dd MMM yyyy').toUpperCase();
            const to = format(addDays(new Date(), daysDifference.to), 'dd MMM yyyy').toUpperCase();
            return `${from} - ${to}`;
        } else {
            const [from, to] = Object.values(selectedDateRange);
            return `${from} - ${to}`;
        }
    },
    [MAPPING_RULES.SWITCH]: ({ value }) => {
        if (value.toString() === 'true') {
            return i18n.t('YES');
        }
    },
    [MAPPING_RULES.DAYS_TILL_ETA]: ({ value }) => {
        return `${value} days`;
    },
};

export function mapAppliedFiltersToSCMAppliedFilters({
    filterSections,
    appliedFilters,
}: {
    filterSections: Array<IFilterSection>;
    appliedFilters: IAppliedFilters;
}): Array<{ name: string; label: string; value: any; sectionName: string }> {
    return filterSections.reduce((acc: Array<{ name: string; label: string; value: any; sectionName: string }>, curr: IFilterSection) => {
        curr.fields.forEach((field: IFilterField) => {
            let filterValue = appliedFilters[field.id];
            if (!filterValue) {
                return;
            }

            const mappingRules = field?.scmAppliedFiltersMappingRules as Array<MAPPING_RULES>;
            if (!isEmpty(mappingRules)) {
                mappingRules.forEach((rule) => {
                    if (!isFunction(MAPPING_RULES_CONFIG[rule])) {
                        return;
                    }

                    filterValue = MAPPING_RULES_CONFIG[rule]({ value: filterValue });
                });
            }

            acc.push({ sectionName: curr.title, name: field.id, label: field.label, value: filterValue });
        });

        return acc;
    }, []);
}
