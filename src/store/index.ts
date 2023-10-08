import Vue from 'vue';
import Vuex from 'vuex';
import config from './config';
import { IRootState } from '@/store/interfaces';

Vue.use(Vuex);

const store = new Vuex.Store<IRootState>(config);

export default store;
