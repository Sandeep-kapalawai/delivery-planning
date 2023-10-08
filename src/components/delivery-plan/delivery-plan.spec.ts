import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { merge } from 'lodash';
import flushPromises from 'flush-promises';
import DeliveryPlan from './delivery-plan.vue';
import DeliveryPlanSection from './components/delivery-plan-section/delivery-plan-section.vue';
import DeliveryLeg from './components/delivery-leg/delivery-leg.vue';
import ConfirmationModal from '@/components/confirmation-modal/confirmation-modal.vue';
import { IRootState } from '@/store/interfaces';
import { IState } from '@/store/modules/delivery-plan/interfaces';
import deliveryPlan from '@/store/modules/delivery-plan';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanActionEnum, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { CustomizableFieldFormatEnum } from '@/static/delivery-plan/customizable-field-format';
import { createMockServiceLeg, createMockServicePlan } from '@/mocks';
import { DeliveryPlanningViewNameEnum, ListViewTypeEnum, ServiceLegStatusEnum, ServiceLegTypeEnum } from '@/static';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        DeliveryPlan,
        merge(
            {
                stubs: {
                    ValidationObserver,
                    ValidationProvider,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const createStore = () => {
    const deliveryPlanModule: Module<IState, IRootState> = {
        namespaced: true,
        state: {
            deliveryPlan: {
                isFetching: false,
                isSaving: false,
                isSending: false,
                response: createMockServicePlan(),
            },
            additionalReference: {
                isFetching: false,
                response: [
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
                payload: new Map(),
            },
        },
        getters: deliveryPlan.getters,
        actions: {
            [DeliveryPlanActionEnum.RESET_STATE]: jest.fn(),
            [DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN]: jest.fn(),
            [DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN]: jest.fn(),
            [DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN]: jest.fn(),
            [DeliveryPlanActionEnum.ADD_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.FETCH_ADDITIONAL_REFERENCE]: jest.fn(),
        },
        mutations: {
            [DeliveryPlanMutationEnum.SET_ADDITIONAL_REFERENCE_FIELD]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

describe('delivery-plan', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        deliveryPlanSectionComponents: () => wrapper.findAllComponents(DeliveryPlanSection),
        deliveryLegComponents: () => wrapper.findAllComponents(DeliveryLeg),
        addDeliveryLegButton: () => wrapper.find('[data-test="delivery-plan/add-leg-button"]'),
        cancelledLegsInfoMessageNotification: () => wrapper.find('[data-test="delivery-plan/mc-notification/cancelled-legs-info-message"]'),
        rejectedLegsInfoMessageNotification: () => wrapper.find('[data-test="delivery-plan/mc-notification/rejected-legs-info-message"]'),
        sendPlanButton: () => wrapper.find('[data-test="delivery-plan/send-plan-button"]'),
        savePlanButton: () => wrapper.find('[data-test="delivery-plan/save-plan-button"]'),
        cancelPlanButton: () => wrapper.find('[data-test="delivery-plan/cancel-plan-button"]'),
        cancelPlanConfirmationModal: () => wrapper.findComponent(ConfirmationModal),
    };

    beforeEach(() => {
        ({ store, deliveryPlanModule } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                id: 1000,
                viewType: ListViewTypeEnum.fcl,
                viewName: DeliveryPlanningViewNameEnum.DP_ManagePlan,
                details: {
                    result: {},
                },
            },
        });
    });

    describe('default', () => {
        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(6);
        });

        it('fetches delivery plan on component created', () => {
            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN]).toHaveBeenCalledTimes(1);
        });

        it('resets delivery plan state on component destroy', () => {
            wrapper.destroy();

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.RESET_STATE]).toHaveBeenCalledTimes(1);
        });
    });

    describe('Select Transport Details', () => {
        it('renders section', () => {
            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(0);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('DELIVERY_PLAN.SELECT_TRANSPORT_DETAILS');
        });
    });

    describe('Select transport leg(s)', () => {
        it('renders section', () => {
            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(1);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('DELIVERY_PLAN.SELECT_TRANSPORT_LEG(S)');

            const addDeliveryLegButton = wrapperFind.addDeliveryLegButton();
            expect(addDeliveryLegButton.exists()).toBeTruthy();
        });

        it('renders active delivery legs', () => {
            const deliveryLegComponents = wrapperFind.deliveryLegComponents();
            expect(deliveryLegComponents.length).toBe(2);

            const legAtIndex0 = deliveryLegComponents.at(0);
            expect(legAtIndex0.props('isFirstLeg')).toBe(true);
            expect(legAtIndex0.props('isLastLeg')).toBe(false);

            const legAtIndex1 = deliveryLegComponents.at(1);
            expect(legAtIndex1.props('isFirstLeg')).toBe(false);
            expect(legAtIndex1.props('isLastLeg')).toBe(true);
        });

        it('adds delivery leg on click of add leg button', async () => {
            await wrapperFind.addDeliveryLegButton().vm.$emit('click');

            await expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.ADD_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
        });
    });

    describe('Add Empty Return Details', () => {
        it('renders section', async () => {
            await wrapper.setProps({
                viewType: ListViewTypeEnum.fcl,
            });

            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(2);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('DELIVERY_PLAN.ADD_EMPTY_RETURN_DETAILS');
        });

        it('does not render section when viewType is lcl', async () => {
            await wrapper.setProps({
                viewType: ListViewTypeEnum.lcl,
            });

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(5);
        });

        it('does not render section when activeDeliveryLegs is not present', async () => {
            await wrapper.setProps({
                viewType: ListViewTypeEnum.fcl,
            });

            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({ serviceLegs: [] });
            await localVue.nextTick();

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(3);
        });

        it('does not render section when activeEmptyReturnLeg is not present', async () => {
            await wrapper.setProps({
                viewType: ListViewTypeEnum.fcl,
            });

            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({ serviceLegs: [createMockServiceLeg()] });
            await localVue.nextTick();

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(3);
        });
    });

    describe('Additional Reference', () => {
        it('renders section', () => {
            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(3);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('DELIVERY_PLAN.ADDITIONAL_REFERENCE(S)');
        });

        it('does not render section when additionalReference is not present', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].additionalReference.response = [];
            await localVue.nextTick();

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(5);
        });
    });

    describe('Cancelled Legs', () => {
        it('renders section', () => {
            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(4);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('');

            const cancelledLegsInfoMessageNotification = wrapperFind.cancelledLegsInfoMessageNotification();
            expect(cancelledLegsInfoMessageNotification.exists()).toBeTruthy();
        });

        it('does not render section when cancelled legs is not present', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    }),
                    createMockServiceLeg({
                        sequence: 100,
                        serviceLegId: 2002,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.REJECTED,
                    }),
                ],
            });
            await localVue.nextTick();

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(5);
        });

        it('renders cancelled legs pending save notification message when any leg is having statusBeforeAction as CANCELLED', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.CANCELLED,
                        statusBeforeAction: ServiceLegStatusEnum.CANCELLED,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        status: ServiceLegStatusEnum.CANCELLED,
                        statusBeforeAction: ServiceLegStatusEnum.CANCELLED,
                    }),
                ],
            });
            await localVue.nextTick();

            const cancelledLegsInfoMessageNotification = wrapperFind.cancelledLegsInfoMessageNotification();
            expect(cancelledLegsInfoMessageNotification.attributes('heading')).toEqual('MESSAGE.CANCELLED_LEGS_PENDING_SAVE_INFO_MESSAGE');
        });

        it('renders cancelled legs notification message when none of the is having statusBeforeAction as CANCELLED', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.CANCELLED,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        status: ServiceLegStatusEnum.CANCELLED,
                    }),
                ],
            });
            await localVue.nextTick();

            const cancelledLegsInfoMessageNotification = wrapperFind.cancelledLegsInfoMessageNotification();
            expect(cancelledLegsInfoMessageNotification.attributes('heading')).toEqual('MESSAGE.CANCELLED_LEGS_INFO_MESSAGE');
        });
    });

    describe('Rejected Legs', () => {
        it('renders section', () => {
            const deliveryPlanSectionComponent = wrapperFind.deliveryPlanSectionComponents().at(4);
            expect(deliveryPlanSectionComponent.exists()).toBeTruthy();
            expect(deliveryPlanSectionComponent.props('title')).toBe('');

            const rejectedLegsInfoMessageNotification = wrapperFind.rejectedLegsInfoMessageNotification();
            expect(rejectedLegsInfoMessageNotification.exists()).toBeTruthy();
        });

        it('does not render section when rejected legs is not present', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    }),
                    createMockServiceLeg({
                        sequence: 100,
                        serviceLegId: 2001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.CANCELLED,
                    }),
                ],
            });
            await localVue.nextTick();

            expect(wrapperFind.deliveryPlanSectionComponents().length).toBe(5);
        });

        it('renders rejected legs pending save notification message when any leg is having statusBeforeAction as REJECTED', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.REJECTED,
                        statusBeforeAction: ServiceLegStatusEnum.REJECTED,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        status: ServiceLegStatusEnum.REJECTED,
                        statusBeforeAction: ServiceLegStatusEnum.REJECTED,
                    }),
                ],
            });
            await localVue.nextTick();

            const rejectedLegsInfoMessageNotification = wrapperFind.rejectedLegsInfoMessageNotification();
            expect(rejectedLegsInfoMessageNotification.attributes('heading')).toEqual('MESSAGE.REJECTED_LEGS_PENDING_SAVE_INFO_MESSAGE');
        });

        it('renders rejected legs notification message when none of the legs is having statusBeforeAction as REJECTED', async () => {
            store.state[DELIVERY_PLAN_NAMESPACE].deliveryPlan.response = createMockServicePlan({
                serviceLegs: [
                    createMockServiceLeg({
                        sequence: 101,
                        serviceLegId: 1001,
                        legType: ServiceLegTypeEnum.SERVICE_LEG,
                        status: ServiceLegStatusEnum.REJECTED,
                    }),
                    createMockServiceLeg({
                        sequence: 1000,
                        serviceLegId: 1999,
                        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                        status: ServiceLegStatusEnum.REJECTED,
                    }),
                ],
            });
            await localVue.nextTick();

            const rejectedLegsInfoMessageNotification = wrapperFind.rejectedLegsInfoMessageNotification();
            expect(rejectedLegsInfoMessageNotification.attributes('heading')).toEqual('MESSAGE.REJECTED_LEGS_INFO_MESSAGE');
        });
    });

    describe('Actions', () => {
        it('saves delivery plan on click of save plan button', async () => {
            await wrapperFind.savePlanButton().vm.$emit('click');

            await expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN]).toHaveBeenCalledTimes(1);
        });

        it('saves delivery plan if validation error is not there on click of send plan button', async () => {
            await wrapperFind.sendPlanButton().vm.$emit('click');
            await wrapper.vm.$nextTick();
            await flushPromises();

            expect(await deliveryPlanModule.actions[DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN]).toHaveBeenCalledTimes(1);
        });

        it('shows the cancel plan confirmation modal upon clicking the Cancel plan button', async () => {
            const confirmModal = wrapperFind.cancelPlanConfirmationModal();
            const button = wrapperFind.cancelPlanButton();

            button.vm.$emit('click');
            await button.vm.$nextTick();

            expect(confirmModal.attributes('open')).toEqual('true');
        });

        it('does not show the cancel plan confirmation modal before clicking the Cancel plan button', async () => {
            const confirmModal = wrapperFind.cancelPlanConfirmationModal();
            expect(confirmModal.attributes('open')).not.toEqual('true');
        });

        it('cancels the delivery plan upon clicking Confirm in the cancel confirmation modal', async () => {
            const confirmModal = wrapperFind.cancelPlanConfirmationModal();
            confirmModal.vm.$emit('confirm');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN]).toHaveBeenCalledTimes(1);
        });

        it('does not cancel the delivery plan upon clicking Cancel in the cancel confirmation modal', async () => {
            const confirmModal = wrapperFind.cancelPlanConfirmationModal();
            confirmModal.vm.$emit('cancel');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN]).toHaveBeenCalledTimes(0);
        });
    });
});
