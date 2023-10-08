import { Route } from 'vue-router';
import { ListViewTypeEnum } from '@/static';

export function calculateTabIndexFromCurrentRoute(currentRoute: Route): number {
    switch (currentRoute.name) {
        case ListViewTypeEnum.lcl:
            return 1;
        case ListViewTypeEnum.fcl:
        default:
            return 0;
    }
}

export function calculateListViewTypeFromTabIndex(tabIndex: number) {
    switch (tabIndex) {
        case 1:
            return ListViewTypeEnum.lcl;
        case 0:
        default:
            return ListViewTypeEnum.fcl;
    }
}
