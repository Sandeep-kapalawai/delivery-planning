import { ListViewTypeEnum, NotificationComponentEnum } from '@/static';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
}

export interface IMethods {}

export interface IComputed {
    id: number | string;
    viewType: ListViewTypeEnum;
    viewModule: string;
    viewName:string;
}

export interface IProps {
}
