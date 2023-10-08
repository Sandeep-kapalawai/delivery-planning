  
export interface IDatePicker  {
    selectedDateRange: ISelectedDateRange;
    daysDifference: IDaysDifference;
    selectedDropdownValue: ISelectedDropdownValue;
}

export interface ISelectedDateRange {
    from: string;
    to: string;
}
  
export interface IDaysDifference {
    from: number;
    to: number;
}
  
export interface ISelectedDropdownValue {
    label: string;
    value: string;
}
