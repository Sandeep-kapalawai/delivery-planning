import {
    ShipmentStatusEnum,
    PrimaryExecutiveStatus,
    getPrimaryExecutiveStatusDisplayName,
    SecondaryExecutiveStatus,
    getSecondaryExecutiveStatusDisplayName,
    PlanningStatusEnum,
    getPrimaryPlanningStatusDisplayName,
    UserPermissionUserGroupNameEnum,
} from '@/static';
import { IPriority, IStatus } from '@/interfaces';

import i18n from '@/i18n';

const createMap = (arr: IStatus[]): Map<string, IStatus> => {
    return new Map(arr.map((item) => [item.key, item]));
};
const createMapPriority = (arr: IPriority[]): Map<string, IPriority> => {
    return new Map(arr.map((item) => [item.key, item]));
};

export const EXECUTION_STATUSES = createMap([
    {
        key: PrimaryExecutiveStatus.IN_TRANSIT,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.IN_TRANSIT),
        id:'inTransit',
    },
    {
        key: PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT),
        id:'arrivedAtFinalPort',
    },

    {
        key: PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT),
        id:'intermodalInTransit',
    },

    {
        key: PrimaryExecutiveStatus.AT_INLAND_TERMINAL,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AT_INLAND_TERMINAL),
        id:'atInlandTerminal',
    },

    {
        key: PrimaryExecutiveStatus.IN_STORAGE,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.IN_STORAGE),
        id:'inStorage',
    },

    {
        key: PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS),
        id:'deliveryInProgress',
    },

    {
        key: PrimaryExecutiveStatus.CARGO_DELIVERED,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.CARGO_DELIVERED),
        id:'cargoDelivered',
    },

    {
        key: PrimaryExecutiveStatus.EMPTY_RETURNED,
        text: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.EMPTY_RETURNED),
        id:'emptyReturned',
    },
]);

export const SHIPMENT_STATUSES = createMap([
    { key: ShipmentStatusEnum.APPROVED, text: i18n.t('SHIPMENT_STATUS.APPROVED').toString() },
    { key: ShipmentStatusEnum.UPDATED, text: i18n.t('SHIPMENT_STATUS.UPDATED').toString() },
    { key: ShipmentStatusEnum.CANCELLED, text: i18n.t('SHIPMENT_STATUS.SI_CANCELLED').toString(), category: 'unsatisfied' },
]);

export const PLANNING_STATUSES = createMap([
    { key: PlanningStatusEnum.INITIAL, text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.INITIAL) },
    { key: PlanningStatusEnum.READY_TO_PLAN, text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.READY_TO_PLAN) },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
    },
    {
        key: PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT),
    },
    {
        key: PlanningStatusEnum.PLANNING_COMPLETED,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_COMPLETED),
    },
    {
        key: PlanningStatusEnum.RE_PLANNING_REQUIRED,
        text: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.RE_PLANNING_REQUIRED),
    },
]);

export const DEMURRAGE_DETENTION_STATUSES = createMap([
    { key: 'WithinFreeTimeDemurrage', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DEMURRAGE').toString() },
    { key: 'AtRiskDemurrage', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DEMURRAGE').toString(), category: 'intermediate' },
    { key: 'IncurringDemurrage', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DEMURRAGE').toString(), category: 'unsatisfied' },
    { key: 'WithinFreeTimeDetention', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DETENTION').toString() },
    { key: 'AtRiskDetention', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DETENTION').toString(), category: 'intermediate' },
    { key: 'IncurringDetention', text: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DETENTION').toString(), category: 'unsatisfied' },
]);

export const PRIORITY_GROUPS = createMapPriority([
    {
        key: '1',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_ONE').toString(),
        priorityEllipse: true,
        category: 'unsatisfied',
    },
    {
        key: '2',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_TWO').toString(),
        priorityEllipse: true,
        category: 'high',
    },
    {
        key: '3',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_THREE').toString(),
        priorityEllipse: true,
        category: 'intermediate',
    },
    {
        key: '4',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_FOUR').toString(),
        priorityEllipse: true,
        // category: 'satisfied', commented due to open issue with EE -ISCMLP-38115 when the col def type is colorTheme the priority color that we defined all the color codes/ categorys are not available 
        // when use it in list view 
    },
    {
        key: '5',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_FIVE').toString(),
        priorityEllipse: true,
        // category: 'satisfied', commented due to open issue with EE -ISCMLP-38115 when the col def type is colorTheme the priority color that we defined all the color codes/ categorys are not available 
        // when use it in list view 
    },
    {
        key: '6',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_SIX').toString(),
        priorityEllipse: true,
        // category: 'satisfied', commented due to open issue with EE -ISCMLP-38115 when the col def type is colorTheme the priority color that we defined all the color codes/ categorys are not available 
        // when use it in list view 
    },
    {
        key: '7',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_SEVEN').toString(),
        priorityEllipse: true,
        // category: 'satisfied', commented due to open issue with EE -ISCMLP-38115 when the col def type is colorTheme the priority color that we defined all the color codes/ categorys are not available 
        // when use it in list view 
    },
     
    {
        key: '8',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_EIGHT').toString(),
        priorityEllipse: true,
        category: 'satisfied',
    },
    {
        key: '9',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_NINE').toString(),
        priorityEllipse: true,
        category: 'intermediate',
    },
    {
        key: '10',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_TEN').toString(),
        priorityEllipse: true,
        category: 'high',
    },
    {
        key: '0',
        text: i18n.t('PRIORITY_LEVEL.PRIORITY_OTHER').toString(),
        priorityEllipse: true,
        category: 'new',
    },
]);

export const PLANNING_STATUSES_QUICK_FILTERS = [
    {
        key: PlanningStatusEnum.READY_TO_PLAN,
        text: i18n.t('PLANNING_STATUS.READY_TO_PLAN').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS,
        text: i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED,
        text: i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING,
        text: i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED,
        text: i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT,
        text: i18n.t('PLANNING_STATUS.FULL_TRANSPORT_PLAN_SENT').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    },
    {
        key: PlanningStatusEnum.RE_PLANNING_REQUIRED,
        text: i18n.t('PLANNING_STATUS.RE_PLANNING_REQUIRED').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        },
    },

    {
        key: PlanningStatusEnum.PLANNING_COMPLETED,
        text: i18n.t('PLANNING_STATUS.PLANNING_COMPLETED').toString(),
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    },
];
