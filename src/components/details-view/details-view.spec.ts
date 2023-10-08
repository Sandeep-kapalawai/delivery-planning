import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import destinationUtilities from 'destination/utilities';
import DetailsView from './details-view.vue';
import HeaderSection from './components/header-section/header-section.vue';
import DetailsTabs from './components/details-tabs/details-tabs.vue';
import { ListViewTypeEnum, NotificationAppearanceEnum, NotificationComponentEnum } from '@/static';
import { IServicePlan } from '@/interfaces';
import { DetailsActionEnum, DetailsGetterEnum } from '@/store/static';
import { IRootState, IDetailsState } from '@/store/interfaces';
import deliveryPlan from '@/store/modules/delivery-plan';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE } from '@/store/modules/delivery-plan/static';
import { IState as IDeliveryPlanState } from '@/store/modules/delivery-plan/interfaces';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DetailsView, options);

const createStore = ({ namespace }: { namespace: string }) => {
    const detailsModule: Module<IDetailsState<any>, IRootState> = {
        namespaced: true,
        state: {
            details: {
                isFetching: false,
                result: {
                    // TODO
                },
            },
        },
        actions: {
            [DetailsActionEnum.RESET_STATE]: jest.fn(),
            [DetailsActionEnum.FETCH_DETAILS]: jest.fn(),
        },
        getters: {
            [DetailsGetterEnum.GET_DETAILS](state) {
                return state.details;
            },
        },
    };

    const deliveryPlanModule: Module<IDeliveryPlanState, IRootState> = {
        namespaced: true,
        state: {
            deliveryPlan: {
                isFetching: false,
                isSaving: false,
                isSending: false,
                response: {} as IServicePlan,
            },
            additionalReference: {
                isFetching: false,
                response: [],
                payload: new Map(),
            },
        },
        getters: deliveryPlan.getters,
    };

    const store = new Vuex.Store<any>({
        modules: {
            [namespace]: detailsModule,
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, detailsModule };
};

describe('details-view', () => {
    const MODULE_NAMESPACE = 'testDetails';
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, detailsModule: any;

    const wrapperFind = {
        headerSection: () => wrapper.findComponent(HeaderSection),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store, detailsModule } = createStore({ namespace: MODULE_NAMESPACE }));

            wrapper = render({
                localVue,
                store,
                propsData: {
                    id: 1000,
                    transportDocument: {},
                    viewType: ListViewTypeEnum.fcl,
                    viewModule: MODULE_NAMESPACE,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders HeaderSection', () => {
            expect(wrapperFind.headerSection()).toBeTruthy();
        });

        it('renders DetailsTabs', () => {
            expect(wrapper.findComponent(DetailsTabs)).toBeTruthy();
        });

        it('fetches details on component created', () => {
            expect(detailsModule.actions[DetailsActionEnum.FETCH_DETAILS]).toHaveBeenCalledTimes(1);
        });

        it('resets details state on component destroy', () => {
            wrapper.destroy();

            expect(detailsModule.actions[DetailsActionEnum.RESET_STATE]).toHaveBeenCalledTimes(1);
        });

        it('shows the success notification message', async () => {
            const spyAddNotification = jest.spyOn(destinationUtilities, 'addNotification');
            const headerSection = wrapperFind.headerSection();

            headerSection.vm.$emit('update-details');
            await wrapper.vm.$nextTick();

            expect(spyAddNotification).toBeCalledTimes(1);
            expect(spyAddNotification).toBeCalledWith(NotificationComponentEnum.DP_DETAILS_PAGE, {
                appearance: NotificationAppearanceEnum.success,
                heading: 'MESSAGE.UPDATE_DETAILS_SUCCESS',
                id: 'DP_UPDATE_DETAILS_SUCCESS',
            });
        });
    });
});
