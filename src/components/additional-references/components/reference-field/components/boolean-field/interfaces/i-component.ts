import { ICustomizableField } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {
    options: Array<{ label: string; value: string }>;
    vModelValue: Array<{ label: string; value: string }> | undefined;
}

export interface IMethods {
    onChange(event: CustomEvent): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IProps {
    field: ICustomizableField;
}
