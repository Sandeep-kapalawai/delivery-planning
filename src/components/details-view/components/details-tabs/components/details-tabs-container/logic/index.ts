import { DetailsTabEnum } from '@/static';

export function calculateDetailsTabFromTabIndex(tabIndex: number) {
    switch (tabIndex) {
        case 2:
            return DetailsTabEnum.Comments;
        case 1:
            return DetailsTabEnum.FinOps;
        case 0:
        default:
            return DetailsTabEnum.PurchaseOrders;
    }
}
