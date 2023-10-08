import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import BooleanField from './boolean-field.vue';
import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(BooleanField, options);

const localVue = createLocalVue();

describe('boolean-field.vue', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                field: {
                    fieldId: 11,
                    fieldReferenceId: 101,
                    format: CustomizableFieldFormatEnum.BOOLEAN,
                    isMandatory: true,
                    referenceCode: 'TEST_REFERENCE_CODE',
                    referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                    referenceName: 'TEST_REFERENCE_NAME',
                    value: 'true',
                } as ICustomizableField,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
