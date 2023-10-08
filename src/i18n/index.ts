/* istanbul ignore file */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import config from './config';

// register the vueI18n plugin
Vue.use(VueI18n);

// initialize
const vueI18nInstance = new VueI18n(config);

// export i18n instance
export default vueI18nInstance;
