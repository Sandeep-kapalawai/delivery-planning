import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { ILocationFullAddress } from '@/interfaces';

export interface IData {
    isLoading: boolean;
    isListVisible: boolean;
    inputValue: string;
    locations: Array<ILocationFullAddress>;
}

export interface IMethods {
    fetchLocations(value: string): Promise<void>;
    syncValue(): void;
    validate(): void;
    onInput(event: InputEvent): void;
    setInputValue(value: string): Promise<void>;
    setListVisible(isVisible: boolean): void;
    setListMaxHeight(): void;
    onListItemClick(location: ILocationFullAddress): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isMinimumCharactersEntered: boolean;
}

export interface IProps {
    id: string;
    label: string;
    hideLabel: boolean;
    placeholder: string;
    disabled: boolean;
    required: boolean;
    rules: any;
    skipIfEmpty: boolean;
    value: string;
    minimumCharacters: number;
    minimumCharactersMessage: string;
    noResultsMessage: string;
    listMaxHeight: string;
}
