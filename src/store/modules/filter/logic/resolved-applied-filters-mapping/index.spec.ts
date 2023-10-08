import { mapAppliedFiltersToResolvedAppliedFilters } from '.';
import { keyBy } from 'lodash';
import { FilterTypeEnum, IAppliedFilters, IFilterField, IFilterSection } from '@/interfaces';
import * as destinationUtilities from 'destination/utilities';
import { format, subDays, addDays } from 'date-fns';

jest.mock('destination/utilities');

function getFiltersArrayAndMap(filters: Array<IFilterSection>): {
    filtersArray: Array<IFilterSection>;
    filtersMap: { [key: string]: IFilterSection };
    fieldMap: { [key: string]: IFilterField };
} {
    return {
        filtersArray: filters,
        filtersMap: keyBy(filters, 'id'),
        fieldMap: filters.reduce((acc, curr) => {
            return { ...acc, ...keyBy(curr.fields, 'id') };
        }, {}),
    };
}

describe('resolved-applied-filters-mapping logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('mapAppliedFiltersToResolvedAppliedFilters', () => {
        it('return resolved applied filters when apiQueryMappingRules is empty', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has invalid rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            apiQueryMappingRules: ['INVALID_RULE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has IGNORE rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            apiQueryMappingRules: ['IGNORE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {};

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has FROM_DATE rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.date,
                            apiQueryMappingRules: ['FROM_DATE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: '2022-01-01',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '2022-01-01T00:00:00.000Z',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has TO_DATE rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.date,
                            apiQueryMappingRules: ['TO_DATE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: '2022-12-31',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '2022-12-31T23:59:59.999Z',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has DROPDOWN rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.dropdown,
                            apiQueryMappingRules: ['DROPDOWN'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return resolved applied filters when apiQueryMappingRules has MULTISELECT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.multiselect,
                            apiQueryMappingRules: ['MULTISELECT'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: ['TEST_SELECT_1', 'TEST_SELECT_2'],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'TEST_SELECT_1,TEST_SELECT_2',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('return resolved applied filters when apiQueryMappingRules has DATE_PICKER rule', () => {
            it('calculates date dynamically when selected dropdown value is other than custom_datepicker', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'estimatedTimeOfArrivalDateRange',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.datePicker,
                                apiQueryMappingRules: ['DATE_PICKER'],
                            },
                        ],
                    },
                ]);
                const mockDaysDifference = { from: 7, to: 7 };
                const mockSelectedDropdownValue = { label: '± 7 days from today', value: 7 };
                const mockSelectedDateRange = { from: '21 APR 2023', to: '05 MAY 2023' };
                const appliedFilters: IAppliedFilters = {
                    estimatedTimeOfArrivalDateRange: {
                        selectedDateRange: mockSelectedDateRange,
                        daysDifference: mockDaysDifference,
                        selectedDropdownValue: mockSelectedDropdownValue,
                    },
                };

                const expectedEstimatedTimeOfArrivalFromDateTimeLocal = destinationUtilities.getFormattedDateInISO8601({
                    date: format(subDays(new Date(), mockDaysDifference.from), 'dd MMM yyyy').toUpperCase(),
                });
                const expectedEstimatedTimeOfArrivalToDateTimeLocal = destinationUtilities.getFormattedDateInISO8601({
                    date: format(addDays(new Date(), mockDaysDifference.to), 'dd MMM yyyy').toUpperCase(),
                });
                const expectedOutput: IAppliedFilters = {
                    estimatedTimeOfArrivalFromDateTimeLocal: expectedEstimatedTimeOfArrivalFromDateTimeLocal,
                    estimatedTimeOfArrivalToDateTimeLocal: expectedEstimatedTimeOfArrivalToDateTimeLocal,
                };

                const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });
                expect(destinationUtilities.getFormattedDateInISO8601).toHaveBeenCalledTimes(4);
                expect(actualOutput).toStrictEqual(expectedOutput);
            });

            it('shows the date from selected date range when selected dropdown value is custom_datepicker', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'estimatedTimeOfArrivalDateRange',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.datePicker,
                                apiQueryMappingRules: ['DATE_PICKER'],
                            },
                        ],
                    },
                ]);
                const mockDaysDifference = { from: 7, to: 7 };
                const mockSelectedDropdownValue = { label: 'ANY_LABEL', value: 'custom_datepicker' };
                const mockSelectedDateRange = { from: '21 APR 2023', to: '05 MAY 2023' };
                const appliedFilters: IAppliedFilters = {
                    estimatedTimeOfArrivalDateRange: {
                        selectedDateRange: mockSelectedDateRange,
                        daysDifference: mockDaysDifference,
                        selectedDropdownValue: mockSelectedDropdownValue,
                    },
                };
                const expectedOutput: IAppliedFilters = {
                    estimatedTimeOfArrivalFromDateTimeLocal: '2023-04-21',
                    estimatedTimeOfArrivalToDateTimeLocal: '2023-05-05',
                };

                const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });
                expect(destinationUtilities.getFormattedDateInISO8601).toHaveBeenCalledTimes(2);
                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return resolved applied filters when apiQueryMappingRules has DATE rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.date,
                            apiQueryMappingRules: ['DATE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: '12 MAR 2023',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '2023-03-12',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('return resolved applied filters when apiQueryMappingRules has SWITCH rule', () => {
            it('does not append to resolved applied filters if toggled off', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.switch,
                                apiQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD: false,
                };
                const expectedOutput: IAppliedFilters = {};

                const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });
                expect(actualOutput).toStrictEqual(expectedOutput);
            });

            it('appends to resolved applied filters if toggled on', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.switch,
                                apiQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD: true,
                };
                const expectedOutput: IAppliedFilters = {
                    FILTER_FIELD: true,
                };

                const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });
                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return resolved applied filters when apiQueryMappingRules has TEXT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            apiQueryMappingRules: ['TEXT'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: ['TEST_TEXT_1', 'TEST_TEXT_2'],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'TEST_TEXT_1,TEST_TEXT_2',
            };

            const actualOutput = mapAppliedFiltersToResolvedAppliedFilters({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
