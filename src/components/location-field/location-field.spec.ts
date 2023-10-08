import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import LocationField from './location-field.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(LocationField, options);

describe('location-field', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        becode: () => wrapper.find('.location-field_becode'),
        name: () => wrapper.find('.location-field_name'),
        address: () => wrapper.findAll('.location-field_address'),
        addressLines: () => wrapper.findAll('.location-field_address-line'),
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapperFind.becode().exists()).toBeFalsy();
        expect(wrapperFind.name().exists()).toBeFalsy();
        expect(wrapperFind.address().exists()).toBeFalsy();
        expect(wrapperFind.addressLines().length).toBe(0);
    });

    it('renders beCode, name and address', async () => {
        await wrapper.setProps({
            beCode: 'TEST_BE_CODE',
            name: 'TEST_CITY_NAME',
            address: 'TEST_CITY_NAME\r\nTEST_STATE_NAME TEST_PIN_CODE\r\nTEST_COUNTRY_NAME',
        });

        const becode = wrapperFind.becode();
        expect(becode.exists()).toBeTruthy();
        expect(becode.text()).toBe('TEST_BE_CODE');

        const name = wrapperFind.name();
        expect(name.exists()).toBeTruthy();
        expect(name.text()).toBe('TEST_CITY_NAME');

        const addressLines = wrapperFind.addressLines();
        expect(addressLines.length).toBeGreaterThan(0);

        const expectedAddressLines = ['TEST_CITY_NAME', 'TEST_STATE_NAME TEST_PIN_CODE', 'TEST_COUNTRY_NAME'];
        expectedAddressLines.forEach((expectedAddressLine, index) => {
            expect(addressLines.at(index).text()).toBe(expectedAddressLine);
        });
    });
});
