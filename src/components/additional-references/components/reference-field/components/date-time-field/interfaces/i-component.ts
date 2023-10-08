import { ICustomizableField } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, CustomizableFieldFormatEnum } from '@/static';

export interface IData {
    CustomizableFieldFormatEnum: typeof CustomizableFieldFormatEnum;
    vModelDateValue: string | null;
    vModelTimeValue: string | null;
}

export interface IMethods {
    getValidationObserverError: (errors: Record<string, string[]>) => string;
    onDateInput(event: InputEvent): void;
    onTimeInput(time: string): void;
    validateDateTimeFields: () => void;
}
export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IProps {
    field: ICustomizableField;
}
