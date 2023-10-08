import { UserPermissionUserGroupNameEnum } from '@/static';
import { CancelTokenSource } from 'axios';

export enum FilterTypeEnum {
    text = 'text',
    date = 'date',
    number = 'number',
    dropdown = 'dropdown',
    multiselect = 'multiselect',
    datePicker = 'datePicker',
    switch = 'switch',
    radio = 'radio',
    checkbox = 'checkbox',
}

export type IFilterSection = ISideFilterSection;

export interface ISideFilterSection {
    id: string;
    title: string;
    slotReference: string;
    expanded: boolean;
    indicator: number;
    fields: IFilterField[];
    isQuickFilter?: false;
}

export interface IFilterField {
    id: string;
    label: string;
    type: FilterTypeEnum;
    hint?: string;
    icon?: string;
    iconPosition?: string;
    isClearButtonVisible?: boolean;
    placeholder?: string;
    dropdown?: IFilterFieldDropdownConfig;
    multiselect?: IFilterFieldMultiselectConfig;
    dateOptionsSelectedIndex?: number;
    radioOptions?: IFilterFieldRadioConfig;
    checkboxOptions?: IFilterFieldCheckboxConfig;
    scmAppliedFiltersMappingRules?: Array<string>;
    apiQueryMappingRules?: Array<string>;
    browserQueryMappingRules?: Array<string>;
    savedFilterMappingRules?: Array<string>;
    hidden?: boolean;
}

export interface IFilterFieldDropdownConfig {
    options?: Array<{ value: any; label: string }>;
}

export interface IFilterFieldMultiselectConfig {
    listMaxHeight?: string;
    fetchOptions?: {
        isFetching?: boolean;
        callback?: ({ id, searchText }: { id: string; searchText: string }) => Promise<any>;
        cancelToken: CancelTokenSource | null;
    };
    options?: Array<{ value: string; secondary?: string }>;
    emptyOptionsMessage?: string;
    minCharacterMessage?: string;
    minCharacter?: number;
}

export interface IFilterFieldRadioConfig {
    options: Array<{ label: string; value: string | boolean }>;
}

export interface IFilterFieldCheckboxConfig {
    options: Array<{ label: string; value: string | boolean }>;
}

export interface IAppliedFilters {
    [key: string]: any | Array<any>;
}

export interface IFilterFieldChangeEvent {
    id: string;
    value: any;
}

// Quick Filters
export interface IQuickFilters {
    isFetching: boolean;
    errorMessage: string;
    result: Array<any>;
}
export interface IQuickFiltersList {
    planningStatus: IQuickFilters;
    executionStatusGroups: IQuickFilters;
    priorityLevelGroups: IQuickFilters;
    lastFreeDaysGroups: IQuickFilters;
}
export interface IExecutionStatusGroup {
    category: string;
    count: number;
    executionStatus: string;
    label: string;
    isSelected?: boolean;
}

export interface IPlanningStatusGroup {
    category: string;
    count: number;
    planningStatus: string;
    label: string;
    isSelected?: boolean;
}

export interface IPriorityLevelsStatusGroup {
    category: string;
    count: number;
    priorityLevel: string;
    label: string;
    isSelected?: boolean;
}

export interface ILastFreeDaysGroup {
    category: string;
    count: number;
    lastFreeDaysRange: string;
    label: string;
    isSelected?: boolean;
}

export interface IPlanningStatus {
    count: number;
    planningStatus: string;
}

export interface IExecutionStatus {
    count: number;
    executionStatus: string;
}
export interface ILastFreeDays {
    count: number;
    lastFreeDaysRange: string;
}

export interface IGroupedQuickFilters {
    id: string;
    value: string;
}

export interface IPlanningStatusQuickFilters {
    text: string;
    key: string;
    allowAccessForUserGroups: {
        userGroupNames: Array<UserPermissionUserGroupNameEnum>;
        validateForInternalUsers: boolean;
    };
}
export interface toolPanelPosition {
    x: number;
    y: number;
}
