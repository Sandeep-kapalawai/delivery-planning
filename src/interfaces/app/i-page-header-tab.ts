export interface IPageHeaderTab {
    label: string;
    active: boolean;
    actionMethod?: () => void;
    // Custom Properties used within Destination
    routes: Array<string>;
    defaultRoute: string;
}
