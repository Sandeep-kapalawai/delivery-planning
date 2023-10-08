import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { ITransportProvider } from '@/interfaces';

export interface IData {
    isLoading: boolean;
    isListVisible: boolean;
    inputValue: string;
    providers: Array<ITransportProvider>;
}

export interface IMethods {
    fetchTransportProviders(value: string): Promise<void>;
    syncValue(): void;
    validate(): void;
    onInput(event: InputEvent): void;
    setInputValue(value: string): Promise<void>;
    setListVisible(isVisible: boolean): void;
    setListMaxHeight(): void;
    onListItemClick(provider: ITransportProvider): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isMinimumCharactersEntered: boolean;
}

export interface IProps {
    id: string;
    label: string;
    placeholder: string;
    disabled: boolean;
    required: boolean;
    skipIfEmpty: boolean;
    value: string;
    minimumCharacters: number;
    minimumCharactersMessage: string;
    noResultsMessage: string;
    listMaxHeight: string;
}
