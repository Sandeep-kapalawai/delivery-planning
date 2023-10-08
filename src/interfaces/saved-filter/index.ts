export interface ISavedFilters {
    filterId: number;
    name: string;
    definition: string | null | undefined;
    isUserDefault: boolean;
    isSystemDefault: boolean;
}

export interface ISavedFilterDefinition {
    [key: string]: any;
}

export interface ISavedFilterItem {
    id: string;
    name: string;
    fields: Array<ISavedFilterDefinition>;
    isUserDefault: boolean;
    isSystemDefault: boolean;
}