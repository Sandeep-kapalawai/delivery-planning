export const MOCK_ORDER = {
    cargoStuffingId: 31323,
    cargoStuffingNumber: 'TESTONE1234568',
    deliveryOrderNumber: 'MDO23002502',
    hasDangerousGoods: false,
    hasGarmentOnHanger: false,
    isReefer: false,
    containerSize: '45HIGH',
    pickupLocationBeCode: 'NLROT00A',
    deliveryLocationBeCode: 'INBLR',
    transportModeType: 'Road - Live-Unload',
    plannedDeliveryDateTimes: [],
    version: 2,
};

export const MOCK_DO_RESPONSE = {
    header: {
        cargoStuffingNumber: 'TESTONE1234568',
        consigneeName: 'HUFFY CORPORATION',
        consigneeBECode: 'USHUFFYHQ',
        carrierName: 'AMERICAN PRESIDENT LINES',
        carrierCode: 'APLU',
    },
    items: [
        {
            transportProviderName: 'HUFFY CORPORATION',
            transportProviderCode: 'USHUFFYHQ',
            containersCount: 2,
            newOrders: [MOCK_ORDER],
            revisedOrders: [
                {
                    cargoStuffingId: 31323,
                    cargoStuffingNumber: 'TESTONE1234568',
                    deliveryOrderNumber: 'MDO22001050',
                    hasDangerousGoods: false,
                    hasGarmentOnHanger: false,
                    isReefer: false,
                    containerSize: '45HIGH',
                    pickupLocationBeCode: 'USLSATRM',
                    deliveryLocationBeCode: 'DKCPH004',
                    transportModeType: 'Road - Live-Unload,Road - Live-Unload,Road - Live-Unload,Road - Live-Unload,Road - Live-Unload,Road - Live-Unload',
                    plannedDeliveryDateTimes: [
                        {
                            dateTime: '2023-07-29T14:02:00',
                            timeZone: 'CET',
                        },
                        {
                            dateTime: '2023-10-15T15:00:00',
                            timeZone: 'CET',
                        },
                        {
                            dateTime: '2023-11-12T15:02:00',
                            timeZone: 'CET',
                        },
                        {
                            dateTime: '2025-07-09T13:00:00',
                            timeZone: 'CET',
                        },
                        {
                            dateTime: '2026-04-17T11:03:00',
                            timeZone: 'IST',
                        },
                        {
                            dateTime: '2026-07-03T04:32:00',
                            timeZone: 'IST',
                        },
                    ],
                    version: 7,
                },
                {
                    cargoStuffingId: 31323,
                    cargoStuffingNumber: 'TESTONE1234568',
                    deliveryOrderNumber: 'MDO23002502',
                    hasDangerousGoods: false,
                    hasGarmentOnHanger: false,
                    isReefer: false,
                    containerSize: '45HIGH',
                    pickupLocationBeCode: 'NLROT00A',
                    deliveryLocationBeCode: 'INBLR',
                    transportModeType: 'Road - Live-Unload',
                    plannedDeliveryDateTimes: [],
                    version: 2,
                },
            ],
            cancelledOrders: [MOCK_ORDER],
        },
    ],
    invalidItems: [],
    notChangedItems: [],
    missingFinalDeliveryLocations: [],
};

export const MOCK_REASON_CODES = [
    {
        reasonCodeId: 1,
        reasonCodeName: 'Test Reason Code 1',
    },
    {
        reasonCodeId: 2,
        reasonCodeName: 'Test Reason Code 2',
    },
    {
        reasonCodeId: 3,
        reasonCodeName: 'Test Reason Code 3',
    },
];

export const MOCK_SEND_DO = {
    CargoStuffings: [
        {
            transportProviderBeCode: 'MXHUFDLASHQ',
            cargoStuffingId: 260,
            cargoStuffingNumber: 'CLHU1234567',
            deliveryOrderNumber: 'MDO22001330',
            comment: 'dsfdsf',
        },
        {
            transportProviderBeCode: 'CASTIGA001HQ',
            cargoStuffingId: 260,
            cargoStuffingNumber: 'CLHU1234567',
            deliveryOrderNumber: null,
        },
    ],
};
