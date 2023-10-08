import { getIsImportExcelOptionVisible } from '.';
import * as destinationUtilities from 'destination/utilities';

describe('import-excel logic', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getIsImportExcelOptionVisible', () => {
        it('returns false when validateAccessForUserGroupsV3 is false', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(false);
            jest.spyOn(destinationUtilities, 'userHasRequiredPermissionV3').mockReturnValue(true);

            expect(getIsImportExcelOptionVisible()).toBeFalsy();
        });

        it('returns false when userHasRequiredPermissionV3 is false', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(true);
            jest.spyOn(destinationUtilities, 'userHasRequiredPermissionV3').mockReturnValue(false);

            expect(getIsImportExcelOptionVisible()).toBeFalsy();
        });

        it('returns false when both validateAccessForUserGroupsV3 and userHasRequiredPermissionV3 is true', () => {
            jest.spyOn(destinationUtilities, 'validateAccessForUserGroupsV3').mockReturnValue(true);
            jest.spyOn(destinationUtilities, 'userHasRequiredPermissionV3').mockReturnValue(true);

            expect(getIsImportExcelOptionVisible()).toBeTruthy();
        });
    });
});
