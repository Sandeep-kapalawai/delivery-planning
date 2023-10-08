import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import DeliveryPlanSection from './delivery-plan-section.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DeliveryPlanSection, options);

describe('delivery-plan-section', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        mcTooltipComponent: () => wrapper.find('mc-tooltip'),
    };

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('does not render title by default', () => {
            expect(wrapper.text()).toBe('');
        });

        it('does not render tooltip by default', () => {
            expect(wrapperFind.mcTooltipComponent().exists()).toBeFalsy();
        });

        it('renders title when title value is present', async () => {
            await wrapper.setProps({
                title: 'TEST_TITLE',
            });

            expect(wrapper.text()).toBe('TEST_TITLE');
        });

        it('renders tooltip when infoText value is present', async () => {
            await wrapper.setProps({
                infoText: 'TEST_INFO_TEXT',
            });

            expect(wrapperFind.mcTooltipComponent().exists()).toBeTruthy();
        });
    });
});
