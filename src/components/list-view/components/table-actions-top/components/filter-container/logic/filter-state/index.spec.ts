import { mapAppliedFiltersToFilterState, updateFieldChangeInFilterState } from '.';
import { IAppliedFilters, IFilterFieldChangeEvent } from '@/interfaces';

describe('filter logic', () => {
    describe('mapAppliedFiltersToFilterState', () => {
        it('returns empty filter state when applied filters is empty', () => {
            const appliedFilters: IAppliedFilters = {};
            const expectedOutput: IAppliedFilters = {};

            const actualOutput = mapAppliedFiltersToFilterState(appliedFilters);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns mapped filter state when applied filters is not empty', () => {
            const appliedFilters: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };

            const actualOutput = mapAppliedFiltersToFilterState(appliedFilters);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });

    describe('updateFieldChangeInFilterState', () => {
        it('returns filter state when id is empty in filter field change', () => {
            const filterState: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };
            const filterFieldChange: IFilterFieldChangeEvent = { id: '', value: '' };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns filter state updated with filter field change when filter state is null', () => {
            const filterState: IAppliedFilters = null as any;
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'CHANGED_FILTER_FIELD_ID', value: 'CHANGED_FILTER_FIELD_VALUE' };
            const expectedOutput: IAppliedFilters = { CHANGED_FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns filter state updated with filter field change when filter state is undefined', () => {
            const filterState: IAppliedFilters = undefined as any;
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'CHANGED_FILTER_FIELD_ID', value: 'CHANGED_FILTER_FIELD_VALUE' };
            const expectedOutput: IAppliedFilters = { CHANGED_FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('removes filter field fron filter state when value is empty in filter field change', () => {
            const filterState: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE', CHANGED_FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'CHANGED_FILTER_FIELD_ID', value: '' };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('removes filter field fron filter state when value is empty string array in filter field change', () => {
            const filterState: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE', CHANGED_FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'CHANGED_FILTER_FIELD_ID', value: [''] };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('adds filter field in filter state when value is not empty in filter field change', () => {
            const filterState: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'CHANGED_FILTER_FIELD_ID', value: 'CHANGED_FILTER_FIELD_VALUE' };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE', CHANGED_FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('updates filter field in filter state when value is not empty in filter field change', () => {
            const filterState: IAppliedFilters = { FILTER_FIELD_ID: 'FILTER_FIELD_VALUE' };
            const filterFieldChange: IFilterFieldChangeEvent = { id: 'FILTER_FIELD_ID', value: 'CHANGED_FILTER_FIELD_VALUE' };
            const expectedOutput: IAppliedFilters = { FILTER_FIELD_ID: 'CHANGED_FILTER_FIELD_VALUE' };

            const actualOutput = updateFieldChangeInFilterState(filterState, filterFieldChange);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
