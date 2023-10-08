import i18n from '@/i18n';

export function getDetailsTabs() {
    return [DetailsTabs.PURCHASE_ORDERS, DetailsTabs.FINOPS, DetailsTabs.COMMENTS];
}

class DetailsTabs {

    static PURCHASE_ORDERS: any = {
        id: 'purchase-orders',
        title: i18n.t('PURCHASE_ORDERS').toString(),
        icon: 'receipt',
        slot: 'panel',
    };

    static FINOPS: any = {
        id: 'finops',
        title: i18n.t('FINOPS').toString(),
        icon: 'dollar-circle',
        slot: 'panel',
    };

    static COMMENTS: any = {
        id: 'comments',
        title: i18n.t('COMMENTS').toString(),
        icon: 'comments',
        slot: 'panel',
    };

}
