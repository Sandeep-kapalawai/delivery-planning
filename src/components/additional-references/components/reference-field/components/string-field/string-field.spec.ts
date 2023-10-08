import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import StringField from './string-field.vue';
import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(StringField, options);

const localVue = createLocalVue();

describe('string-field.vue', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                field: {
                    fieldId: 11,
                    fieldReferenceId: 101,
                    format: CustomizableFieldFormatEnum.STRING,
                    isMandatory: true,
                    referenceCode: 'TEST_REFERENCE_CODE',
                    referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                    referenceName: 'TEST_REFERENCE_NAME',
                    value: 'ABCXYZ',
                } as ICustomizableField,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
