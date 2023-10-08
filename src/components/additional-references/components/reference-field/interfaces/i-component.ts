import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

export interface IData {
    CustomizableFieldFormatEnum: typeof CustomizableFieldFormatEnum;
}

export interface IMethods {
    onChange: (value: any) => void;
}
export interface IComputed {}

export interface IProps {
    field: ICustomizableField;
}
