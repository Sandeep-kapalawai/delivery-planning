import Vue from 'vue';
import VueRouter from 'vue-router';
import config from './config';
import { beforeEachGuard } from './guards';

// assign router to the global scope
Vue.use(VueRouter);

// instantiate router
const router: VueRouter = new VueRouter(config);

// setup routing guard(s) for re-routing registered applications
// import your global navigation guards here...

router.beforeEach(beforeEachGuard);

// export router
export default router;
