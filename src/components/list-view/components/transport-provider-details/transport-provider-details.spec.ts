import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import TransportProviderDetails from './transport-provider-details.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>) => shallowMount(TransportProviderDetails, options);

describe('TransportProviderDetails ', () => {
    let wrapper: Wrapper<Vue>;

        beforeEach(() => {
            wrapper = render({
                propsData: {
                 selectedRow:{
                    cargoStuffingNumber : 'TEST_123',
                    legDetails: [
                        {
                            sequence: 101,
                            pickUpLocation: 'San Diego',
                            dropOffLocation: 'California',
                            transportMode: 'ROAD',
                            transportProvider: 'HUFFY CORPORATION',
                        },
                        {
                            sequence: 1000,
                            pickUpLocation: 'Andorra',
                            dropOffLocation: 'San Diego',
                            transportMode: 'ROAD',
                            transportProvider: 'HUFFY CORPORATION',
                        },
                    ],
                 },
                },
                localVue,
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders the component with party card', () => {
            expect(wrapper.findAll('[data-spec="transport-provider/party-card"]')).toHaveLength(1);
        });
    });

