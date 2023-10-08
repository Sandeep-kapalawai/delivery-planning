        [QuickFilterActionEnum.INITIALIZE_APPLIED_QUICK_FILTERS]: async ({ state, commit, dispatch, rootGetters }, { listViewTypeId }: { listViewTypeId: string }) => {
          
            const resolvedAppliedFilters = rootGetters[`${listViewTypeId}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_RESOLVED_APPLIED_FILTERS}`];
             dispatch(QuickFilterActionEnum.FETCH_PLANNING_STATUS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_EXECUTION_STATUS, {listViewTypeId});
             dispatch(QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS, {listViewTypeId});
            await commit(QuickFilterMutationEnum.SET_SELECTED_QUICK_FILTERS, { index:0, type:'executionStatusGroups'});
            await commit(QuickFilterMutationEnum.SET_APPLIED_QUICK_FILTERS);
           const groupedQuickFilters = mapAppliedFiltersToResolvedgroupedQuickFilters(resolvedAppliedFilters);
           await dispatch(QuickFilterMutationEnum.SET_GROUPED_QUICK_FILTERS, groupedQuickFilters);     
        },
