import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { ISavedFilterItem } from '@/interfaces';

export interface IData {}

export interface IComputed {
    actionsItems: {label: string; actionMethod: () => void}[];
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IMethods {
    handleApplySavedFilter(savedFilters: any): void;
    handleActionItems(event: any): void;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    savedFilterItem: ISavedFilterItem;
    isSelected: boolean;
}
