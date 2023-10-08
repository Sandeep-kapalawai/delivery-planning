import { createMockServicePlan } from '@/mocks';
import { DeliveryPlanTypeEnum } from '@/static';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import DeliveryPlanTransportDetails from './delivery-plan-transport-details.vue';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DeliveryPlanTransportDetails, options);

describe('delivery-plan-transport-details', () => {
    let wrapper: Wrapper<Vue>;

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
                propsData: {
                    deliveryPlan: {
                        response: createMockServicePlan({
                            deliveryPlanType: DeliveryPlanTypeEnum.SINGLE_DROP,
                        }),
                    },
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });
    });
});
