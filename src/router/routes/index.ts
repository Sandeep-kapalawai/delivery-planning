import { contextualRoutePrefix } from '@/utilities/path';
import { RouteConfig } from 'vue-router';
import Home from '@/pages/home/home.vue';
import { getBasePathForApplication } from 'destination/utilities';
import { UserPermissionUserGroupNameEnum, UserPermissionV3Enum, FeatureToggleEnum } from '@/static';
import { MODE } from '@/static/environment';

const Details = () => import('@/pages/details/details.vue');

export enum RouteNameEnum {
    Fcl = 'fcl',
    Lcl = 'lcl',
    FCL_DETAILS = 'FCL_DETAILS',
    LCL_DETAILS = 'LCL_DETAILS',
    UNAUTHORIZED = 'UNAUTHORIZED',
    PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
}

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: {
            name: RouteNameEnum.Fcl,
        },
    },
    {
        name: RouteNameEnum.Fcl,
        path: `${contextualRoutePrefix}/fcl`,
        component: Home,
        meta: {
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
        },
    },
    {
        name: RouteNameEnum.Lcl,
        path: `${contextualRoutePrefix}/lcl`,
        component: Home,
        meta: {
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Read,
            requiredFeatureToggle: {
                name: FeatureToggleEnum.DP_LCL_LISTVIEW,
                state: true,
            },
        },
    },
    {
        name: RouteNameEnum.FCL_DETAILS,
        path: `${contextualRoutePrefix}/fcl/:id`,
        component: Details,
        meta: {
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Edit,
        },
    },
    {
        name: RouteNameEnum.LCL_DETAILS,
        path: `${contextualRoutePrefix}/lcl/:id`,
        component: Details,
        meta: {
            allowAccessForUserGroups: {
                userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
                validateForInternalUsers: false,
            },
            requiredUserPermissionV3: UserPermissionV3Enum.Edit,
            requiredFeatureToggle: {
                name: FeatureToggleEnum.DP_LCL_LISTVIEW,
                state: true,
            },
        },
    },
    {
        name: RouteNameEnum.UNAUTHORIZED,
        path: '/unauthorized',
        component: () => import('destination/unauthorized-page'),
    },
    {
        name: RouteNameEnum.PAGE_NOT_FOUND,
        path: '*',
        redirect: {
            name: RouteNameEnum.Fcl,
        },
    },
];

if (MODE === 'local') {
    const BASE_PATH = getBasePathForApplication({ applicationPath: 'deliveryplanning' });
    routes.forEach((route) => {
        if (route.path === '*') {
            return;
        }

        route.path = `${BASE_PATH}${route.path}`;
    });
}

export default routes;
