import {
    IAppliedFilters,
    IExecutionStatusGroup,
    IGroupedQuickFilters,
    ILastFreeDaysGroup,
    IPlanningStatusGroup,
    IPriorityLevelsStatusGroup,
    IQuickFilters,
    toolPanelPosition,
} from '@/interfaces';
import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, NotificationComponentEnum, NotificationPositionEnum } from '@/static';

export interface IData {
    toggleQuickFilterPanel: boolean;
    currentTab: {
        index: number;
        name?: string;
    };
    NotificationComponentEnum: typeof NotificationComponentEnum;
    NotificationPositionEnum: typeof NotificationPositionEnum;
    isErrorAtPlanTiles: boolean;
    isErrorAtMonitorTiles: boolean;
}

export interface IMethods {
    fetchPlanTiles(): void;
    fetchMonitorTiles(): void;
    onTabChange(event: { detail: number }): void;
    setSelectedTab(tabIndex: number): void;
    displayQuickFilterPanel(): void;
    handleSelectedFilters(
        ele: IPlanningStatusGroup | IExecutionStatusGroup | ILastFreeDaysGroup | IPriorityLevelsStatusGroup,
        index: number,
        type: string,
    ): void;

    clearAllQuickFilters(): void;
    initializeAppliedFQuickilters(): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    planningStatus: { errorMessage: string; isFetching: boolean; result: Array<IPlanningStatusGroup> };
    executionStatus: { errorMessage: string; isFetching: boolean; result: Array<IExecutionStatusGroup> };
    lastFreeDaysGroups: { errorMessage: string; isFetching: boolean; result: Array<ILastFreeDaysGroup> };
    priorityLevelGroups: { errorMessage: string; isFetching: boolean; result: Array<IPriorityLevelsStatusGroup> };
    quickFiltersLabel: string;
    getAppliedQuickFilters: Array<IGroupedQuickFilters>;
    toolPanelPosition: toolPanelPosition;
   
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    viewModule: string;
}
