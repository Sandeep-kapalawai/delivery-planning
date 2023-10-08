import { NotificationAppearanceEnum } from '@/static';

export interface INotificationConfig {
    id?: string;
    appearance: NotificationAppearanceEnum;
    heading?: string;
    body?: Array<string>;
}
