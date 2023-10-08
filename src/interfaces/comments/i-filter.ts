export enum CommentFilterTypeEnum {
    dropdown = 'dropdown',
}

export interface ICommentFilterField {
    id: string;
    label: string;
    type: CommentFilterTypeEnum;
    placeholderKey?: string;
    dropdownConfig?: {
        variant?: 'default' | 'vanity' | 'multiple';
        options?: Array<{ value: any; label: string }>;
    };
}

export interface ICommentAppliedFilters {
    [key: string]: any;
}

export interface ICommentFilterFieldChangeEvent {
    id: string;
    value: any;
}
