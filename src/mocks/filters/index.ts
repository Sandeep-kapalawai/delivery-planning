export const PLANNING_STATUS_MOCK = [
    { category: '', count: '-', isSelected: false, label: 'PLANNING_STATUS.READY_TO_PLAN', planningStatus: 'READY_TO_PLAN' },
    {  category: '', count: 1, isSelected: false, label: 'PLANNING_STATUS.PLANNING_IN_PROGRESS', planningStatus: 'PLANNING_IN_PROGRESS' },
    {
        category: '',
        count: '-',
        isSelected: false,
        label: 'PLANNING_STATUS.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED',
        planningStatus: 'PLANNING_IN_PROGRESS_INTERMODAL_PLANNED',
    },
    {
        category: '',
        count: '-',
        isSelected: false,
        label: 'PLANNING_STATUS.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING',
        planningStatus: 'PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING',
    },
    {
        category: '',
        count: '-',
        isSelected: false,
        label: 'PLANNING_STATUS.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED',
        planningStatus: 'PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED',
    },
    { category: '', count: '-', isSelected: false, label: 'PLANNING_STATUS.FULL_TRANSPORT_PLAN_SENT', planningStatus: 'FULL_TRANSPORT_PLAN_SENT' },
    { category: '', count: '-', isSelected: false, label: 'PLANNING_STATUS.RE_PLANNING_REQUIRED', planningStatus: 'RE_PLANNING_REQUIRED' },
    { category: '', count: '-', isSelected: false, label: 'PLANNING_STATUS.PLANNING_COMPLETED', planningStatus: 'PLANNING_COMPLETED' },
];

export const EXECUTION_STATUSES_MOCK = [
    { count: '-', executionStatus: 'VESSEL_DEPARTED', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.IN_TRANSIT' },
    { count: '5', executionStatus: 'INTERMODAL_IN_TRANSIT', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.ARRIVED_AT_FINAL_PORT' },
    { count: '4', executionStatus: 'UNLOADED_FROM_VESSEL', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.ARRIVED_AT_FINAL_PORT' },
    { count: '-', executionStatus: 'RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.INTERMODAL_IN_PROGRESS' },
    { count: '-', executionStatus: 'GATE_OUT', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.DELIVERY_IN_PROGRESS' },
    { count: '-', executionStatus: 'RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.AT_INLAND_TERMINAL' },

    {
        count: '-',
        executionStatus: 'ARRIVED_AT_DELIVERY_LOCATION_FULL, DELIVERY_CONFIRMED',
        isSelected: false,
        label: 'PRIMARY_EXECUTIVE_STATUS.AVAILABLE_FOR_DELIVERY',
    },
    { count: '-', executionStatus: 'EMPTY_CONTAINER_RETURNED', isSelected: false, label: 'SECONDARY_EXECUTIVE_STATUS.EMPTY_CONTAINER_RETURNED' },
];
export const EXECUTION_STATUSES_MOCK_RESULT = [
    { category: '', count: '-', executionStatus: 'IN_TRANSIT', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.IN_TRANSIT' },
    { category: '', count: '-', executionStatus: 'ARRIVED_AT_FINAL_PORT', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.ARRIVED_AT_FINAL_PORT' },
    { category: '', count: '5', executionStatus: 'INTERMODAL_IN_TRANSIT', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.INTERMODAL_IN_TRANSIT' },
    { category: '', count: '-', executionStatus: 'AT_INLAND_TERMINAL', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.AT_INLAND_TERMINAL' },
    { category: '', count: '-', executionStatus: 'IN_STORAGE', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.IN_STORAGE' },
    { category: '', count: '-', executionStatus: 'DELIVERY_IN_PROGRESS', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.DELIVERY_IN_PROGRESS' },
    { category: '', count: '-', executionStatus: 'CARGO_DELIVERED', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.CARGO_DELIVERED' },
    { category: '', count: '-', executionStatus: 'EMPTY_RETURNED', isSelected: false, label: 'PRIMARY_EXECUTIVE_STATUS.EMPTY_RETURNED' },
];
export const LAST_FREE_DAYS_GROUPS_MOCK = [
    {
        category: '',
        count: 1,
        label: 'DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DEMURRAGE',
        lastFreeDaysRange: 'WithinFreeTimeDemurrage',
        isSelected: false,
    },
    { category: 'intermediate', count: 6, label: 'DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DEMURRAGE', lastFreeDaysRange: 'AtRiskDemurrage', isSelected: false },
    {
        category: 'unsatisfied',
        count: 385,
        label: 'DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DEMURRAGE',
        lastFreeDaysRange: 'IncurringDemurrage',
        isSelected: false,
    },
    {
        category: '',
        count: 0,
        label: 'DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DETENTION',
        lastFreeDaysRange: 'WithinFreeTimeDetention',
        isSelected: false,
    },
    { category: 'intermediate', count: 0, label: 'DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DETENTION', lastFreeDaysRange: 'AtRiskDetention', isSelected: false },
    {
        category: 'unsatisfied',
        count: 4,
        label: 'DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DETENTION',
        lastFreeDaysRange: 'IncurringDetention',
        isSelected: false,
    },
];
export const PRIORITY_LEVEL_GROUPS_MOCK = [
    { category: 'unsatisfied', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_ONE', priorityLevel: '1' },
    { category: 'high', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_TWO', priorityLevel: '2' },
    { category: 'intermediate', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_THREE', priorityLevel: '3' },
    { category: '', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_FOUR', priorityLevel: '4' },
    { category: '', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_FIVE', priorityLevel: '5' },
    { category: '', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_SIX', priorityLevel: '6' },
    { category: '', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_SEVEN', priorityLevel: '7' },
    { category: 'satisfied', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_EIGHT', priorityLevel: '8' },
    { category: 'intermediate', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_NINE', priorityLevel: '9' },
    { category: 'high', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_TEN', priorityLevel: '10' },
    { category: 'new', count: '-', isSelected: false, label: 'PRIORITY_LEVEL.PRIORITY_OTHER', priorityLevel: '0' },
];

export const MOCK_APPLIED_QUICK_FILTERS = {
    planningStatus: 'ReadyToPlan',
    executionStatus: 'EmptyReturn',
    priorityGroups: 1,
};

export const MOCK_GROUPED_QUICK_FILTERS = { planningStatus: 'ReadyToPlan, Initial', executionStatus: 'EmptyReturn', priorityGroups: '1' };
