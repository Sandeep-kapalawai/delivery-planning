import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import DateTimeField from './date-time-field.vue';
import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DateTimeField, options);

const localVue = createLocalVue();

describe('date-time-field.vue', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                field: {
                    fieldId: 11,
                    fieldReferenceId: 101,
                    format: CustomizableFieldFormatEnum.DATE,
                    isMandatory: true,
                    referenceCode: 'TEST_REFERENCE_CODE',
                    referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                    referenceName: 'TEST_REFERENCE_NAME',
                    value: '2023-01-01T00:00:00Z',
                } as ICustomizableField,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
