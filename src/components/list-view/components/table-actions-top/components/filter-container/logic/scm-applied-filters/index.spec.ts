import { mapAppliedFiltersToSCMAppliedFilters } from '.';
import { IAppliedFilters, IFilterSection, FilterTypeEnum } from '@/interfaces';
import { format, subDays, addDays } from 'date-fns';

describe('applied filter logic', () => {
    describe('mapAppliedFiltersToSCMAppliedFilters', () => {
        it('returns empty filter state when applied filters is empty', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {};
            const expectedOutput: IAppliedFilters = [];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns applied filter when browserQueryMappingRules has DROPDOWN rule in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.dropdown,
                            scmAppliedFiltersMappingRules: ['DROPDOWN'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: [{ label: 'Road', value: 'Road' }],
            };
            const expectedOutput: IAppliedFilters = [{ label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: ['Road'] }];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        it('returns applied filter when browserQueryMappingRules has RADIO rule in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.radio,
                            scmAppliedFiltersMappingRules: ['RADIO'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: [{ label: 'Road', value: 'Road' }],
            };
            const expectedOutput: IAppliedFilters = [{ label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: ['Road'] }];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('when browserQueryMappingRules has DATE_PICKER rule in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            scmAppliedFiltersMappingRules: ['DATE_PICKER'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const mockDaysDifference = { from: 7, to: 7 };
            it('returns applied filter when selectedDropDown value not equals custom_datepicker', () => {
                const mockSelectedDropdownValue = { label: '± 7 days from today', value: 7 };
                const mockSelectedDateRange = { from: '21 APR 2023', to: '05 MAY 2023' };

                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD_ID: {
                        selectedDateRange: mockSelectedDateRange,
                        daysDifference: mockDaysDifference,
                        selectedDropdownValue: mockSelectedDropdownValue,
                    },
                };
                const fromDate = format(subDays(new Date(), mockDaysDifference.from), 'dd MMM yyyy').toUpperCase();
                const toDate = format(addDays(new Date(), mockDaysDifference.to), 'dd MMM yyyy').toUpperCase();
                const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });

                const expectedOutput: IAppliedFilters = [
                    { label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: `${fromDate} - ${toDate}` },
                ];
                expect(actualOutput).toStrictEqual(expectedOutput);
            });

            it('returns applied filter when selectedDropDown value equals custom_datepicker', () => {
                const mockSelectedDropdownValue = { label: 'TEST_LABEL', value: 'custom_datepicker' };
                const mockSelectedDateRange = { from: '22 APR 2023', to: '23 MAY 2023' };
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD_ID: {
                        selectedDateRange: mockSelectedDateRange,
                        daysDifference: mockDaysDifference,
                        selectedDropdownValue: mockSelectedDropdownValue,
                    },
                };
                const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });

                const expectedOutput: IAppliedFilters = [
                    {
                        label: 'FILTER_FIELD_LABEL',
                        name: 'FILTER_FIELD_ID',
                        sectionName: 'General',
                        value: `${mockSelectedDateRange.from} - ${mockSelectedDateRange.to}`,
                    },
                ];
                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('returns applied filter when browserQueryMappingRules has SWITCH rule in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.switch,
                            scmAppliedFiltersMappingRules: ['SWITCH'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: true,
            };
            const expectedOutput: IAppliedFilters = [{ label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: 'YES' }];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns applied filter when browserQueryMappingRules has DAYS_TILL_ETA rule in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            scmAppliedFiltersMappingRules: ['DAYS_TILL_ETA'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: 14,
            };
            const expectedOutput: IAppliedFilters = [{ label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: '14 days' }];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns applied filter when browserQueryMappingRules has no rules in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: 'FILTER_TEST_DATA',
            };
            const expectedOutput: IAppliedFilters = [
                { label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: 'FILTER_TEST_DATA' },
            ];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('returns applied filter when browserQueryMappingRules has invalid rules in scmAppliedFiltersMappingRules', () => {
            const filterSections: Array<IFilterSection> = [
                {
                    id: 'general',
                    title: 'General',
                    slotReference: 'general',
                    expanded: false,
                    fields: [
                        {
                            id: 'FILTER_FIELD_ID',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            scmAppliedFiltersMappingRules: ['INVALID'],
                        },
                    ],
                    indicator: 0,
                },
            ];
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD_ID: 'FILTER_TEST_DATA',
            };
            const expectedOutput: IAppliedFilters = [
                { label: 'FILTER_FIELD_LABEL', name: 'FILTER_FIELD_ID', sectionName: 'General', value: 'FILTER_TEST_DATA' },
            ];

            const actualOutput = mapAppliedFiltersToSCMAppliedFilters({ filterSections, appliedFilters });
            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
