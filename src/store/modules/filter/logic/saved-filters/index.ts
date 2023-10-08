import { ISavedFilterItem, ISavedFilters } from '@/interfaces';

export const getFormattedSavedFilters = ({ result }: { result: ISavedFilters[] }): ISavedFilterItem[] => {
    const savedList: ISavedFilterItem[] = [];
    for (const savedFilter of result) {
        if (savedFilter) {
            const filterDefinition = savedFilter.definition ? JSON.parse(savedFilter.definition) : {};
            const filterDefinitionFields = Object.entries(filterDefinition).map(([field, value]) => ({ [field]: value }));
            const filterItem = {
                id: String(savedFilter.filterId),
                name: savedFilter.name,
                fields: filterDefinitionFields,
                isUserDefault: savedFilter.isUserDefault,
                isSystemDefault: savedFilter.isSystemDefault,
            };
            savedList.push(filterItem);
        }
    }

    return savedList;
};

export const getDefaultFilter = ({ savedFilters }: { savedFilters: ISavedFilterItem[] }): ISavedFilterItem | undefined => {
    let defaultFilter = savedFilters.find((filter) => filter.isUserDefault);
    if (!defaultFilter) {
        defaultFilter = savedFilters.find((filter) => filter.isSystemDefault);
    }
    return defaultFilter;
};
