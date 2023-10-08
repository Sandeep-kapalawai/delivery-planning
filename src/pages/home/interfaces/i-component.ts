import { ListViewTypeEnum, NotificationComponentEnum } from '@/static';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
    isOpenedWithinHub: boolean;
    currentTab: {
        index: number;
        name: ListViewTypeEnum;
    };
}

export interface IMethods {
    onTabChange(event: { detail: number }): void;
    setSelectedTab(tabIndex: number): void;
    navigateToSelectedTab(): void;
}

export interface IComputed {
    mdsTabsComponentFit: string;
    listViewModule: string;
}

export interface IProps {
    listViewType: string;
    listViewModule: string;
}
