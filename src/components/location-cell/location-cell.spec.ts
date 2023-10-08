import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import LocationCell from './location-cell.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(LocationCell, options);

describe('location-cell', () => {
    let wrapper: Wrapper<Vue>;

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    params: {
                        value: {
                            beCode: 'TEST_BE_CODE',
                            name: 'TEST_CITY_NAME',
                            address: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
                        },
                    },
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });
    });
});
