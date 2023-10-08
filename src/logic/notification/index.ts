import { INotificationConfig } from '@/interfaces';
import { NotificationAppearanceEnum, NotificationComponentEnum } from '@/static';
import { addNotification } from 'destination/utilities';

export function showErrorNotification(message: string, component?: NotificationComponentEnum) {
    const config: INotificationConfig = {
        appearance: NotificationAppearanceEnum.error,
        heading: message,
    };
    addNotification(component || NotificationComponentEnum.DP_ROOT, config);
}
