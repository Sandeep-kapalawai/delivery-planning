import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { clone } from 'lodash';
import DeliveryLegTransportSection from './delivery-leg-transport-section.vue';
import { ServicePlanTransportModeEnum } from '@/static';
import { IServiceLeg } from '@/interfaces';
import { IRootState } from '@/store/interfaces';
import { IState } from '@/store/modules/delivery-plan/interfaces';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { createMockServicePlan } from '@/mocks';

const localVue = createLocalVue();
localVue.use(Vuex);

const MOCK_SERVICE_PLAN = createMockServicePlan();
const MOCK_SERVICE_LEG = MOCK_SERVICE_PLAN.serviceLegs[0];

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DeliveryLegTransportSection, options);

const createStore = () => {
    const deliveryPlanModule: Module<Partial<IState>, IRootState> = {
        namespaced: true,
        state: {
            deliveryPlan: {
                isFetching: false,
                isSaving: false,
                isSending: false,
                response: MOCK_SERVICE_PLAN,
            },
        },
        mutations: {
            [DeliveryPlanMutationEnum.SET_TRANSPORT_MODE]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

describe('delivery-leg-transport-section', () => {
    let leg: IServiceLeg;
    const legIndex: number = 1;
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        transportModeSwitch: () => wrapper.find(`[data-test="leg/${legIndex}/transport/mode"]`),
        transportProviderPickerComponent: () => wrapper.find(`[data-test="leg/${legIndex}/transport/provider/transport-provider-picker"]`),
        transportProviderFieldComponent: () => wrapper.find(`[data-test="leg/${legIndex}/transport/provider/transport-provider-field"]`),
        additionalInstructionInput: () => wrapper.find(`[data-test="leg/${legIndex}/transport/additional-instruction"]`),
    };

    beforeEach(() => {
        leg = clone(MOCK_SERVICE_LEG);
        ({ store, deliveryPlanModule } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                leg,
                legIndex,
                isLegSent: false,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders transport mode switch field', () => {
        const transportModeSwitch = wrapperFind.transportModeSwitch();

        expect(transportModeSwitch.exists()).toBeTruthy();
        expect(transportModeSwitch.props('value')).toBe(leg.transportData.transportMode);
    });

    it('renders transport mode switch as disabled when leg status is SENT', async () => {
        await wrapper.setProps({ isLegSent: true });

        const transportModeSwitch = wrapperFind.transportModeSwitch();

        expect(transportModeSwitch.exists()).toBeTruthy();
        expect(transportModeSwitch.attributes('disabled')).toBe('true');
        expect(transportModeSwitch.props('value')).toBe(leg.transportData.transportMode);
    });

    it('triggers SET_TRANSPORT_MODE mutation on transport mode switch field input event', async () => {
        const value = ServicePlanTransportModeEnum.RAIL;
        const transportModeSwitch = wrapperFind.transportModeSwitch();
        await transportModeSwitch.vm.$emit('change', { value });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_MODE]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_MODE]).toHaveBeenCalledWith(expect.objectContaining({}), {
            leg,
            transportMode: value,
        });
    });

    it('renders transport provider picker', () => {
        const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();

        expect(transportProviderPickerComponent.exists()).toBeTruthy();
        expect(transportProviderPickerComponent.props('value')).toBe(leg.transportData.provider.providerBECode);
    });

    it('renders transport provider picker as disabled when leg status is SENT', async () => {
        await wrapper.setProps({ isLegSent: true });

        const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();

        expect(transportProviderPickerComponent.exists()).toBeTruthy();
        expect(transportProviderPickerComponent.attributes('disabled')).toBe('true');
        expect(transportProviderPickerComponent.props('value')).toBe(leg.transportData.provider.providerBECode);
    });

    it('triggers SET_TRANSPORT_PROVIDER mutation on transport provider picker change event', async () => {
        const value = { TEST_KEY: 'TEST_VALUE' };
        const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();
        await transportProviderPickerComponent.vm.$emit('change', value);

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledWith(expect.objectContaining({}), {
            leg,
            provider: value,
        });
    });

    it('renders transport provider field', () => {
        const transportProviderFieldComponent = wrapperFind.transportProviderFieldComponent();

        expect(transportProviderFieldComponent.exists()).toBeTruthy();
        expect(transportProviderFieldComponent.props('name')).toBe(leg.transportData.provider.providerName);
        expect(transportProviderFieldComponent.props('code')).toBe(leg.transportData.provider.providerBECode);
    });

    it('renders additional instruction field', () => {
        const additionalInstructionInput = wrapperFind.additionalInstructionInput();

        expect(additionalInstructionInput.exists()).toBeTruthy();
        expect((additionalInstructionInput.element as HTMLInputElement).value).toBe(leg.transportData.additionalInstruction);
    });

    it('triggers SET_ADDITIONAL_INSTRUCTION mutation on additional instruction field input event', async () => {
        const value = 'TEST_VALUE';
        const additionalInstructionInput = wrapperFind.additionalInstructionInput();
        await additionalInstructionInput.vm.$emit('input', { target: { value } });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]).toHaveBeenCalledWith(expect.objectContaining({}), {
            leg,
            additionalInstruction: value,
        });
    });
});
