import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import  UpdateStatus  from './update-status.vue';
import { createMockServiceLeg } from '@/mocks';
import { ServiceLegStatusEnum } from '@/static/delivery-plan';
import { IServiceLeg } from '@/interfaces/delivery-plan';

const localVue = createLocalVue();


const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(UpdateStatus, options);
describe('update-status', () => {
    let wrapper: Wrapper<Vue>;
    const wrapperFind = {
        textFieldComponents: () => wrapper.findAll('textfield-stub'),
        mcNotifications: () => wrapper.find('[data-test="update-delivery-order-status-modeal-content/mc-notification-info"]'),
        cancelButton: () => wrapper.find('[data-test="update-delivery-order-status-modeal-content/cancel-button"]'),
        updateButton: () => wrapper.find('[data-test="update-delivery-order-status-modeal-content/update-button"]'),
        statusSelect:()=> wrapper.find('[data-test="update-delivery-order-status-modeal-content/status"]'),
        confirmationMessage:()=> wrapper.find('[data-test="update-delivery-order-status-modeal-content/message"]'),
    };

    describe('default', () => {


        beforeEach(() => {
            const leg: IServiceLeg = createMockServiceLeg({
                status: ServiceLegStatusEnum.SENT,
            });
            wrapper = render({
                localVue,
                propsData: {
                    leg,
                    deliveryOrder:'MDO_123',
                },                
            });
                
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();  
        });

        it('shows confirmation message with DO number on click on button', async () => {        

            const updateButton = wrapperFind.updateButton();
            updateButton.trigger('click');

            await wrapper.vm.$nextTick();
            expect(updateButton.exists()).toBeTruthy();
            const confirmationMessage = wrapperFind.confirmationMessage();
            expect(confirmationMessage.text()).toBe('MESSAGE.ACCEPT_DO_CONFIRMATION_MESSAGE');
        });


        it('renders cancel  button ', async () => {
            const cancelButton = wrapperFind.cancelButton();
            expect(cancelButton.exists()).toBeTruthy();
            expect(cancelButton.attributes('dialog-action')).toBe('cancel');
        });

        it('renders save button ', async () => {
            const saveButton = wrapperFind.updateButton();
            expect(saveButton.exists()).toBeTruthy();
            expect(saveButton.attributes('dialog-action')).toBe('save');
        });
    });
});
