import { ExportExcelTypeEnum } from '../static';
import { UserPermissionUserGroupNameEnum, UserPermissionV3Enum } from '@/static';

export interface IExportExcelOption {
    key: ExportExcelTypeEnum;
    fileName: string;
    label: string;
    allowAccessForUserGroups: {
        userGroupNames: Array<UserPermissionUserGroupNameEnum>;
        validateForInternalUsers: boolean;
    };
    requiredUserPermissionV3: UserPermissionV3Enum;
    actionMethod: () => void;
}
