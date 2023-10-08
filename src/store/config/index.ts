/* istanbul ignore file */
import { StoreOptions } from 'vuex';
import { IRootState } from '@/store/interfaces';
import modules from '../modules';

const config: StoreOptions<IRootState> = {
    strict: true,
    state() {
        // This is intentional
    },
    mutations: {},
    actions: {},
    modules,
};

export default config;
