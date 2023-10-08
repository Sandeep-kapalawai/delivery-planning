import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import FilterField from './filter-field.vue';
import { FilterTypeEnum, IAppliedFilters, IFilterField } from '@/interfaces';
import { FilterEventBus, FilterEventBusEventName } from '../../utilities/event-bus';
import { DATE_PICKER_DEFAULT_DAYS_DIFFERENCE, DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE, DATE_PICKER_DEFAULT_SELECTED_INDEX } from '@/static';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(FilterField, {
        directives: {
            ['click-outside']: jest.fn(),
        },
        ...options,
    });

describe('filter-field', () => {
    let wrapper: Wrapper<Vue>;
    let fieldId: string;
    let fieldElement: Wrapper<FilterField, Element>;

    describe('text type', () => {
        beforeEach(() => {
            fieldId = 'FILTER_FIELD_TEXT_TYPE';
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_TEXT_TYPE',
                        type: FilterTypeEnum.text,
                        hint: 'TEST_HINT',
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('emits event on field change', async () => {
            const eventValue = 'TEXT TYPE FIELD EVENT';
            const eventObject = {
                target: {
                    value: eventValue,
                },
            };
            fieldElement.vm.$emit('input', eventObject);

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: [eventValue],
                },
            ]);
        });

        it('sets isHintVisible to true on field focus', async () => {
            fieldElement.vm.$emit('focus');
            await fieldElement.vm.$nextTick();
            expect(fieldElement.attributes('hint')).toBe('TEST_HINT');
        });

        it('sets isHintVisible to false on field blur', async () => {
            await wrapper.setData({
                isHintVisible: true,
            });
            fieldElement.vm.$emit('blur');
            await fieldElement.vm.$nextTick();
            expect(fieldElement.attributes('hint')).toBeFalsy;
        });
    });
    describe('radio type', () => {
        beforeEach(() => {
            fieldId = 'FILTER_FIELD_RADIO_TYPE';
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_RADIO_TYPE',
                        type: FilterTypeEnum.radio,
                        radioOptions: {
                            options: [
                                { label: 'Yes', value: true },
                                { label: 'No', value: false },
                            ],
                        },
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'RADIO_TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it.each(['yes', 'no', 'pass', 'fail', true, false, 'true', 'false'])('emits event with the correct %s value on field change', (eventValue) => {
            const eventObject = {
                detail: eventValue,
            };

            fieldElement.vm.$emit('change', eventObject);

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: eventValue,
                },
            ]);
        });
    });

    describe('checkbox type', () => {
        beforeEach(() => {
            fieldId = 'FILTER_FIELD_CHECKBOX_TYPE';
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_CHECKBOX_TYPE',
                        type: FilterTypeEnum.radio,
                        radioOptions: {
                            options: [
                                { label: 'TEST_1', value: 'TEST_1' },
                                { label: 'TEST_2', value: 'TEST_2' },
                            ],
                        },
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'RADIO_TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it.each(['TEST_1', 'TEST_2'])('emits event with the correct %s value on field change', (eventValue) => {
            const eventObject = {
                detail: eventValue,
            };

            fieldElement.vm.$emit('change', eventObject);

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: eventValue,
                },
            ]);
        });
    });

    describe('date type', () => {
        fieldId = 'FILTER_FIELD_DATE_TYPE';

        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_DATE_TYPE',
                        type: FilterTypeEnum.date,
                    } as IFilterField,
                    filterState: {
                        [fieldId]: '2022-01-01',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('emits event on field change', async () => {
            const eventValue = '2022-01-31';
            const eventObject = {
                target: {
                    value: eventValue,
                },
            };
            fieldElement.vm.$emit('input', eventObject);

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: eventValue,
                },
            ]);
        });
    });

    describe('number type', () => {
        fieldId = 'FILTER_FIELD_NUMBER_TYPE';

        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_NUMBER_TYPE',
                        type: FilterTypeEnum.number,
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('emits event on field change', async () => {
            const eventValue = 'NUMBER TYPE FIELD EVENT';
            const eventObject = {
                target: {
                    value: eventValue,
                },
            };
            fieldElement.vm.$emit('input', eventObject);

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: eventValue,
                },
            ]);
        });
    });

    describe('datePicker type', () => {
        describe('datePicker type when filterState is undefined', () => {
            beforeEach(() => {
                fieldId = 'FILTER_FIELD_DATE_RANGE_PICKER_TYPE';
                wrapper = render({
                    localVue,
                    propsData: {
                        field: {
                            id: fieldId,
                            label: 'LABEL_KEY_DATE_RANGE_PICKER_TYPE',
                            type: FilterTypeEnum.datePicker,
                        } as IFilterField,
                    },
                });
                fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
            });

            it('renders field', () => {
                expect(wrapper.exists()).toBeTruthy();
            });

            it('creates default props values for date picker on created when filterState is undefined', async () => {
                expect(fieldElement.props('selectedIndex')).toBe(DATE_PICKER_DEFAULT_SELECTED_INDEX);
                expect(fieldElement.props('defaultDaysBeforeAfter')).toEqual({ after: 7, before: 0 });
                expect(fieldElement.props('defaultFromToDatePicker')).toEqual(DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE);
            });

            it('emits event on field change', async () => {
                const selectedDateRange = { from: '21 APR 2023', to: '05 MAY 2023' };
                const daysDifference = { from: 0, to: 7 };
                const selectedDropdownValue = { label: 'TEST', value: 7 };
                fieldElement.vm.$emit('get-range-date', selectedDateRange, daysDifference, selectedDropdownValue);
                const expectedValue = {
                    daysDifference: { from: 0, to: 7 },
                    selectedDateRange: { from: '21 APR 2023', to: '05 MAY 2023' },
                    selectedDropdownValue: { label: 'TEST', value: 7 },
                };
                const event = wrapper.emitted('filterFieldChange') as Array<any>;
                expect(event).toHaveLength(1);
                expect(event[0]).toStrictEqual([
                    {
                        id: fieldId,
                        value: expectedValue,
                    },
                ]);
            });
        });
        describe('datePicker type when filterState is defined', () => {
            beforeEach(() => {
                fieldId = 'FILTER_FIELD_DATE_RANGE_PICKER_TYPE';
                wrapper = render({
                    localVue,
                    propsData: {
                        field: {
                            id: fieldId,
                            label: 'LABEL_KEY_DATE_RANGE_PICKER_TYPE',
                            type: FilterTypeEnum.datePicker,
                        } as IFilterField,
                        filterState: {
                            [fieldId]: {
                                daysDifference: { from: 0, to: 14 },
                                selectedDateRange: { from: '21 APR 2023', to: '05 MAY 2023' },
                                selectedDropdownValue: { label: 'TEST', value: 14 },
                            },
                        } as IAppliedFilters,
                    },
                });
                fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
            });

            it('creates default props values for date picker on created from filterState if not undefined', async () => {
                expect(fieldElement.props('selectedIndex')).toBe(1);
                expect(fieldElement.props('defaultDaysBeforeAfter')).toEqual({ after: 14, before: 0 });
                expect(fieldElement.props('defaultFromToDatePicker')).toEqual({ from: '21 APR 2023', to: '05 MAY 2023' });
            });
        });
    });

    describe('switch type', () => {
        beforeEach(() => {
            fieldId = 'FILTER_FIELD_SWITCH_TYPE';
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_SWITCH_TYPE',
                        type: FilterTypeEnum.switch,
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('emits event on field change', async () => {
            await fieldElement.trigger('change');
            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: true,
                },
            ]);
        });
    });

    describe('dropdown type', () => {
        fieldId = 'FILTER_FIELD_DROPDOWN_TYPE';

        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_DROPDOWN_TYPE',
                        type: FilterTypeEnum.dropdown,
                    } as IFilterField,
                    filterState: {
                        [fieldId]: 'TEST',
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('emits event on field change', async () => {
            const eventValue = [{ key: 'DROPDOWN TYPE FIELD KEY', value: 'DROPDOWN TYPE FIELD VALUE' }];
            const eventObject = {
                detail: {
                    selectedOptions: eventValue,
                },
            };

            await fieldElement.vm.$emit('change', eventObject);
            const event = wrapper.emitted('filterFieldChange') as Array<any>;

            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: eventValue,
                },
            ]);
        });
    });

    describe('multiselect type', () => {
        let multiselectFetchOptionsCallback: ({ id, searchText }: { id: string; searchText: string }) => Promise<any>;

        fieldId = 'FILTER_FIELD_MULTISELECT_TYPE';

        const multiselectOptions: Array<{
            value: string;
            secondary: string;
        }> = [
            {
                value: 'TEST_1',
                secondary: 'TEST_1_SECONDARY',
            },
            {
                value: 'TEST_2',
                secondary: 'TEST_2_SECONDARY',
            },
            {
                value: 'TEST_3',
                secondary: 'TEST_3_SECONDARY',
            },
            {
                value: 'TEST_4',
                secondary: 'TEST_4_SECONDARY',
            },
            {
                value: 'TEST_5',
                secondary: 'TEST_5_SECONDARY',
            },
        ];

        const wrapperFind = {
            list: () => wrapper.find(`[data-test="filter-field/${fieldId}/list"]`),
            listItems: () => wrapper.findAll(`[data-test^="filter-field/${fieldId}/list-item"]`),
            emptyOptionsMessagelistItem: () => wrapper.find(`[data-test="filter-field/${fieldId}/list-item/empty-options-message"]`),
            tags: () => wrapper.findAll(`[data-test^="filter-field/${fieldId}/tag"]`),
        };

        beforeAll(() => {
            jest.useFakeTimers();
            jest.spyOn(FilterEventBus, '$on');
            jest.spyOn(FilterEventBus, '$off');
        });

        beforeEach(() => {
            multiselectFetchOptionsCallback = jest.fn().mockImplementation(() => {
                return Promise.resolve([]);
            });

            wrapper = render({
                localVue,
                propsData: {
                    field: {
                        id: fieldId,
                        label: 'LABEL_KEY_MULTISELECT_TYPE',
                        type: FilterTypeEnum.multiselect,
                        multiselect: {
                            fetchOptions: {
                                callback: multiselectFetchOptionsCallback,
                            },
                            options: multiselectOptions,
                            minCharacter: 4,
                            minCharacterMessage: 'Please enter more than 4 characters',
                        },
                    } as IFilterField,
                    filterState: {
                        [fieldId]: ['TEST_1', 'TEST_2'],
                    } as IAppliedFilters,
                },
            });
            fieldElement = wrapper.find(`[data-test="filter-field/${fieldId}"]`);
        });

        it('renders field', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        test('adds event listener on component create', () => {
            expect(FilterEventBus.$on).toBeCalled();
            expect(FilterEventBus.$on).toBeCalledWith(FilterEventBusEventName.FILTER_CLEAR, expect.any(Function));
        });

        test('removes event listener on component destroy', () => {
            wrapper.destroy();

            expect(FilterEventBus.$off).toBeCalled();
            expect(FilterEventBus.$off).toBeCalledWith(FilterEventBusEventName.FILTER_CLEAR);
        });

        it('renders list items on focus', async () => {
            expect(wrapperFind.listItems().length).toBe(0);

            await fieldElement.vm.$emit('focus');

            expect(wrapperFind.listItems().length).toBe(5);
        });

        it('renders list items when options as available', async () => {
            await fieldElement.vm.$emit('click');

            multiselectOptions.forEach((option, index) => {
                expect(wrapperFind.listItems().at(index).text()).toContain(option.value);
                expect(wrapperFind.listItems().at(index).text()).toContain(option.secondary);
            });
        });

        it('renders empty options message when options as not available', async () => {
            await wrapper.setProps({
                field: {
                    id: fieldId,
                    label: 'LABEL_KEY_MULTISELECT_TYPE',
                    type: FilterTypeEnum.multiselect,
                    multiselect: {
                        options: [],
                        emptyOptionsMessage: 'No Results',
                    },
                } as IFilterField,
            });

            await fieldElement.vm.$emit('click');

            expect(wrapperFind.emptyOptionsMessagelistItem().text()).toBe('Please enter more than 4 characters');
        });

        it('renders empty options message when for more than 4 characters', async () => {
            await wrapper.setProps({
                field: {
                    id: fieldId,
                    label: 'LABEL_KEY_MULTISELECT_TYPE',
                    type: FilterTypeEnum.multiselect,
                    multiselect: {
                        options: [],
                        emptyOptionsMessage: 'No Results',
                        fetchOptions: {
                            callback: multiselectFetchOptionsCallback,
                            cancelToken: null,
                        },
                    },
                } as IFilterField,
            });
            const searchText = 'testhh';
            const event = { target: { value: searchText } };
            await fieldElement.vm.$emit('input', event);
            jest.runAllTimers();
            await fieldElement.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(multiselectFetchOptionsCallback).toHaveBeenCalledTimes(1);
            expect(wrapperFind.emptyOptionsMessagelistItem().text()).toBe('No Results');
        });

        it('renders empty options message when for less than 4 characters', async () => {
            await wrapper.setProps({
                field: {
                    id: fieldId,
                    label: 'LABEL_KEY_MULTISELECT_TYPE',
                    type: FilterTypeEnum.multiselect,
                    multiselect: {
                        options: [],
                        emptyOptionsMessage: 'No Results',
                        minCharacter: 4,
                        minCharacterMessage: 'TEST_MIN_CHARACTER_COUNT',
                        fetchOptions: {
                            callback: multiselectFetchOptionsCallback,
                            cancelToken: null,
                        },
                    },
                } as IFilterField,
            });
            const searchText = 'tes';
            const event = { target: { value: searchText } };
            await fieldElement.vm.$emit('input', event);
            jest.runAllTimers();
            await fieldElement.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(multiselectFetchOptionsCallback).toHaveBeenCalledTimes(0);
            expect(wrapperFind.emptyOptionsMessagelistItem().text()).toBe('TEST_MIN_CHARACTER_COUNT');
        });

        it('renders selected items as tags', () => {
            expect(wrapperFind.tags().at(0).exists()).toBeTruthy();
            expect(wrapperFind.tags().at(0).attributes('label')).toBe('TEST_1');

            expect(wrapperFind.tags().at(1).exists()).toBeTruthy();
            expect(wrapperFind.tags().at(1).attributes('label')).toBe('TEST_2');
        });

        it('emits event on item add', async () => {
            await fieldElement.vm.$emit('click');
            await wrapperFind
                .listItems()
                .filter((item) => item.text().includes('TEST_3'))
                .at(0)
                .vm.$emit('click');

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: ['TEST_1', 'TEST_2', 'TEST_3'],
                },
            ]);
        });

        it('emits event on item remove', async () => {
            await wrapperFind
                .tags()
                .filter((item) => item.attributes('label') === 'TEST_2')
                .at(0)
                .vm.$emit('dismiss');

            const event = wrapper.emitted('filterFieldChange') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    id: fieldId,
                    value: ['TEST_1'],
                },
            ]);
        });
    });
});
