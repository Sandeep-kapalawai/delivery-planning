import { IFilterSection, IAppliedFilters, ISavedFilterItem, toolPanelPosition } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ListViewTypeEnum, NotificationPositionEnum, NotificationComponentEnum } from '@/static';

export interface IData {
    isToolsPanelOpen: boolean;
    showSavedFilters: boolean;
    filterState: IAppliedFilters;
    filterToolsPanelTitle: string;
    filterToolsPanelPrimayButtonLabel: string | null;
    filterToolsPanelSecondaryButtonLabel: string | null;
    NotificationComponentEnum: typeof NotificationComponentEnum;
    NotificationPositionEnum: typeof NotificationPositionEnum;
}
export interface IMethods {
    initializeFilters(): void;
    initializeAppliedFilters(): void;
    openFilterToolsPanel(): void;
    openSavedFiltersToolsPanel(): void;
    closeFilterToolsPanel(): void;
    handleRemoveSingleTag(updatedInput: any, removedTagValue: any): void;
    onFilterFieldChange(section: IFilterSection, event: any): void;
    onFilterApply(): void;
    onFilterClear(): void;
    handleSaveFilter(event: ISavedFilterItem): void;
    handleDeleteSavedFilterFromId(event: ISavedFilterItem): void;
    handleApplySavedFilters(event: ISavedFilterItem): void;
    handleDefaultFilter(event: ISavedFilterItem, isSelectedAsDefault: boolean): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    filterSections: Array<IFilterSection>;
    appliedFilters: IAppliedFilters;
    appliedSavedFilters: ISavedFilterItem;
    appliedFiltersForSCMFilter: Array<{ name: string; label: string; value: any; sectionName: string }>;
    countAppliedFilters: number;
    allFiltersButtonLabel: string;
    savedFilters: IAppliedFilters;
    saveFilterSectionErrorMessages: Array<any>;
    isFilterLoading: boolean;
    viewModule: string;
    toolPanelPosition: toolPanelPosition;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
}
