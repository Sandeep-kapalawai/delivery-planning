import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import ConfirmationModal from './confirmation-modal.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ConfirmationModal, options);

const TEST_DATA = {
    heading: 'Test heading',
    confirmButtonLabel: 'Test label 1',
    cancelButtonLabel: 'Test label 2',
    size: 'large',
};

describe('confirmation-modal', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        modal: () => wrapper.find('mc-modal-stub'),
        confirmButton: () => wrapper.find('[data-test="confirmation-modal/confirm-button'),
        cancelButton: () => wrapper.find('[data-test="confirmation-modal/cancel-button'),
    };

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        const { heading, confirmButtonLabel, cancelButtonLabel, size } = TEST_DATA;
        wrapper = render({
            localVue,
            propsData: { heading, confirmButtonLabel, cancelButtonLabel, size },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the modal', () => {
        expect(wrapperFind.modal().exists()).toBeTruthy();
    });

    it('renders the correct size', () => {
        expect(wrapperFind.modal().attributes('dimension')).toEqual(TEST_DATA.size);
    });

    it('renders the correct heading', () => {
        expect(wrapperFind.modal().attributes('heading')).toEqual(TEST_DATA.heading);
    });

    it('renders the correct label on the confirm button', () => {
        expect(wrapperFind.confirmButton().attributes('label')).toEqual(TEST_DATA.confirmButtonLabel);
    });

    it('renders the correct label on the cancel button', () => {
        expect(wrapperFind.cancelButton().attributes('label')).toEqual(TEST_DATA.cancelButtonLabel);
    });
});
