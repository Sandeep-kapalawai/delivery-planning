/* istanbul ignore file */
import i18n from '@/i18n';
import {
    ListViewTypeEnum,
    PrimaryExecutiveStatus,
    getPrimaryExecutiveStatusDisplayName,
    SecondaryExecutiveStatus,
    getSecondaryExecutiveStatusDisplayName,
    PlanningStatusEnum,
    getPrimaryPlanningStatusDisplayName,
    ServiceLegStatusEnum,
    getServiceLegStatusDisplayName,
    ServicePlanTransportModeEnum,
    ServicePlanTransportModeDisplayName,
    UpdatedViaOptionsEnum,
    UpdatedViaOptionsDisplayName,
    GasCheckResultsEnum,
    getSecondaryPlanningStatusDisplayName,
} from '@/static';
import { IFilterField, FilterTypeEnum, IFilterSection } from '@/interfaces';
import { listViewTypeSpecificAction } from '@/logic';
import { Store } from 'vuex';

import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterActionEnum } from '@/store/modules/filter/static';

interface IGetFiltersParameters {
    listViewType: ListViewTypeEnum;
    $store: Store<any>;
}

export function getFilters({ listViewType, $store }: IGetFiltersParameters): Array<IFilterSection> {
    return listViewTypeSpecificAction<Array<IFilterSection>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                FilterSection.REFERENCES({ listViewType, $store }),
                FilterSection.GENERAL({ listViewType, $store }),
                FilterSection.LOCATIONS({ listViewType, $store }),
                FilterSection.DATES({ listViewType, $store }),
                FilterSection.STATUS(),
                FilterSection.UPDATEDBY({ listViewType, $store }),
                FilterSection.PRIORITY_GROUP(),
            ];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [];
        },
    });
}

class FilterSection {
    static GENERAL({ listViewType, $store }: IGetFiltersParameters): IFilterSection {
        return {
            id: 'General',
            title: i18n.t('FILTERS.GENERAL').toString(),
            slotReference: 'General',
            expanded: false,
            fields: [
                FilterField.CONSIGNEE({ listViewType, $store }),
                FilterField.VESSEL({ listViewType, $store }),
                FilterField.VOYAGE(),
                FilterField.CARRIER({ listViewType, $store }),
                FilterField.TRANSPORT_PROVIDER({ listViewType, $store }),
                FilterField.TRANSPORT_MODE(),
            ],
            indicator: 0,
        };
    }

    static REFERENCES({ listViewType, $store }: IGetFiltersParameters): IFilterSection {
        return {
            id: 'References',
            title: i18n.t('FILTERS.REFERENCES').toString(),
            slotReference: 'References',
            expanded: true,
            fields: [
                FilterField.EQUIPMENT_NUMBERS(),
                FilterField.BL_NUMBERS(),
                FilterField.PURCHASE_ORDER_NUMBERS(),
                FilterField.SKU_NUMBERS(),
                FilterField.DELIVERY_ORDER(),
                FilterField.DELIVERY_REFERENCE(),
                FilterField.SPECIAL_PROGRAM(),
            ],
            indicator: 0,
        };
    }

    static LOCATIONS({ listViewType, $store }: IGetFiltersParameters): IFilterSection {
        return {
            id: 'Locations',
            title: i18n.t('FILTERS.LOCATIONS').toString(),
            slotReference: 'Locations',
            expanded: false,
            fields: [
                FilterField.PICKUP_LOCATION({ listViewType, $store }),
                FilterField.DELIVERY_LOCATION({ listViewType, $store }),
                FilterField.PORT_OF_DISCHARGE({ listViewType, $store }),
                FilterField.COUNTRY_OF_DESTINATION({ listViewType, $store }),
                FilterField.COUNTRY_OF_ORIGIN({ listViewType, $store }),
                FilterField.PORT_OF_LOADING({ listViewType, $store }),
            ],
            indicator: 0,
        };
    }

    static DATES({ listViewType, $store }: IGetFiltersParameters): IFilterSection {
        return {
            id: 'Dates',
            title: i18n.t('FILTERS.DATES').toString(),
            slotReference: 'Dates',
            expanded: false,
            fields: [
                FilterField.ESTIMATED_TIME_OF_ARRIVAL(),
                FilterField.ACTUAL_TIME_OF_ARRIVAL(),
                FilterField.ESTIMATED_TIME_OF_DISCHARGE(),
                FilterField.DELIVERY_DATE(),
                FilterField.LAST_UPDATED_DATE(),
                FilterField.IS_UPDATED_USING_EXCEL(),
                FilterField.DAYS_TILL_ESTIMATED_TIME_OF_ARRIVAL(),
            ],
            indicator: 0,
        };
    }

    static STATUS(): IFilterSection {
        return {
            id: 'status',
            title: i18n.t('FILTERS.STATUS').toString(),
            slotReference: 'status',
            expanded: false,
            fields: [
                FilterField.SHIPMENT_STATUS(),
                FilterField.SHIPMENT_CANCELLED(),
                FilterField.PLANNING_STATUS(),
                FilterField.DELIVERY_ORDER_STATUS(),
                FilterField.DEMURRAGE_AND_DETENTION_STATUS(),
                FilterField.EXCLUDE_FEE_TYPE(),
                FilterField.GAS_CHECK_REQUIRED(),
                FilterField.GAS_CHECK_RESULT(),
            ],
            indicator: 0,
        };
    }

    static UPDATEDBY({ listViewType, $store }: IGetFiltersParameters): IFilterSection {
        return {
            id: 'UpdatedBy',
            title: i18n.t('FILTERS.UPDATED_BY').toString(),
            slotReference: 'UpdatedBy',
            expanded: false,
            fields: [FilterField.USER({ listViewType, $store }), FilterField.UPDATED_VIA()],
            indicator: 0,
        };
    }

    static PRIORITY_GROUP(): IFilterSection {
        return {
            id: 'Priority',
            title: i18n.t('FIELD.PRIORITY').toString(),
            slotReference: 'Priority',
            expanded: false,
            fields: [FilterField.PRIORITIES()],
            indicator: 0,
        };
    }
}

class FilterField {
    static CONSIGNEE({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'ConsigneesBeCode',
            label: i18n.t('FILTERS.CONSIGNEE').toString(),
            type: FilterTypeEnum.multiselect,
            placeholder: i18n.t('PLACEHOLDERS.CONSIGNEE').toString(),
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_CONSIGNEE_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_CONSIGNEE_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static VESSEL({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'VesselName',
            placeholder: i18n.t('PLACEHOLDERS.VESSEL').toString(),
            label: i18n.t('FILTERS.VESSEL').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static VOYAGE(): IFilterField {
        return {
            id: 'voyageReference',
            placeholder: i18n.t('PLACEHOLDERS.VOYAGE').toString(),
            label: i18n.t('FILTERS.VOYAGE').toString(),
            hint: i18n.t('FILTERS.COMMA_DELIMITED_HINT').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static CARRIER({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'MaerskCarrierCode',
            placeholder: i18n.t('PLACEHOLDERS.CARRIER').toString(),
            label: i18n.t('FILTERS.CARRIER').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static TRANSPORT_PROVIDER({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'TransportProviderName',
            placeholder: i18n.t('PLACEHOLDERS.TRANSPORT_PROVIDER').toString(),
            label: i18n.t('FILTERS.TRANSPORT_PROVIDER').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static TRANSPORT_MODE(): IFilterField {
        return {
            id: 'TransportMode',
            label: i18n.t('FILTERS.TRANSPORT_MODE').toString(),
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            type: FilterTypeEnum.dropdown,
            dropdown: {
                options: [
                    {
                        label: ServicePlanTransportModeDisplayName.ROAD,
                        value: ServicePlanTransportModeEnum.ROAD,
                    },
                    {
                        label: ServicePlanTransportModeDisplayName.RAIL,
                        value: ServicePlanTransportModeEnum.RAIL,
                    },
                    {
                        label: ServicePlanTransportModeDisplayName.BARGE,
                        value: ServicePlanTransportModeEnum.BARGE,
                    },
                ],
            },
            scmAppliedFiltersMappingRules: ['DROPDOWN'],
            browserQueryMappingRules: ['DROPDOWN'],
            apiQueryMappingRules: ['DROPDOWN'],
            savedFilterMappingRules: ['DROPDOWN'],
        };
    }

    static BL_NUMBERS(): IFilterField {
        return {
            id: 'transportDocumentNumber',
            label: i18n.t('FILTERS.BL_NUMBERS').toString(),
            placeholder: i18n.t('PLACEHOLDERS.BL_NUMBERS').toString(),
            hint: i18n.t('FILTERS.COMMA_DELIMITED_HINT').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static EQUIPMENT_NUMBERS(): IFilterField {
        return {
            id: 'cargoStuffingNumber',
            label: i18n.t('FILTERS.EQUIPMENT_NUMBERS').toString(),
            placeholder: i18n.t('PLACEHOLDERS.EQUIPMENT_NUMBERS').toString(),
            hint: i18n.t('FILTERS.COMMA_DELIMITED_HINT').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static PURCHASE_ORDER_NUMBERS(): IFilterField {
        return {
            id: 'purchaseOrderNumber',
            label: i18n.t('FILTERS.PURCHASE_ORDER_NUMBERS').toString(),
            placeholder: i18n.t('PLACEHOLDERS.PURCHASE_ORDER_NUMBERS').toString(),
            hint: i18n.t('FILTERS.COMMA_DELIMITED_HINT').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static DELIVERY_REFERENCE(): IFilterField {
        return {
            id: 'deliveryReference',
            label: i18n.t('FILTERS.DELIVERY_REFERENCE').toString(),
            placeholder: i18n.t('PLACEHOLDERS.DELIVERY_REFERENCE').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static SKU_NUMBERS(): IFilterField {
        return {
            id: 'stockKeepingUnitNumber',
            label: i18n.t('FILTERS.SKU_NUMBERS').toString(),
            placeholder: i18n.t('PLACEHOLDERS.SKU_NUMBERS').toString(),
            hint: i18n.t('FILTERS.COMMA_DELIMITED_HINT').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static DELIVERY_ORDER(): IFilterField {
        return {
            id: 'TransportOrderNumber',
            label: i18n.t('FILTERS.DELIVERY_ORDER').toString(),
            placeholder: i18n.t('PLACEHOLDERS.DELIVERY_ORDER').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static SPECIAL_PROGRAM(): IFilterField {
        return {
            id: 'specialProgram',
            label: i18n.t('FILTERS.SPECIAL_PROGRAM').toString(),
            placeholder: i18n.t('PLACEHOLDERS.SPECIAL_PROGRAM').toString(),
            type: FilterTypeEnum.text,
            browserQueryMappingRules: ['TEXT'],
            apiQueryMappingRules: ['TEXT'],
            savedFilterMappingRules: ['TEXT'],
        };
    }

    static COUNTRY_OF_ORIGIN({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'PortOfLoadingCountry',
            label: i18n.t('FILTERS.COUNTRY_OF_ORIGIN').toString(),
            placeholder: i18n.t('PLACEHOLDERS.COUNTRY_OF_ORIGIN').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static PICKUP_LOCATION({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'PickUpLocation',
            label: i18n.t('FILTERS.PICKUP_LOCATION').toString(),
            placeholder: i18n.t('PLACEHOLDERS.PICKUP_LOCATION').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static PORT_OF_LOADING({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'PortOfLoadingLocation',
            label: i18n.t('FILTERS.PORT_OF_LOADING').toString(),
            placeholder: i18n.t('PLACEHOLDERS.PORT_OF_LOADING').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static DELIVERY_LOCATION({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'DeliveryLocation',
            label: i18n.t('FILTERS.DELIVERY_LOCATION').toString(),
            placeholder: i18n.t('PLACEHOLDERS.DELIVERY_LOCATION').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static COUNTRY_OF_DESTINATION({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'PortOfDischargeCountry',
            label: i18n.t('FILTERS.COUNTRY_OF_DESTINATION').toString(),
            placeholder: i18n.t('PLACEHOLDERS.COUNTRY_OF_DESTINATION').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static PORT_OF_DISCHARGE({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'PortOfDischargeLocation',
            label: i18n.t('FILTERS.PORT_OF_DISCHARGE').toString(),
            placeholder: i18n.t('PLACEHOLDERS.PORT_OF_DISCHARGE').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_GENERIC_FILTERS_OPTIONS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static ESTIMATED_TIME_OF_ARRIVAL(): IFilterField {
        return {
            id: 'estimatedTimeOfArrivalDateRange',
            label: i18n.t('FILTERS.ESTIMATED_TIME_OF_ARRIVAL').toString(),
            type: FilterTypeEnum.datePicker,
            placeholder: i18n.t('PLACEHOLDERS.DATE_PICKER').toString(),
            browserQueryMappingRules: ['DATE_PICKER'],
            apiQueryMappingRules: ['DATE_PICKER'],
            scmAppliedFiltersMappingRules: ['DATE_PICKER'],
            savedFilterMappingRules: ['DATE_PICKER'],
        };
    }

    static ACTUAL_TIME_OF_ARRIVAL(): IFilterField {
        return {
            id: 'actualTimeOfArrivalDateRange',
            label: i18n.t('FILTERS.ACTUAL_TIME_OF_ARRIVAL').toString(),
            type: FilterTypeEnum.datePicker,
            placeholder: i18n.t('PLACEHOLDERS.DATE_PICKER').toString(),
            browserQueryMappingRules: ['DATE_PICKER'],
            apiQueryMappingRules: ['DATE_PICKER'],
            scmAppliedFiltersMappingRules: ['DATE_PICKER'],
            savedFilterMappingRules: ['DATE_PICKER'],
        };
    }

    static ESTIMATED_TIME_OF_DISCHARGE(): IFilterField {
        return {
            id: 'estimatedTimeOfDischargeDateRange',
            label: i18n.t('FILTERS.ESTIMATED_TIME_OF_DISCHARGE').toString(),
            type: FilterTypeEnum.datePicker,
            placeholder: i18n.t('PLACEHOLDERS.DATE_PICKER').toString(),
            browserQueryMappingRules: ['DATE_PICKER'],
            apiQueryMappingRules: ['DATE_PICKER'],
            scmAppliedFiltersMappingRules: ['DATE_PICKER'],
            savedFilterMappingRules: ['DATE_PICKER'],
        };
    }

    static DELIVERY_DATE(): IFilterField {
        return {
            id: 'deliveryToDateDateRange',
            label: i18n.t('FILTERS.DELIVERY_DATE').toString(),
            type: FilterTypeEnum.datePicker,
            placeholder: i18n.t('PLACEHOLDERS.DATE_PICKER').toString(),
            browserQueryMappingRules: ['DATE_PICKER'],
            apiQueryMappingRules: ['DATE_PICKER'],
            scmAppliedFiltersMappingRules: ['DATE_PICKER'],
            savedFilterMappingRules: ['DATE_PICKER'],
        };
    }

    static LAST_UPDATED_DATE(): IFilterField {
        return {
            id: 'containerLastUserUpdatedDateTime',
            label: i18n.t('FILTERS.LAST_UPDATED').toString(),
            type: FilterTypeEnum.date,
            placeholder: 'Select any date',
            apiQueryMappingRules: ['DATE'],
        };
    }

    static IS_UPDATED_USING_EXCEL(): IFilterField {
        return {
            id: 'containerIsLastUpdatedByExcel',
            label: i18n.t('FILTERS.SHOW_ONLY_UPDATED_USING_EXCEL').toString(),
            type: FilterTypeEnum.switch,
            browserQueryMappingRules: ['SWITCH'],
            apiQueryMappingRules: ['SWITCH'],
            scmAppliedFiltersMappingRules: ['SWITCH'],
            savedFilterMappingRules: ['SWITCH'],
        };
    }

    static SHIPMENT_STATUS(): IFilterField {
        const options = [
            { value: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DEPARTURE_PENDING) },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.VESSEL_DEPARTURE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.IN_TRANSIT),
            },
            {
                value: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.VESSEL_ARRIVED),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT),
            },
            {
                value: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.UNLOADED_FROM_VESSEL),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT),
            },

            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.LOADED_ON_BARGE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.BARGE_DEPARTURE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AT_INLAND_TERMINAL),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.BARGE_ARRIVAL),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AT_INLAND_TERMINAL),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.UNLOADED_FROM_BARGE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AT_INLAND_TERMINAL),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.INLAND_DEPOT_ARRIVAL),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AT_INLAND_TERMINAL),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.STORAGE_LOCATION_ARRIVAL),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.IN_STORAGE),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.GATE_OUT),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.TERMINAL_READY),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.AVAILABLE_FOR_DELIVERY),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.INLAND_DEPOT_DEPARTURE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.STORAGE_LOCATION_DEPARTURE),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.ARRIVED_AT_DELIVERY_LOCATION_FULL),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.DELIVERY_CONFIRMED),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.CARGO_DELIVERED),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.EQUIPMENT_DE_RIGGED),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.CARGO_DELIVERED),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.READY_FOR_PICKUP),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.CARGO_DELIVERED),
            },
            {
                value: getSecondaryExecutiveStatusDisplayName(SecondaryExecutiveStatus.EMPTY_CONTAINER_RETURNED),
                secondary: getPrimaryExecutiveStatusDisplayName(PrimaryExecutiveStatus.EMPTY_RETURNED),
            },
        ];

        return {
            id: 'SecondaryExecutiveStatuses',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FILTERS.SHIPMENT_STATUS').toString(),
            icon: 'chevron-down',
            iconPosition: 'right',
            isClearButtonVisible: false,
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                options,
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static PLANNING_STATUS(): IFilterField {
        return {
            id: 'planningStatus',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FILTERS.PLANNING_STATUS').toString(),
            icon: 'chevron-down',
            iconPosition: 'right',
            isClearButtonVisible: false,
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                options: [
                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.INITIAL) },
                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.READY_TO_PLAN) },
                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS) },
                    {
                        value: getSecondaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED),
                        secondary: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
                    },
                    {
                        value: getSecondaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING),
                        secondary: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
                    },
                    {
                        value: getSecondaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED),
                        secondary: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_IN_PROGRESS),
                    },

                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT) },
                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.RE_PLANNING_REQUIRED) },
                    { value: getPrimaryPlanningStatusDisplayName(PlanningStatusEnum.PLANNING_COMPLETED) },
                ],
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static DELIVERY_ORDER_STATUS(): IFilterField {
        return {
            id: 'DeliveryOrderStatuses',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FILTERS.DELIVERY_ORDER_STATUS').toString(),
            icon: 'chevron-down',
            iconPosition: 'right',
            isClearButtonVisible: false,
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                options: [
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.CREATED) },
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.SENT) },
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.ACCEPTED) },
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.REJECTED) },
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.CANCELLED) },
                    { value: getServiceLegStatusDisplayName(ServiceLegStatusEnum.UPDATED) },
                ],
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static DEMURRAGE_AND_DETENTION_STATUS(): IFilterField {
        return {
            id: 'lastFreeDayGroups',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FILTERS.DEMURRAGE_AND_DETENTION_STATUS').toString(),
            icon: 'chevron-down',
            iconPosition: 'right',
            isClearButtonVisible: false,
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                options: [
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DEMURRAGE').toString() },
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DEMURRAGE').toString() },
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DEMURRAGE').toString() },
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.WITHIN_FREE_TIME_DETENTION').toString() },
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.INCURRING_DETENTION').toString() },
                    { value: i18n.t('DEMURRAGE_AND_DETENTION_STATUS.AT_RISK_DETENTION').toString() },
                ],
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static EXCLUDE_FEE_TYPE(): IFilterField {
        return {
            id: 'excludeFeeType',
            label: 'Exclude Fee Type',
            type: FilterTypeEnum.text,
            hidden: true,
            scmAppliedFiltersMappingRules: ['EXCLUDE_FEE_TYPE'],
        };
    }

    static GAS_CHECK_REQUIRED(): IFilterField {
        return {
            id: 'gasCheckRequired',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FIELD.GAS_CHECK_REQUIRED').toString(),
            type: FilterTypeEnum.radio,
            radioOptions: {
                options: [
                    { label: i18n.t('GAS_CHECK_REQUIRED_OPTIONS.YES').toString(), value: true.toString() },
                    { label: i18n.t('GAS_CHECK_REQUIRED_OPTIONS.NO').toString(), value: false.toString() },
                ],
            },
            browserQueryMappingRules: ['RADIO'],
            apiQueryMappingRules: ['RADIO'],
            savedFilterMappingRules: ['RADIO'],
        };
    }

    static GAS_CHECK_RESULT(): IFilterField {
        return {
            id: 'gasCheckResult',
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            label: i18n.t('FIELD.GAS_CHECK_RESULT').toString(),
            type: FilterTypeEnum.radio,
            radioOptions: {
                options: [
                    { label: i18n.t('GAS_CHECK_RESULT_OPTIONS.PASS').toString(), value: GasCheckResultsEnum.PASS },
                    { label: i18n.t('GAS_CHECK_RESULT_OPTIONS.FAIL').toString(), value: GasCheckResultsEnum.FAIL },
                ],
            },
            browserQueryMappingRules: ['RADIO'],
            apiQueryMappingRules: ['RADIO'],
            savedFilterMappingRules: ['RADIO'],
        };
    }

    static DAYS_TILL_ESTIMATED_TIME_OF_ARRIVAL(): IFilterField {
        return {
            id: 'daysTillEstimatedTimeOfArrival',
            label: i18n.t('FILTERS.DAYS_TILL_ESTIMATED_TIME_OF_ARRIVAL').toString(),
            type: FilterTypeEnum.text,
            hidden: true,
            scmAppliedFiltersMappingRules: ['DAYS_TILL_ETA'],
        };
    }

    static USER({ listViewType, $store }: IGetFiltersParameters): IFilterField {
        return {
            id: 'lastUpdatedUser',
            placeholder: i18n.t('PLACEHOLDERS.USER').toString(),
            label: i18n.t('FILTERS.USER').toString(),
            type: FilterTypeEnum.multiselect,
            multiselect: {
                listMaxHeight: '240px',
                emptyOptionsMessage: i18n.t('NO_RESULTS').toString(),
                minCharacterMessage: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
                minCharacter: 4,
                fetchOptions: {
                    cancelToken: null,
                    callback: ({ id, searchText }: { id: string; searchText: string }) => {
                        const action = listViewTypeSpecificAction(listViewType, {
                            [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS}`,
                            [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.FETCH_LAST_UPDATEDBY_USERS}`,
                        });

                        return $store.dispatch(action, { id, searchText });
                    },
                },
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static UPDATED_VIA(): IFilterField {
        return {
            id: 'updatedVia',
            label: i18n.t('FILTERS.UPDATED_VIA').toString(),
            placeholder: i18n.t('PLACEHOLDERS.DROPDOWN').toString(),
            type: FilterTypeEnum.dropdown,
            dropdown: {
                options: [
                    {
                        label: UpdatedViaOptionsDisplayName[2],
                        value: UpdatedViaOptionsEnum.EXCEL_UPLOAD,
                    },
                    {
                        label: UpdatedViaOptionsDisplayName[1],
                        value: UpdatedViaOptionsEnum.DELIVERY_PLANNING_SCREEN,
                    },
                    {
                        label: UpdatedViaOptionsDisplayName[0],
                        value: UpdatedViaOptionsEnum.BOTH,
                    },
                ],
            },
            scmAppliedFiltersMappingRules: ['DROPDOWN'],
            browserQueryMappingRules: ['DROPDOWN'],
            apiQueryMappingRules: ['DROPDOWN'],
            savedFilterMappingRules: ['DROPDOWN'],
        };
    }

    static PRIORITIES(): IFilterField {
        return {
            id: 'priorityGroups',
            label: i18n.t('PRIORITY').toString(),
            type: FilterTypeEnum.checkbox,
            checkboxOptions: {
                options: [
                    { label: i18n.t('PRIORITY_LEVEL.PRIORITY_ONE').toString(), value: i18n.t('PRIORITY_LEVEL.PRIORITY_ONE').toString() },
                    { label: i18n.t('PRIORITY_LEVEL.PRIORITY_TWO').toString(), value: i18n.t('PRIORITY_LEVEL.PRIORITY_TWO').toString() },
                    { label: i18n.t('PRIORITY_LEVEL.PRIORITY_THREE').toString(), value: i18n.t('PRIORITY_LEVEL.PRIORITY_THREE').toString() },
                    { label: i18n.t('PRIORITY_LEVEL.PRIORITY_FOUR').toString(), value: i18n.t('PRIORITY_LEVEL.PRIORITY_FOUR').toString() },
                    { label: i18n.t('PRIORITY_LEVEL.PRIORITY_OTHER').toString(), value: i18n.t('PRIORITY_LEVEL.PRIORITY_OTHER').toString() },
                ],
            },
            browserQueryMappingRules: ['MULTISELECT'],
            apiQueryMappingRules: ['MULTISELECT'],
            savedFilterMappingRules: ['MULTISELECT'],
        };
    }

    static SHIPMENT_CANCELLED(): IFilterField {
            return {
                id: 'shipmentCancelled',
                label: i18n.t('FILTERS.SHOW_CANCELLED_SI_EQUIPMENTS').toString(),
                type: FilterTypeEnum.switch,
                browserQueryMappingRules: ['SWITCH'],
                apiQueryMappingRules: ['SWITCH'],
                scmAppliedFiltersMappingRules: ['SWITCH'],
                savedFilterMappingRules: ['SWITCH'],
            }
        }  
}
