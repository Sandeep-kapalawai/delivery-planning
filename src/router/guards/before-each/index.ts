/* vue-router before each guard */
import { NavigationGuardNext, Route } from 'vue-router';
import { authenticationGuard, featureToggleGuard } from 'destination/router/guards';
import { userGroupsGuard, userPermissionsGuard } from '../user-permissions';
import { RouteNameEnum } from '../../routes';

export const beforeEachGuard = async (to: Route, from: Route, next: NavigationGuardNext) => {
    // exclude error page(s) from authorization
    if (to.name === RouteNameEnum.UNAUTHORIZED) return next();

    await authenticationGuard(to, from, next);
    userGroupsGuard(to, from, next);
    userPermissionsGuard(to, from, next);
    featureToggleGuard(to, from, next);
    next();
};
