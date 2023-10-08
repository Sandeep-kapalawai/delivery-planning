//@ts-nocheck
import { userGroupsGuard, userPermissionsGuard } from '.';
import * as destinationUtilities from 'destination/utilities';
import { RouteNameEnum } from '@/router/routes';
import { UserPermissionUserGroupNameEnum } from '@/static';

describe('user permissions guard', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('userGroupsGuard', () => {
        it('does not redirect to unauthorized page if validateAccessForUserGroupsV3 returns true', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(true);
            const next = jest.fn();

            userGroupsGuard(
                {
                    fullPath: '',
                    meta: {
                        allowAccessForUserGroups: {
                            userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
                            validateForInternalUsers: false,
                        },
                    },
                },
                { fullPath: '' },
                next,
            );

            expect(next).toHaveBeenCalledTimes(0);
        });

        it('does not redirect to unauthorized page if validateAccessForUserGroupsV3 returns true', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(true);
            const next = jest.fn();

            userGroupsGuard({ fullPath: '' }, { fullPath: '' }, next);

            expect(next).toHaveBeenCalledTimes(0);
        });

        it('redirects to unauthorized page if validateAccessForUserGroupsV3 returns false', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(false);
            const next = jest.fn();

            userGroupsGuard(
                {
                    fullPath: '',
                    meta: {
                        allowAccessForUserGroups: {
                            userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
                            validateForInternalUsers: false,
                        },
                    },
                },
                { fullPath: '' },
                next,
            );

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith({ name: RouteNameEnum.UNAUTHORIZED });
        });

        it('redirects to unauthorized page if validateAccessForUserGroupsV3 returns false', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(false);
            const next = jest.fn();

            userGroupsGuard({ fullPath: '' }, { fullPath: '' }, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith({ name: RouteNameEnum.UNAUTHORIZED });
        });
    });

    describe('userPermissionsGuard', () => {
        it('does not redirect to unauthorized page if requiredUserPermissionV3 is valid', () => {
            jest.spyOn(destinationUtilities, 'userHasRequiredPermissionV3').mockReturnValue(true);
            const next = jest.fn();

            userPermissionsGuard({ fullPath: '', meta: { requiredUserPermissionV3: 'Read' } }, { fullPath: '' }, next);

            expect(next).toHaveBeenCalledTimes(0);
        });

        it('redirects to unauthorized page if requiredUserPermissionV3 is invalid', () => {
            jest.spyOn(destinationUtilities, 'userHasRequiredPermissionV3').mockReturnValue(false);
            const next = jest.fn();

            userPermissionsGuard({ fullPath: '', meta: { requiredUserPermissionV3: 'Read' } }, { fullPath: '' }, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith({ name: RouteNameEnum.UNAUTHORIZED });
        });
    });
});
