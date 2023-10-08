import { ICommentAppliedFilters } from '@/interfaces';

export function mapAppliedFiltersToResolvedAppliedFilters({ appliedFilters }: { appliedFilters: ICommentAppliedFilters }): ICommentAppliedFilters {
    const resolvedAppliedFilters: ICommentAppliedFilters = {};

    for (const filterId in appliedFilters) {
        resolvedAppliedFilters[filterId] = appliedFilters[filterId].map((item: any) => item.value);
    }

    return resolvedAppliedFilters;
}
