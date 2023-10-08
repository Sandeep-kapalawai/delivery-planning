import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import { ValidationProvider } from 'vee-validate';
import ReferenceFiield from './reference-field.vue';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ReferenceFiield, options);

const localVue = createLocalVue();
describe('ReferenceFiield', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            stubs: {
                ValidationProvider,
            },
            propsData: {
                description: 'CUSTOMER_REF',
                dirty: false,
                field: {
                    id: 'referenceField_CUSTOMER_REF',
                    label: 'Customer Reference',
                    required: false,
                    value: 'yp',
                },
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
