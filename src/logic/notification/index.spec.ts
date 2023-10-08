import { INotificationConfig } from '@/interfaces';
import { showErrorNotification } from '.';
import { NotificationAppearanceEnum, NotificationComponentEnum } from '@/static';
import { addNotification } from 'destination/utilities';

jest.mock('destination/utilities', () => ({
    addNotification: jest.fn(),
}));

describe('Notification Logic', () => {
    describe('showErrorNotification', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('adds an error notification with default component', () => {
            const message = 'Test error message';
            const expectedConfig: INotificationConfig = {
                appearance: NotificationAppearanceEnum.error,
                heading: message,
            };

            showErrorNotification(message);

            expect(addNotification).toHaveBeenCalledTimes(1);
            expect(addNotification).toHaveBeenCalledWith(NotificationComponentEnum.DP_ROOT, expectedConfig);
        });

        it('adds an error notification with the given component', () => {
            const message = 'Test error message';
            const expectedConfig: INotificationConfig = {
                appearance: NotificationAppearanceEnum.error,
                heading: message,
            };

            showErrorNotification(message, NotificationComponentEnum.DP_DETAILS_PAGE);

            expect(addNotification).toHaveBeenCalledTimes(1);
            expect(addNotification).toHaveBeenCalledWith(NotificationComponentEnum.DP_DETAILS_PAGE, expectedConfig);
        });
    });
});
