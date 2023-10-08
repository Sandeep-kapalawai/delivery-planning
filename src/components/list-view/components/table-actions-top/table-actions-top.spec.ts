import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import TableActionsTop from './table-actions-top.vue';
import PaginationComponent from '@/components/pagination/pagination.vue';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { ListViewTypeEnum } from '@/static';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(TableActionsTop, options);

describe('table-actions-top', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;

    const wrapperFind = {
        paginationComponent: () => wrapper.findComponent(PaginationComponent),
    };

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                localVue,
                store,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    listViewModule: FCL_LIST_NAMESPACE,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders pagination component', () => {
            const paginationComponent = wrapperFind.paginationComponent();

            expect(paginationComponent.exists()).toBeTruthy();
        });
    });
});
