import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import FinalDeliveryLocations from './final-delivery-locations.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>) => shallowMount(FinalDeliveryLocations, options);
describe('Final Delivery Locations', () => {
    let wrapper: Wrapper<Vue>;

    describe('Final Delivery Locations', () => {
        const wrapperFind = {
            location: () => wrapper.find('[data-spec="finalDeliveryLocation/addressName"]'),
            beCode: () => wrapper.find('[data-spec="finalDeliveryLocation/addressbeCode"]'),
            address: () => wrapper.find('[data-spec="finalDeliveryLocation/addressLines"]'),
        };

        beforeEach(() => {
            wrapper = render({
                propsData: {
                    locations: [
                        {
                            beCode: 'INXGT865',
                            name: 'Hyderabad',
                            addressLines: ['47', 'INDUSTRIAL ESTATE  B 47 SANATHNAGAR', 'HYDERABAD', 'Hyderabad 500018', 'Andhra Pradesh', 'India'],
                        },
                    ],
                    index: 0,
                    cargoStuffingNumber: 'VAMZ2909224',
                },
                localVue,
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });
        it('renders component with delivery locations', () => {
            expect(wrapperFind.location().text()).toBe('Hyderabad');
            expect(wrapperFind.address().text()).toBe('47');
            expect(wrapperFind.beCode().text()).toBe('INXGT865');
        });
    });
});
