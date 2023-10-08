import { ICommentAppliedFilters } from '@/interfaces';
import { mapAppliedFiltersToResolvedAppliedFilters } from '.';

describe('resolved-applied-filters-mapping logic', () => {
    describe('mapAppliedFiltersToResolvedAppliedFilters', () => {
        it('return resolved applied filters', () => {
            const appliedFilters: ICommentAppliedFilters = {
                FILTER_FIELD: [{ value: 'FILTER_FIELD_VALUE' }],
            };
            const expectedOutput: ICommentAppliedFilters = {
                FILTER_FIELD: ['FILTER_FIELD_VALUE'],
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
