import i18n from '@/i18n';

export enum QuickFiltersEnum {
    Equipment = 'cargoStuffingNumber',
    PurchaseOrder = 'purchaseOrderNumber',
    Sku = 'stockKeepingUnitNumber',
    DeliveryReference = 'deliveryReference',
    Bl = 'transportDocumentNumber',
    DeliveryOrder = 'transportOrderNumber',
    SpecialProgram = 'specialProgram',
}

export function getQuickFilterDisplayName(quickFilter: QuickFiltersEnum): string {
    return {
        [QuickFiltersEnum.Equipment]: i18n.t('FIELD.EQUIPMENT').toString(),
        [QuickFiltersEnum.PurchaseOrder]: i18n.t('FIELD.PURCHASE_ORDER').toString(),
        [QuickFiltersEnum.Sku]: i18n.t('FIELD.SKU').toString(),
        [QuickFiltersEnum.DeliveryReference]: i18n.t('FIELD.DELIVERY_REFERENCE').toString(),
        [QuickFiltersEnum.Bl]: i18n.t('FIELD.BL').toString(),
        [QuickFiltersEnum.SpecialProgram]: i18n.t('FIELD.SPECIAL_PROGRAM').toString(),
        [QuickFiltersEnum.DeliveryOrder]: i18n.t('FIELD.DELIVERY_ORDER').toString(),
    }[quickFilter];
}

export enum QuickFiltersForTilesEnum {
    Plan = 'Plan',
    Monitor = 'Monitor',
}
