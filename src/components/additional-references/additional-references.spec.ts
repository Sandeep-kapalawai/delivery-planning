import { ThisTypedShallowMountOptions, Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import AdditionalReferences from './additional-references.vue';
import { CustomizableFieldFormatEnum } from '@/static';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(AdditionalReferences, options);

const localVue = createLocalVue();

describe('additional-references.vue', () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                fields: [
                    {
                        fieldId: 1,
                        fieldReferenceId: 101,
                        format: CustomizableFieldFormatEnum.STRING,
                        referenceCode: 'TEST_REFERENCE_CODE',
                        referenceDescription: 'TEST_REFERENCE_DESCRIPTION',
                        referenceName: 'TEST_REFERENCE_NAME',
                        isMandatory: true,
                        value: 'TEST_VALUE',
                    },
                ],
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
