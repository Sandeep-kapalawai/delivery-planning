import { Route } from 'vue-router';
import { IPageHeaderTab } from '.';
import { NotificationComponentEnum } from '@/static';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
    title: string;
    pageHeaderTabs: Array<IPageHeaderTab>;
}

export interface IMethods {
    onPageHeaderTabClick: ({ tab }: { tab: IPageHeaderTab }) => void;
    setActivePageHeaderTab: ({ currentRoute }: { currentRoute: Route }) => void;
}

export interface IComputed {}

export interface IProps {}
