import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import NumberField from './number-field.vue';
import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(NumberField, options);

const localVue = createLocalVue();

describe('number-field.vue', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                field: {
                    fieldId: 11,
                    fieldReferenceId: 101,
                    format: CustomizableFieldFormatEnum.INTEGER,
                    isMandatory: true,
                    referenceCode: 'TEST_REFERENCE_CODE',
                    referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                    referenceName: 'TEST_REFERENCE_NAME',
                    value: '1234567890',
                } as ICustomizableField,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
