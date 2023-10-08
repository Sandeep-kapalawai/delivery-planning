import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import TextFieldWithColor from './text-field-with-color.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(TextFieldWithColor, options);

describe('text-field-with-color', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        label: () => wrapper.find('.text-field-with-color_label'),
        value: () => wrapper.find('.text-field-with-color_value'),
    };

    const PROP_VALUES = {
        LABEL: 'Test Label',
        VALUE: 'Test Value',
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                label: PROP_VALUES.LABEL,
                value: PROP_VALUES.VALUE,
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the label', () => {
        const el = wrapperFind.label();

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual(PROP_VALUES.LABEL);
    });

    it('renders the value', () => {
        const el = wrapperFind.value();

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual(PROP_VALUES.VALUE);
    });

    it('renders a hyphen if the value is not present', async () => {
        await wrapper.setProps({ value: undefined });

        const el = wrapperFind.value();

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual('-');
    });
});
