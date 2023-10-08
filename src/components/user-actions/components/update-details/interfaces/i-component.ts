import { IPriorityProgram, IUpdateDetails, ISelectedPriority, IAllPriorities, GasCheckRequiredOption, GasCheckResultOption } from './i-update-details';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ListViewTypeEnum, NotificationPositionEnum, NotificationComponentEnum } from '@/static';
import { IFinalDeliveryLocation, IFclListItem, ILclListItem } from '@/interfaces';

export interface IData {
    gasCheckRequiredOptions: Array<GasCheckRequiredOption> | undefined;
    gasCheckResultOptions: Array<GasCheckResultOption> | undefined;
    notificationPositionEnum: typeof NotificationPositionEnum;
    notificationComponentEnum: typeof NotificationComponentEnum;
    programDropdownOptions: Array<IPriorityProgram>;
    specialProgramDropdownOptions: Array<IPriorityProgram>;
    priorityDropdownOptions: Array<IPriorityProgram>;
    isSaving: boolean;
    updateDetailsObject: IUpdateDetails;
    allPrioritiesMap: Array<any>;
    allPrioritiesArray: Array<IPriorityProgram>;
    allPrograms: Array<IAllPriorities>;
    form: {
        program: IPriorityProgram;
        deliveryPriorityId: IPriorityProgram;
        specialProgramId: IPriorityProgram;
        pickupReference: string | '';
        pickupReferenceExpiryDateTimeLocal: string | undefined;
        emptyReturnReference: string | '';
        emptyReturnReferenceExpiryDateTimeLocal: string | undefined;
        finalDeliveryLocations: any[];
        gasCheckRequired: GasCheckRequiredOption | undefined;
        gasCheckResult: GasCheckResultOption | undefined;
        gasCheckRequestedBy: string | undefined;
        gasCheckRequestedDate: string | undefined;
    };
    loaders: {
        isDeliveryProgramsLoading: boolean;
        isSpecialProgramLoading: boolean;
        isFetchingDetails: boolean;
    };
    isRequestInProgress: boolean;
    formValidationObserver: any;
    showUpdateDetails: boolean;
    displayConfirmationModal: boolean;
    finalDeliveryLocations: Array<IFinalDeliveryLocation>;
}

export interface IMethods {
    setGcRequired(event: CustomEvent): void;
    setGcResult(event: CustomEvent): void;
    setGcRequestedBy(event: InputEvent): void;
    setGcRequestDate(event: InputEvent): void;
    initialize(): void;
    fetchDetails(): Promise<void>;
    fetchDeliveryPrograms(): Promise<void>;
    fetchSpecialPrograms(): Promise<void>;
    initializePickupandEmptyReturnFields(): void;
    initializeFinalDeliveryLocations(): void;
    initializeGasCheckFields(): void;
    clearForm(): void;
    onCancelConfirmation(): void;
    save(): Promise<void>;
    refreshPriorityDropdown(updateSelectedPriority: ISelectedPriority): void;
    refreshProgramsDropdown(): void;
    setProgram(event: CustomEvent): void;
    setSpecialProgramId(event: CustomEvent): void;
    setPriority(event: CustomEvent): void;
    setPickupReference(event: InputEvent): void;
    setEmptyReturnReference(event: InputEvent): void;
    setPickupRefExpiry(event: InputEvent): void;
    setEmptyRefExpiry(event: InputEvent): void;
    setFinalDeliveryLocations(finalDeliveryLocations: any[]): void;
    closeUpdateDetails(): void;
    addFinalDeliveryLocationField(): void;
    removeFinalDeliveryLocationField(index: number): void;
    handleLocationChange(index: number, location: any): void;
    markFormAsDirty(): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    cargoStuffingNumber: string;
    selectedItems: Array<number | string>;
    isEmptyReturnReferenceFieldsEnabled: boolean;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    selectedRows: Map<number | string, IFclListItem | ILclListItem>;
}
