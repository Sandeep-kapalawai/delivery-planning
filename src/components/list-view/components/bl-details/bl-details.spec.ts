import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import BlDetailsSection from './bl-details.vue';
import { ListViewTypeEnum } from '@/static';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(BlDetailsSection, options);

describe('bl details', () => {
    let wrapper: Wrapper<Vue>;

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    selectedRow: {
                        cargoStuffingId: 674,
                    },
                    listViewType: ListViewTypeEnum.fcl,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders  Table', () => {
            expect(wrapper.findComponent(BlDetailsSection)).toBeTruthy();
        });

        it('renders search input and button', () => {
            const searchInput = wrapper.find('[data-test="bl-details-search/input"]');
            const searchButton = wrapper.find('[data-test="blDetails/search-button"]');

            expect(searchInput.exists()).toBe(true);
            expect(searchButton.exists()).toBe(true);
        });

        it('triggers search correctly', async () => {
            const wrapper = shallowMount(BlDetailsSection, {
                localVue,
                propsData: {
                    selectedRow: { id: 1 },
                    listViewModule: 'my-module',
                },
            });

            const searchButton = wrapper.find('[data-test="blDetails/search-button"]');
            searchButton.trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.$data.rowData).toEqual([]);
        });
    });
});
