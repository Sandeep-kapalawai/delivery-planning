import { getplanningStatusTiles, getUpdatedStatus, mapAppliedFiltersToResolvedgroupedQuickFilters } from './index';
import { PLANNING_STATUSES_QUICK_FILTERS, EXECUTION_STATUSES } from '@/components/list-view/static';
import {
    PrimaryExecutiveStatus,
    getPrimaryExecutiveStatusDisplayName,
    SecondaryExecutiveStatus,
    getSecondaryExecutiveStatusDisplayName,
    UserPermissionUserGroupNameEnum,
} from '@/static';
import { IGroupedQuickFilters } from '@/interfaces';

import { PLANNING_STATUS_MOCK } from '@/mocks/filters';

describe('Quick Filter logic', () => {
    it('displays result for status as planningstatus', () => {
        const executionStatus = [
            {
                executionStatus: PrimaryExecutiveStatus.IN_TRANSIT,
                count: 5,
            },
            {
                executionStatus: PrimaryExecutiveStatus.VESSEL_ARRIVED,
                count: 48,
            },
        ];

        expect(getUpdatedStatus(executionStatus, 'executionStatus', EXECUTION_STATUSES)).toStrictEqual([
            {
                count: 5,
                category: "",
                executionStatus: 'IN_TRANSIT',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.IN_TRANSIT',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'ARRIVED_AT_FINAL_PORT',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.ARRIVED_AT_FINAL_PORT',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'INTERMODAL_IN_TRANSIT',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.INTERMODAL_IN_TRANSIT',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'AT_INLAND_TERMINAL',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.AT_INLAND_TERMINAL',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'IN_STORAGE',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.IN_STORAGE',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'DELIVERY_IN_PROGRESS',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.DELIVERY_IN_PROGRESS',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'CARGO_DELIVERED',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.CARGO_DELIVERED',
            },
            {
                category: '',
                count: '-',
                executionStatus: 'EMPTY_RETURNED',
                isSelected: false,
                label: 'PRIMARY_EXECUTIVE_STATUS.EMPTY_RETURNED',
            },
        ]);
    });
});

describe('mapAppliedFiltersToResolvedgroupedQuickFilters', () => {
    it('returns an empty object when passed an empty array', () => {
        const appliedQuickFilters: Array<IGroupedQuickFilters> = [];
        const resolvedFilters = mapAppliedFiltersToResolvedgroupedQuickFilters(appliedQuickFilters);
        expect(resolvedFilters).toEqual({});
    });

    it('maps applied filters to resolved applied quick filters', () => {
        const appliedQuickFilters = [
            { id: 'filter1', value: 'value1' },
            { id: 'filter2', value: 'value2' },
            { id: 'filter1', value: 'value3' },
        ];

        const resolvedFilters = mapAppliedFiltersToResolvedgroupedQuickFilters(appliedQuickFilters);

        expect(resolvedFilters).toEqual({
            filter1: 'value1, value3',
            filter2: 'value2',
        });
    });
});
