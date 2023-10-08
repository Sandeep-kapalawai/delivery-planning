import { isEmpty, isFunction, cloneDeep } from 'lodash';
import { PrimaryExecutiveStatus, SecondaryExecutiveStatus, ServiceLegStatusEnum, PlanningStatusEnum } from '@/static';
import { IFilterField, IAppliedFilters, IFilterSection, IDatePicker } from '@/interfaces';
import { dateRangeConfig } from './static';
import { format, subDays, addDays } from 'date-fns';
import { getFormattedDateInISO8601 } from 'destination/utilities';
import { EXECUTION_STATUSES } from '@/components/list-view/static';

const specialMappings: { [key: string]: string } = {
    // Status
    'departure pending': PrimaryExecutiveStatus.DEPARTURE_PENDING,
    'vessel departed': SecondaryExecutiveStatus.VESSEL_DEPARTURE,
    'vessel arrived': SecondaryExecutiveStatus.VESSEL_ARRIVAL,
    'unloaded from vessel': SecondaryExecutiveStatus.UNLOADED_FROM_VESSEL,
    'terminal ready': SecondaryExecutiveStatus.TERMINAL_READY,
    'rail departed': SecondaryExecutiveStatus.RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP,
    'rail arrived': SecondaryExecutiveStatus.RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP,
    'loaded on barge': SecondaryExecutiveStatus.LOADED_ON_BARGE,
    'barge departed': SecondaryExecutiveStatus.BARGE_DEPARTURE,
    'barge arrived': SecondaryExecutiveStatus.BARGE_ARRIVAL,
    'unloaded from barge': SecondaryExecutiveStatus.UNLOADED_FROM_BARGE,
    'gate out (full)': SecondaryExecutiveStatus.GATE_OUT,
    'departed from inland depot': SecondaryExecutiveStatus.INLAND_DEPOT_DEPARTURE,
    'departed from off dock storage': SecondaryExecutiveStatus.STORAGE_LOCATION_DEPARTURE,
    'arrival at delivery location (full)': SecondaryExecutiveStatus.ARRIVED_AT_DELIVERY_LOCATION_FULL,
    'delivery confirmed': SecondaryExecutiveStatus.DELIVERY_CONFIRMED,
    'arrived at inland depot': SecondaryExecutiveStatus.INLAND_DEPOT_ARRIVAL,
    'moved into off dock storage': SecondaryExecutiveStatus.STORAGE_LOCATION_ARRIVAL,
    'de-rigged': SecondaryExecutiveStatus.EQUIPMENT_DE_RIGGED,
    'container ready for pick-up': SecondaryExecutiveStatus.READY_FOR_PICKUP,
    'empty return': SecondaryExecutiveStatus.EMPTY_CONTAINER_RETURNED,
    // Delivery order status
    created: ServiceLegStatusEnum.CREATED,
    'carrier booked': ServiceLegStatusEnum.SENT,
    'carrier accepted': ServiceLegStatusEnum.ACCEPTED,
    'carrier rejected': ServiceLegStatusEnum.REJECTED,
    cancelled: ServiceLegStatusEnum.CANCELLED,
    updated: ServiceLegStatusEnum.UPDATED,
    // Planning status
    initial: PlanningStatusEnum.INITIAL,
    'ready to plan': PlanningStatusEnum.READY_TO_PLAN,
    'planning in progress': PlanningStatusEnum.PLANNING_IN_PROGRESS,
    'intermodal planned': PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED,
    'available for planning': PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING,
    'delivery details submitted': PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED,
    'full transport plan sent': PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT,
    're-planning required': PlanningStatusEnum.RE_PLANNING_REQUIRED,
    'planning completed': PlanningStatusEnum.PLANNING_COMPLETED,
    // Demurrage & detention status
    'within free time demurrage': 'WithinFreeTimeDemurrage',
    'incurring demurrage': 'IncurringDemurrage',
    'at risk demurrage': 'AtRiskDemurrage',
    'within free time detention': 'WithinFreeTimeDetention',
    'incurring detention': 'IncurringDetention',
    'at risk detention': 'AtRiskDetention',
    'priority (p1)': '1',
    'priority (p2)': '2',
    'priority (p3)': '3',
    'priority (p4)': '4',
    'priority (p5)': '5',
    'priority (p6)': '6',
    'priority (p7)': '7',
    'priority (p8)': '8',
    'priority (p9)': '9',
    'priority (p10)': '10',
    other: '0',
    'excludeFeeType': 'DETENTION',
    'in transit': PrimaryExecutiveStatus.IN_TRANSIT,
    'arrived at final port': PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT,
    'intermodal in transit': PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT,
    'at inland terminal' : PrimaryExecutiveStatus.AT_INLAND_TERMINAL,
    'in storage': PrimaryExecutiveStatus.IN_STORAGE,
    'delivery in progress': PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS,
    'cargo delivered': PrimaryExecutiveStatus.CARGO_DELIVERED,
    'empty returned' : PrimaryExecutiveStatus.EMPTY_RETURNED,
};

enum MAPPING_RULES {
    IGNORE = 'IGNORE',
    TEXT = 'TEXT',
    FROM_DATE = 'FROM_DATE',
    TO_DATE = 'TO_DATE',
    DROPDOWN = 'DROPDOWN',
    MULTISELECT = 'MULTISELECT',
    DATE_PICKER = 'DATE_PICKER',
    DATE = 'DATE',
    SWITCH = 'SWITCH',
}

const MAPPING_RULES_CONFIG: {
    [key in MAPPING_RULES]: ({ field, value, appliedFilters }: { field: IFilterField; value: any; appliedFilters: IAppliedFilters }) => IAppliedFilters;
} = {
    [MAPPING_RULES.IGNORE]: ({ field, value, appliedFilters }) => {
        delete appliedFilters[field.id];
        return appliedFilters;
    },
    [MAPPING_RULES.TEXT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.FROM_DATE]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = `${value}T00:00:00.000Z`;
        return appliedFilters;
    },
    [MAPPING_RULES.TO_DATE]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = `${value}T23:59:59.999Z`;
        return appliedFilters;
    },
    [MAPPING_RULES.DROPDOWN]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.map((item: any) => item.value).join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.MULTISELECT]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = value.map((item: string) => specialMappings[item.toLowerCase()] ?? item).join(',');
        return appliedFilters;
    },
    [MAPPING_RULES.DATE_PICKER]: ({ field, value, appliedFilters }: { field: IFilterField; value: IDatePicker; appliedFilters: IAppliedFilters }) => {
        const paramConfig = dateRangeConfig[field.id];
        const { selectedDateRange, daysDifference, selectedDropdownValue } = value;
        if (selectedDropdownValue.value !== 'custom_datepicker') {
            const from = format(subDays(new Date(), daysDifference.from), 'dd MMM yyyy').toUpperCase();
            const to = format(addDays(new Date(), daysDifference.to), 'dd MMM yyyy').toUpperCase();
            appliedFilters[paramConfig.bottomRangeKey] = getFormattedDateInISO8601({ date: from });
            appliedFilters[paramConfig.upperRangeKey] = getFormattedDateInISO8601({ date: to });
        } else {
            const [from, to] = Object.values(selectedDateRange);
            appliedFilters[paramConfig.bottomRangeKey] = getFormattedDateInISO8601({ date: from });
            appliedFilters[paramConfig.upperRangeKey] = getFormattedDateInISO8601({ date: to });
        }
        delete appliedFilters[field.id];
        return appliedFilters;
    },
    [MAPPING_RULES.DATE]: ({ field, value, appliedFilters }) => {
        appliedFilters[field.id] = getFormattedDateInISO8601({ date: value });
        return appliedFilters;
    },
    [MAPPING_RULES.SWITCH]: ({ field, value, appliedFilters }) => {
        if (value.toString() === 'false') {
            delete appliedFilters[field.id];
        }
        return appliedFilters;
    },
};

export function mapAppliedFiltersToResolvedAppliedFilters({
    filters,
    appliedFilters,
}: {
    filters: { filtersArray: Array<IFilterSection>; filtersMap: { [key: string]: IFilterSection }; fieldMap: { [key: string]: IFilterField } };
    appliedFilters: IAppliedFilters;
}): IAppliedFilters {
    let appliedFiltersClone: IAppliedFilters = cloneDeep(appliedFilters);
    for (const filterId in appliedFiltersClone) {
        const field = filters?.fieldMap?.[filterId];
        const mappingRules = field?.apiQueryMappingRules as Array<MAPPING_RULES>;
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
