import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import UpdateDetailsSection from './update-details-section.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(UpdateDetailsSection, options);

describe('update-details-section', () => {
    let wrapper: Wrapper<Vue>;

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

        it('renders title when title value is present', async () => {
            await wrapper.setProps({
                title: 'TEST_TITLE',
            });

            expect(wrapper.text()).toBe('TEST_TITLE');
        });
    });
});
