import { IFilterField, IAppliedFilters, FilterTypeEnum, ISelectedDateRange, IDaysDifference, ISelectedDropdownValue } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {
    FilterTypeEnum: typeof FilterTypeEnum;
    MDSFitTypeEnum: typeof MDS_COMPONENT_FIT_TYPE;
    isLoading: boolean;
    isMultiselectListVisible: boolean;
    multiselectInputValue: string;
    multiSelectDefaultMessage: string | undefined;
    datePickerSelectedIndex: number;
    isHintVisible: boolean;
    datePickerDaysDifference: IDaysDifference;
    datePickerSelectedDateRange: ISelectedDateRange;
}

export interface IMethods {
    isRadioOptionChecked(optionValue: string | boolean): boolean;
    setHintVisibility(isVisible: boolean): void;
    onTextFilterChange(event: InputEvent): void;
    onDateFilterChange(event: InputEvent): void;
    onNumberFilterChange(event: InputEvent): void;
    onDatePickerFilterChange(selectedDateRange: ISelectedDateRange, daysDifference: IDaysDifference, selectedDropdownValue: ISelectedDropdownValue): void;
    initializeDefaultValuesForDatePicker(): void;
    onDropDownFilterChange(event: CustomEvent): void;
    onSwitchFilterChange(event: CustomEvent): void;
    setMultiselectInputValue(value: string): Promise<void>;
    setMultiselectListVisible(isVisible: boolean): void;
    setMultiselectListHeight(): void;
    onMultiselectFilterInput(event: InputEvent): void;
    fetchMultiselectFilterOptions(searchText: string): Promise<void>;
    onMultiselectFilterValueAdd(value: string): void;
    onMultiselectFilterValueRemove(value: string | unknown): void;
    onPastefromClipboard(event: ClipboardEvent): void;
    onRadioOrCheckboxFilterChange(event: CustomEvent): void;
    isCheckboxOptionSelected(optionValue: string | boolean): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IProps {
    field: IFilterField;
    filterState: IAppliedFilters;
}
