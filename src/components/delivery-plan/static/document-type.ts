import i18n from '@/i18n';

export enum DocumentTypeEnum {
    CarrierBillOfLading = 'CARRIER_BILL_OF_LADING',
    OriginalBillOfLading = 'ORIGINAL_BILL_OF_LADING',
    HouseBillOfLading = 'HOUSE_BILL_OF_LADING',
    SeaWayBill = 'SEA_WAYBILL',
}

export function getDocumentTypeDisplayName(billType: DocumentTypeEnum): string {
    return {
        [DocumentTypeEnum.CarrierBillOfLading]: i18n.t('DOCUMENT_TYPE.CARRIER_BILL_OF_LADING').toString(),
        [DocumentTypeEnum.OriginalBillOfLading]: i18n.t('DOCUMENT_TYPE.ORIGINAL_BILL_OF_LADING').toString(),
        [DocumentTypeEnum.HouseBillOfLading]: i18n.t('DOCUMENT_TYPE.HOUSE_BILL_OF_LADING').toString(),
        [DocumentTypeEnum.SeaWayBill]: i18n.t('DOCUMENT_TYPE.SEA_WAYBILL').toString(),
    }[billType];
}
