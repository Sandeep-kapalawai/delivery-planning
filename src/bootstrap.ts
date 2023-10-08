/* istanbul ignore file */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import router from './router';
import store from './store';
import i18n from '@/i18n';
import initialize from './initialize';
import App from './app.vue';
import './styles/main.scss';

Vue.config.productionTip = false;

// application instantiation
export default initialize(window).then((): Vue => {
    const instance: Vue = new Vue({ router, store, i18n, render: (init: Function) => init(App) }).$mount('#app');
    console.debug('vue instantiated', instance);
    return instance;
});
