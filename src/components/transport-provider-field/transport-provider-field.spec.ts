import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import TransportProviderField from './transport-provider-field.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(TransportProviderField, options);

describe('transport-provider-field', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        name: () => wrapper.find('.transport-provider-field_name'),
        code: () => wrapper.find('.transport-provider-field_code'),
    };

    beforeEach(() => {
        wrapper = render({
            localVue,
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapperFind.name().exists()).toBeFalsy();
        expect(wrapperFind.code().exists()).toBeFalsy();
    });

    it('renders name and code', async () => {
        await wrapper.setProps({
            name: 'TEST_PROVIDER_NAME',
            code: 'TEST_PROVIDER_CODE',
        });

        const name = wrapperFind.name();
        expect(name.exists()).toBeTruthy();
        expect(name.text()).toBe('TEST_PROVIDER_NAME');

        const code = wrapperFind.code();
        expect(code.exists()).toBeTruthy();
        expect(code.text()).toBe('(TEST_PROVIDER_CODE)');
    });
});
