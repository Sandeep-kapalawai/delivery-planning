import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import FilterBox from './filter-box.vue';
import FilterField from '../filter-field/filter-field.vue';
import { FilterTypeEnum, IFilterField } from '@/interfaces';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(FilterBox, options);

describe('filter-box', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        filterFieldComponents: () => wrapper.findAllComponents(FilterField),
        filterFieldComponent: (index: number) => wrapperFind.filterFieldComponents().at(index),
    };

    const fields: Array<IFilterField> = [
        {
            id: 'FILTER_FIELD_TEXT_TYPE_1',
            label: 'LABEL_KEY_TEXT_TYPE_1',
            type: FilterTypeEnum.text,
        },
        {
            id: 'FILTER_FIELD_TEXT_TYPE_2',
            label: 'LABEL_KEY_TEXT_TYPE_2',
            type: FilterTypeEnum.text,
        },
        {
            id: 'FILTER_FIELD_DATE_TYPE_1',
            label: 'LABEL_KEY_DATE_TYPE_1',
            type: FilterTypeEnum.date,
        },
        {
            id: 'FILTER_FIELD_DATE_TYPE_2',
            label: 'LABEL_KEY_DATE_TYPE_2',
            type: FilterTypeEnum.date,
        },
        {
            id: 'FILTER_FIELD_NUMBER_TYPE_1',
            label: 'LABEL_KEY_NUMBER_TYPE_1',
            type: FilterTypeEnum.number,
        },
        {
            id: 'FILTER_FIELD_NUMBER_TYPE_2',
            label: 'LABEL_KEY_NUMBER_TYPE_2',
            type: FilterTypeEnum.number,
        },
        {
            id: 'FILTER_FIELD_DROPDOWN_TYPE_1',
            label: 'LABEL_KEY_DROPDOWN_TYPE_1',
            type: FilterTypeEnum.dropdown,
        },
        {
            id: 'FILTER_FIELD_DROPDOWN_TYPE_2',
            label: 'LABEL_KEY_DROPDOWN_TYPE_2',
            type: FilterTypeEnum.dropdown,
        },
    ];

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                fields,
                filterState: {},
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('emits event on filter field change', () => {
        const filterFieldComponent = wrapperFind.filterFieldComponent(0);
        filterFieldComponent.vm.$emit('filterFieldChange', {
            id: 'FILTER_FIELD_ID',
            value: 'TEST',
        });

        const event = wrapper.emitted('filterFieldChange') as Array<any>;
        expect(event).toHaveLength(1);
        expect(event[0]).toStrictEqual([
            {
                id: 'FILTER_FIELD_ID',
                value: 'TEST',
            },
        ]);
    });
});
