import VueRouter from 'vue-router';
import { Store } from 'vuex';
import VueI18n from 'vue-i18n';

export interface IAppContext {
    router: VueRouter;
    store: Store<unknown>;
    i18n: VueI18n;
}
