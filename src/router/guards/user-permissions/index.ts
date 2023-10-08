/* vue-router user permissions guard */
import { NavigationGuardNext, Route } from 'vue-router';
import { validateAccessForUserGroupsV3, userHasRequiredPermissionV3 } from 'destination/utilities';
import { RouteNameEnum } from '@/router/routes';
import { UserPermissionV3BusinessCapabilityEnum } from '@/static';

export const userGroupsGuard = (to: Route, from: Route, next: NavigationGuardNext) => {
    if (!validateAccessForUserGroupsV3(to.meta?.allowAccessForUserGroups)) {
        next({ name: RouteNameEnum.UNAUTHORIZED });
    }
};

export const userPermissionsGuard = (to: Route, from: Route, next: NavigationGuardNext) => {
    if (!userHasRequiredPermissionV3(UserPermissionV3BusinessCapabilityEnum.Destination_Delivery_Planning, to.meta?.requiredUserPermissionV3)) {
        next({ name: RouteNameEnum.UNAUTHORIZED });
    }
};
