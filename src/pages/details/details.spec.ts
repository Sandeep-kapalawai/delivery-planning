import Vuex from 'vuex';
import { shallowMount, ThisTypedShallowMountOptions, createLocalVue, Wrapper } from '@vue/test-utils';
import Details from './details.vue';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
const router = new VueRouter();

const render = (options: ThisTypedShallowMountOptions<Vue>) =>
    shallowMount(Details, {
        ...options,
        router,
        mocks: {
            $route: {
                params: {
                    id: 1000,
                },
            },
        },
    });

describe('details-page', () => {
    let wrapper: Wrapper<any>;

    beforeEach(() => {
        wrapper = render({
            localVue,
        });
    });

    it('mounts component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
