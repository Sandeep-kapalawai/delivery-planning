import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Vuex, { Store, Module } from 'vuex';
import { clone, merge } from 'lodash';
import DeliveryLeg from './delivery-leg.vue';
import UpdateStatus from './components/update-status/update-status.vue';
import DeliveryLegPickupSection from './components/delivery-leg-pickup-section/delivery-leg-pickup-section.vue';
import DeliveryLegDeliverySection from './components/delivery-leg-delivery-section/delivery-leg-delivery-section.vue';
import DeliveryLegTransportSection from './components/delivery-leg-transport-section/delivery-leg-transport-section.vue';
import ConfirmationModal from '@/components/confirmation-modal/confirmation-modal.vue';
import { IRootState } from '@/store/interfaces';
import { IState } from '@/store/modules/delivery-plan/interfaces';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanActionEnum } from '@/store/modules/delivery-plan/static';
import { ServiceLegDirectionToMoveEnum, ServiceLegStatusEnum, ServiceLegTypeEnum } from '@/static';
import { IServiceLeg } from '@/interfaces';
import { createMockCargoStuffingDetails, createMockServicePlan, createMockServiceLeg } from '@/mocks';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        DeliveryLeg,
        merge(
            {
                stubs: {
                    TextField: true,
                    TextFieldWithColor: true,
                    UpdateStatus,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const createStore = () => {
    const deliveryPlanModule: Module<IState, IRootState> = {
        namespaced: true,
        actions: {
            [DeliveryPlanActionEnum.COPY_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.REMOVE_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.ACCEPT_DELIVERY_LEG]: jest.fn(),
            [DeliveryPlanActionEnum.REJECT_DELIVERY_LEG]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();
const MOCK_SERVICE_PLAN = createMockServicePlan();
MOCK_SERVICE_PLAN.serviceLegs = [
    createMockServiceLeg({
        sequence: 101,
        serviceLegId: 1001,
        legType: ServiceLegTypeEnum.SERVICE_LEG,
        status: ServiceLegStatusEnum.CREATED,
    }),
    createMockServiceLeg({
        sequence: 102,
        serviceLegId: 1002,
        legType: ServiceLegTypeEnum.SERVICE_LEG,
        status: ServiceLegStatusEnum.SENT,
    }),
    createMockServiceLeg({
        sequence: 1000,
        serviceLegId: 1999,
        legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
        status: ServiceLegStatusEnum.CREATED,
    }),
];
const MOCK_CREATED_SERVICE_LEG = MOCK_SERVICE_PLAN.serviceLegs[0];
const MOCK_SENT_SERVICE_LEG = MOCK_SERVICE_PLAN.serviceLegs[1];

describe('delivery-leg', () => {
    let leg: IServiceLeg;
    const legIndex: number = 1;
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        deliveryOrderTextField: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/delivery-order"]`),
        statusTextField: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/status"]`),
        versionTextField: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/version"]`),
        copyLegButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/actions/copy-leg-button"]`),
        cancelLegButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/actions/cancel-leg-button"]`),
        removeLegButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/actions/remove-leg-button"]`),
        moveLegUpButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/actions/move-leg-up-button"]`),
        moveLegDownButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/actions/move-leg-down-button"]`),
        deliveryLegPickupSectionComponents: () => wrapper.findComponent(DeliveryLegPickupSection),
        deliveryLegDeliverySectionComponents: () => wrapper.findComponent(DeliveryLegDeliverySection),
        deliveryLegTransportSectionComponents: () => wrapper.findComponent(DeliveryLegTransportSection),
        updateStatusLinkButton: (sequence: number) => wrapper.find(`[data-test="leg/${sequence}/header/status"]`),
        UpdateStatusModal: () => wrapper.findComponent(UpdateStatus),
        UpdateStatusButton: () => wrapper.find('[data-test="delivery-leg/UpdateStatusModal"]'),
        confirmationModal: () => wrapper.findComponent(ConfirmationModal),
    };

    describe('default', () => {
        beforeEach(() => {
            leg = clone(MOCK_CREATED_SERVICE_LEG);
            ({ store, deliveryPlanModule } = createStore());

            wrapper = render({
                localVue,
                store,
                propsData: {
                    details: MOCK_CARGO_STUFFING_DETAILS,
                    deliveryPlan: MOCK_SERVICE_PLAN,
                    leg,
                    legIndex,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
            expect(wrapperFind.deliveryLegPickupSectionComponents().exists()).toBeTruthy();
            expect(wrapperFind.deliveryLegDeliverySectionComponents().exists()).toBeTruthy();
            expect(wrapperFind.deliveryLegTransportSectionComponents().exists()).toBeTruthy();
        });

        it('renders copy leg button', () => {
            expect(wrapperFind.copyLegButton(legIndex).exists()).toBeTruthy();
        });

        it('dispatches COPY_DELIVERY_LEG action on click of copy leg button', async () => {
            await wrapperFind.copyLegButton(legIndex).vm.$emit('click');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.COPY_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
        });

        it('renders move leg up button', () => {
            expect(wrapperFind.moveLegUpButton(legIndex).exists()).toBeTruthy();
        });

        it('dispatches MOVE_DELIVERY_LEG action on click of move leg up button', async () => {
            await wrapperFind.moveLegUpButton(legIndex).vm.$emit('click');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]).toHaveBeenCalledWith(expect.any(Object), {
                leg,
                direction: ServiceLegDirectionToMoveEnum.UP,
            });
        });

        it('renders move leg down button', () => {
            expect(wrapperFind.moveLegDownButton(legIndex).exists()).toBeTruthy();
        });

        it('dispatches MOVE_DELIVERY_LEG action on click of move leg down button', async () => {
            await wrapperFind.moveLegDownButton(legIndex).vm.$emit('click');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]).toHaveBeenCalledWith(expect.any(Object), {
                leg,
                direction: ServiceLegDirectionToMoveEnum.DOWN,
            });
        });
    });

    describe('leg with status as created', () => {
        beforeEach(() => {
            leg = clone(MOCK_CREATED_SERVICE_LEG);
            ({ store, deliveryPlanModule } = createStore());
            wrapper = render({
                localVue,
                store,
                propsData: {
                    deliveryPlan: MOCK_SERVICE_PLAN,
                    leg,
                    legIndex,
                },
            });
        });

        it('does not render header fields', () => {
            expect(wrapperFind.deliveryOrderTextField(legIndex).exists()).toBeFalsy();
            expect(wrapperFind.statusTextField(legIndex).exists()).toBeFalsy();
            expect(wrapperFind.versionTextField(legIndex).exists()).toBeFalsy();
        });

        it('renders remove leg button', () => {
            expect(wrapperFind.removeLegButton(legIndex).exists()).toBeTruthy();
        });

        it('dispatches REMOVE_DELIVERY_LEG action on click of remove leg button', async () => {
            await wrapperFind.removeLegButton(legIndex).vm.$emit('click');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.REMOVE_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
        });

        it('does not render cancel leg button', () => {
            expect(wrapperFind.cancelLegButton(legIndex).exists()).toBeFalsy();
        });
    });

    describe('leg with status as sent', () => {
        beforeEach(() => {
            leg = clone(MOCK_SENT_SERVICE_LEG);
            ({ store, deliveryPlanModule } = createStore());
            wrapper = render({
                localVue,
                store,
                propsData: {
                    deliveryPlan: MOCK_SERVICE_PLAN,
                    leg,
                    legIndex,
                },
            });
        });

        it('renders header fields', () => {
            expect(wrapperFind.deliveryOrderTextField(legIndex).exists()).toBeTruthy();
            expect(wrapperFind.statusTextField(legIndex).exists()).toBeTruthy();
            expect(wrapperFind.versionTextField(legIndex).exists()).toBeTruthy();
        });

        it('renders cancel leg button', () => {
            expect(wrapperFind.cancelLegButton(legIndex).exists()).toBeTruthy();
        });

        it('does not render remove leg button', () => {
            expect(wrapperFind.removeLegButton(legIndex).exists()).toBeFalsy();
        });

        it('renders status link button', async () => {
            expect(wrapperFind.updateStatusLinkButton(legIndex).exists()).toBeTruthy();
        });
    });

    describe('cancel leg', () => {
        beforeEach(() => {
            leg = clone(MOCK_SENT_SERVICE_LEG);
            ({ store, deliveryPlanModule } = createStore());
            wrapper = render({
                localVue,
                store,
                propsData: {
                    deliveryPlan: MOCK_SERVICE_PLAN,
                    leg,
                    legIndex,
                },
            });
        });

        it('shows the confirmation modal when clicking the cancel leg button', async () => {
            const button = wrapperFind.cancelLegButton(legIndex);
            const modal = wrapperFind.confirmationModal();

            button.vm.$emit('click');
            await button.vm.$nextTick();

            expect(modal.attributes('open')).toEqual('true');
        });

        it('does not show the confirmation modal before clicking the cancel leg button', async () => {
            const modal = wrapperFind.confirmationModal();

            expect(modal.attributes('open')).not.toEqual('true');
        });

        it('dispatches the cancel leg action once the cancel is confirmed in the modal', () => {
            const modal = wrapperFind.confirmationModal();
            modal.vm.$emit('confirm');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG]).toHaveBeenCalledTimes(1);
        });

        it('closes the cancel confirmation modal upon confirm', () => {
            const modal = wrapperFind.confirmationModal();
            modal.vm.$emit('confirm');

            expect(modal.attributes('open')).not.toEqual('true');
        });

        it('does not dispatch the cancel leg action once the cancel is discarded in the modal', () => {
            const modal = wrapperFind.confirmationModal();
            modal.vm.$emit('cancel');

            expect(deliveryPlanModule.actions[DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG]).toHaveBeenCalledTimes(0);
        });

        it('closes the cancel confirmation modal upon discard', () => {
            const modal = wrapperFind.confirmationModal();
            modal.vm.$emit('cancel');

            expect(modal.attributes('open')).not.toEqual('true');
        });
    });
});
