import { ListViewTypeEnum, UserPermissionUserGroupNameEnum, UserPermissionV3Enum } from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';

export interface IUserAction {
    id: string;
    isHidden?: boolean;
    label: string;
    icon?: string;
    type?: string;
    allowAccessForUserGroups: {
        userGroupNames: Array<UserPermissionUserGroupNameEnum>;
        validateForInternalUsers: boolean;
    };
    requiredUserPermissionV3: UserPermissionV3Enum;
    customLogic?: {
        [key in 'common' | ListViewTypeEnum]?: ({
            selectedRows,
            currentRow,
        }: {
            selectedRows: Map<number, IFclListItem | ILclListItem>;
            currentRow: IFclListItem | ILclListItem;
        }) => boolean;
    };
    actionMethod?: () => void;
    actionList?: Array<IUserActionListItem>;
}

export interface IUserActionListItem {
    label: string;
    icon?: string;
    actionMethod?: () => void;
}
