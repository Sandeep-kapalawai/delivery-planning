import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import DeliveryLocation from './delivery-location.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DeliveryLocation, options);

describe('delivery-location', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        label: () => wrapper.find('.delivery-location > div:nth-child(1)'),
        beCode: () => wrapper.find('.delivery-location > div:nth-child(2)'),
        addressLines: () => wrapper.find('.address-lines'),
    };

    const PROP_VALUES = {
        LABEL: 'Test Label',
        BE_CODE: 'Test BE Code',
        ADDRESS_LINES: [...Array(4).keys()].map((n) => `Address Line ${n}`),
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                label: PROP_VALUES.LABEL,
                beCode: PROP_VALUES.BE_CODE,
                addressLines: PROP_VALUES.ADDRESS_LINES,
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the label', () => {
        const el = wrapperFind.label();

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual(PROP_VALUES.LABEL);
    });

    it('renders the BE code', () => {
        const el = wrapperFind.beCode();

        expect(el.exists()).toBeTruthy();
        expect(el.text()).toEqual(PROP_VALUES.BE_CODE);
    });

    it('renders the address lines', () => {
        const el = wrapperFind.addressLines();

        expect(el.exists()).toBeTruthy();
    });

    const testCases = PROP_VALUES.ADDRESS_LINES.map((l, i: any) => [i, l]);
    it.each(testCases)('at index %d, renders the address line %s', (index: number, expectedAddressLine: string) => {
        const addressLinesComponents = wrapperFind.addressLines().findAll('.address-lines > div');
        const addressLinesComponent = addressLinesComponents.at(index);

        expect(addressLinesComponent.text()).toEqual(expectedAddressLine);
    });
});
