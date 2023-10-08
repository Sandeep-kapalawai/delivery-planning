import { validateAccessForUserGroupsV3, userHasRequiredPermissionV3 } from 'destination/utilities';
import { UserPermissionUserGroupNameEnum, UserPermissionV3Enum, UserPermissionV3BusinessCapabilityEnum } from '@/static';

export function getIsImportExcelOptionVisible(): boolean {
    if (
        !validateAccessForUserGroupsV3({
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        })
    ) {
        return false;
    } else if (!userHasRequiredPermissionV3(UserPermissionV3BusinessCapabilityEnum.Destination_Delivery_Planning, UserPermissionV3Enum.Edit)) {
        return false;
    }

    return true;
}
