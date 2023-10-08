import Vue from 'vue';
import { shallowMount, createLocalVue, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import i18n from '@/i18n';
import home from '@/pages/home/home.vue';
import { ListViewTypeEnum } from '@/static';

const render = (options: ThisTypedShallowMountOptions<Vue>) => shallowMount(home, options);

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('home', () => {
    let wrapper: Wrapper<any>, router: VueRouter;

    const mockWrapper = (route?: string) => {
        router = new VueRouter({
            routes: [
                {
                    name: ListViewTypeEnum.fcl,
                    path: '/fcl',
                },
                {
                    name: ListViewTypeEnum.lcl,
                    path: '/lcl',
                },
            ],
        });

        router.replace({ name: route });
        wrapper = render({
            localVue,
            router,
            stubs: {
                'mc-tab-bar': true,
                'mc-tab': true,
            },
        });
    };
    
    beforeEach(() => {
        mockWrapper(ListViewTypeEnum.fcl);
    });

    it('mounts the component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
