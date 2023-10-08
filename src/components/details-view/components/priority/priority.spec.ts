import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Priority from './priority.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(Priority, options);

describe('delivery-location', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        displayText: () => wrapper.find('.priority > div:last-child'),
    };

    const PROP_VALUES = {
        LEVEL: 2,
        DISPLAY_NAME: 'Test Priority',
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                level: PROP_VALUES.LEVEL,
                displayName: PROP_VALUES.DISPLAY_NAME,
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the display name and level', () => {
        const el = wrapperFind.displayText();
        const expectedText = `${PROP_VALUES.DISPLAY_NAME} (P${PROP_VALUES.LEVEL})`;

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual(expectedText);
    });

    it('renders a hyphen as fallback if level is not defined', async () => {
        await wrapper.setProps({ level: 0 });

        expect(wrapper.text()).toEqual('-');
    });
});
