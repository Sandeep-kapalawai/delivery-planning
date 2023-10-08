import Vuex, { Module, Store } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import DetailsTabs from './details-tabs.vue';
import { IDetailsState, IRootState } from '@/store/interfaces';
import { NAMESPACE as COMMENTS_NAMESPACE, CommentsGetterEnum, CommentsActionEnum } from '@/store/modules/comments/static';
import { IState as ICommentsState } from '@/store/modules/comments/interfaces';
import { ListViewTypeEnum } from '@/static';
import { createMockCargoStuffingDetails } from '@/mocks';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(DetailsTabs, options);

const createStore = ({ namespace }: { namespace: string }) => {
    const commentsModule: Module<ICommentsState, IRootState> = {
        namespaced: true,
        state: {
            pagination: {
                limit: 10,
                page: 1,
            },
            appliedFilters: {},
            resolvedAppliedFilters: {},
            comments: {
                isFetching: false,
                result: [],
                resultTotalCount: 0,
            },
            addComment: {
                isRequestInProgress: false,
            },
        },
        getters: {
            [CommentsGetterEnum.GET_APPLIED_FILTERS](state) {
                return state.appliedFilters;
            },
            [CommentsGetterEnum.GET_COMMENTS](state) {
                return state.comments;
            },
            [CommentsGetterEnum.GET_ADD_COMMENT](state) {
                return state.addComment;
            },
        },
        actions: {
            [CommentsActionEnum.FETCH_COMMENTS]: jest.fn(),
            [CommentsActionEnum.LOAD_MORE_COMMENTS]: jest.fn(),
            [CommentsActionEnum.ADD_COMMENT]: jest.fn(),
            [CommentsActionEnum.SET_APPLIED_FILTERS]: jest.fn(),
        },
    };

    const detailsModule: Module<IDetailsState<any>, IRootState> = {
        namespaced: true,
        state: {
            details: {
                isFetching: false,
                result: {
                    transportDocumentId: 1000,
                    transportDocumentNumber: 'TEST_TRANSPORT_DOCUMENT_NUMBER',
                },
            },
        },
        modules: {
            [COMMENTS_NAMESPACE]: commentsModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [namespace]: detailsModule,
        },
    });

    return { store, detailsModule, commentsModule };
};

describe('comments-section', () => {
    const MODULE_NAMESPACE = 'testDetails';
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let commentsModule: any;

    const wrapperFind = {
        commentsComponent: () => wrapper.find('[data-test="comments-section/comments-component"]'),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store, commentsModule } = createStore({ namespace: MODULE_NAMESPACE }));

            wrapper = render({
                localVue,
                store,
                propsData: {
                    id: 1000,
                    viewType: ListViewTypeEnum.fcl,
                    viewModule: MODULE_NAMESPACE,
                    details: {
                        result: createMockCargoStuffingDetails(),
                    },
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
            expect(wrapperFind.commentsComponent().exists()).toBeFalsy();
        });

        it('dispatches FETCH_COMMENTS action on applied filter change', async () => {
            store.state[MODULE_NAMESPACE][COMMENTS_NAMESPACE].appliedFilters = { TEST_ID: 'TEST_VALUE' };
            await localVue.nextTick();

            expect(commentsModule.actions[CommentsActionEnum.FETCH_COMMENTS]).toBeCalledTimes(1);
        });
    });
});
