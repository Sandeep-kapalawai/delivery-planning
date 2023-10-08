import { IFclListItem, ILclListItem } from '@/interfaces';

export interface IData {}
export interface IMethods {}

export interface IComputed {
    transportlegDetails: Array<{
        title: string;
        headerIcon: string;
        details: Array<{ label: string; value: string }>;
    }>;
}

export interface IProps {
    selectedRow: IFclListItem |  ILclListItem;
}
