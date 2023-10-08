import { CONTEXT_PATH } from '@/static/environment';

const root = '/';
export const contextualRoutePrefix = (CONTEXT_PATH !== root) ? CONTEXT_PATH : '';

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
export const isAbsolutePath = (path: string) => {
    return isAbsoluteURLRegex.test(path);
};

export default {
    contextualRoutePrefix,
    isAbsolutePath,
};
