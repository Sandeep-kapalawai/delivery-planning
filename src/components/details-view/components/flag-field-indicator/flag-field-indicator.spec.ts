import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import FlagFieldIndicator from './flag-field-indicator.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(FlagFieldIndicator, { ...options, stubs: { TextField: true } });

describe('flag-field-indicator', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        textField: () => wrapper.find('textfield-stub'),
        icon: () => wrapper.find('mc-icon-stub'),
    };

    const PROP_VALUES = {
        LABEL: 'Test Label',
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                label: PROP_VALUES.LABEL,
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the label', () => {
        const textFieldElement = wrapperFind.textField();

        expect(textFieldElement.exists()).toBeTruthy();
        expect(textFieldElement.attributes('label')).toBe(PROP_VALUES.LABEL);
    });

    it('displays the check icon if the value is true', async () => {
        await wrapper.setProps({ value: true });

        const iconElement = wrapperFind.icon();
        expect(iconElement.exists()).toBeTruthy();
    });

    it('does not display the check icon if the value is false', async () => {
        await wrapper.setProps({ value: false });

        const iconElement = wrapperFind.icon();
        expect(iconElement.exists()).toBeFalsy();
    });
});
