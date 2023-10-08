import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import ButtonGroupSwitch from './button-group-switch.vue';
import { IButtonGroupSwitchOption } from './interfaces';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ButtonGroupSwitch, options);

describe('button-group-switch', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        button: (value: string) => wrapper.find(`[data-test="button-group-switch/button/${value}"]`),
    };

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    label: 'TEST_LABEL',
                    options: [
                        {
                            value: 'TEST_VALUE_1',
                            label: 'TEST_LABEL_1',
                        },
                        {
                            value: 'TEST_VALUE_2',
                            label: 'TEST_LABEL_2',
                        },
                    ] as Array<IButtonGroupSwitchOption>,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();

            const value1Button = wrapperFind.button('TEST_VALUE_1');
            expect(value1Button.exists()).toBeTruthy();

            const value2Button = wrapperFind.button('TEST_VALUE_2');
            expect(value2Button.exists()).toBeTruthy();
        });

        it('renders option as disabled when disabled flag is set for that option', async () => {
            await wrapper.setProps({
                options: [
                    {
                        value: 'TEST_VALUE_1',
                        label: 'TEST_LABEL_1',
                    },
                    {
                        value: 'TEST_VALUE_2',
                        label: 'TEST_LABEL_2',
                        disabled: true,
                    },
                ] as Array<IButtonGroupSwitchOption>,
            });

            const value1Button = wrapperFind.button('TEST_VALUE_1');
            expect(value1Button.attributes('disabled')).toBe(undefined);

            const value2Button = wrapperFind.button('TEST_VALUE_2');
            expect(value2Button.attributes('disabled')).toBe('disabled');
        });

        it('renders all the options as disabled when disabled property is set as true', async () => {
            await wrapper.setProps({
                disabled: true,
            });

            const value1Button = wrapperFind.button('TEST_VALUE_1');
            expect(value1Button.attributes('disabled')).toBe('disabled');

            const value2Button = wrapperFind.button('TEST_VALUE_2');
            expect(value2Button.attributes('disabled')).toBe('disabled');
        });

        it('emits change event when button is clicked', async () => {
            await wrapperFind.button('TEST_VALUE_1').trigger('click');

            const event = wrapper.emitted('change') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([
                {
                    value: 'TEST_VALUE_1',
                    label: 'TEST_LABEL_1',
                },
            ]);
        });
    });
});
