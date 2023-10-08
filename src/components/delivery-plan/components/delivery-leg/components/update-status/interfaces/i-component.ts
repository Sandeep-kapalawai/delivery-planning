
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {
    statusModalOpen: boolean;
    value:string;
}

export interface IMethods {
    closeStatusModal(): void;
    updateStatusConfirmed: () => void;
    onChangeSelectedValue(event: CustomEvent): void;
}
 export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IProps {
    deliveryOrder:string;
}