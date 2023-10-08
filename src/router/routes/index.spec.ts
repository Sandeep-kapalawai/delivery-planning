import { mount, createLocalVue, MountOptions } from '@vue/test-utils';
import type { CreateElement, VNode } from 'vue';
import VueRouter from 'vue-router';

import routes from '@/router/routes';

type MockCompOpts = { name: string; render: (h: CreateElement) => VNode };

jest.mock(
    '@/pages/home/home.vue',
    (): MockCompOpts => ({
        name: 'home',
        render: (h) => h('div'),
    }),
);

const routerRenderer = {
    name: 'router-renderer',
    template: '<router-view />',
};

const setup = () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({ routes, mode: 'history' });

    return { localVue, router };
};

const render = (options: MountOptions<Vue>) => mount(routerRenderer, options);

describe('routes', () => {
    it('renders home page', () => {
        const wrapper = render(setup());

        expect(wrapper.findComponent({ name: 'home' }).exists()).toEqual(true);
    });
});
