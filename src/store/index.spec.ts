import Vuex from 'vuex';

import store from '.';

describe('store index.js', () => {
    it('returns a store instance', () => {
        expect(store).toBeInstanceOf(Vuex.Store);
    });
});
