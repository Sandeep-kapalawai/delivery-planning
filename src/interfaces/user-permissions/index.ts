import { UserPermissionUserGroupNameEnum } from '@/static';

export interface IAllowAccessForUserGroups {
    userGroupNames: Array<UserPermissionUserGroupNameEnum>;
    validateForInternalUsers: boolean;
}
