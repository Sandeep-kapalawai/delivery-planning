import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {}

export interface IProps {
    open: boolean;
    loading: boolean;
    heading: string;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
    size: string;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IMethods {}
