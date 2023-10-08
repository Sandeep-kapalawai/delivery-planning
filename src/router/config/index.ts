/* istanbul ignore file */
import { getBasePathForApplication } from 'destination/utilities';
import { MODE } from '@/static/environment';
import { RouterOptions } from 'vue-router';
import routes from '@/router/routes';

const options: RouterOptions = {
    mode: MODE === 'local' ? 'hash' : 'history',
    base: getBasePathForApplication({ applicationPath: 'deliveryplanning' }),
    routes,
};

export default options;
