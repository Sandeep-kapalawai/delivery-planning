import VueRouter from 'vue-router';
import router from '@/router';

describe('router index.js', () => {
    it('returns a router instance', () => {
        expect(router).toBeInstanceOf(VueRouter);
    });
});
