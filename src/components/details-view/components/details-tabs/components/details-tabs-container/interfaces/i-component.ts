import { DetailsTabEnum } from '@/static';

export interface IData {
    currentTab: {
        index: number;
        name: DetailsTabEnum;
    };
}

export interface IMethods {
    onTabChange(event: any): void;
    setSelectedTab(tabIndex: number): void;
}

export interface IComputed {
}

export interface IProps {
    items: Array<any>;
}
