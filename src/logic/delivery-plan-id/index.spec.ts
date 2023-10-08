import { ListViewTypeEnum } from '@/static';
import {
    getDeliveryPlanId,
    getMultipleDeliveryPlanId,
    getDeliveryPlanIdQueryParam,
    getMultipleDeliveryPlanIdQueryParam,
    getMultipleObjectIdQueryParam,
} from '.';

const MOCK_OBJECTS: Array<{ [key: string]: number | string }> = [
    {
        deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_1',
        cargoStuffingId: 1001,
        transportDocumentId: 2001,
    },
    {
        deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_2',
        cargoStuffingId: 1002,
        transportDocumentId: 2002,
    },
];

describe('delivery plan id logic', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('getDeliveryPlanId', () => {
        it.each([
            ['deliveryPlanId', ListViewTypeEnum.fcl],
            ['transportDocumentId', ListViewTypeEnum.lcl],
        ])('returns %s when viewType is %s', (propertyName: string, viewType: ListViewTypeEnum) => {
            expect(getDeliveryPlanId(viewType, MOCK_OBJECTS[0] as any)).toEqual(MOCK_OBJECTS[0][propertyName]);
        });
    });

    describe('getMultipleDeliveryPlanId', () => {
        it.each([
            ['deliveryPlanId', ListViewTypeEnum.fcl],
            ['transportDocumentId', ListViewTypeEnum.lcl],
        ])('returns %s when viewType is %s', (propertyName: string, viewType: ListViewTypeEnum) => {
            expect(getMultipleDeliveryPlanId(viewType, MOCK_OBJECTS as Array<any>)).toEqual(MOCK_OBJECTS.map((object) => object[propertyName]));
        });
    });

    describe('getDeliveryPlanIdQueryParam', () => {
        const MOCK_DELIVERY_PLAN_ID = 'TEST_DELIVERY_PLAN_ID_1';

        it.each([
            ['deliveryPlanId', ListViewTypeEnum.fcl],
            ['transportDocumentId', ListViewTypeEnum.lcl],
        ])('returns { %s } when viewType is %s', (propertyName: string, viewType: ListViewTypeEnum) => {
            expect(getDeliveryPlanIdQueryParam(viewType, MOCK_DELIVERY_PLAN_ID)).toEqual({ [propertyName]: MOCK_DELIVERY_PLAN_ID });
        });
    });

    describe('getMultipleDeliveryPlanIdQueryParam', () => {
        const MOCK_DELIVERY_PLAN_IDS = ['TEST_DELIVERY_PLAN_ID_1', 'TEST_DELIVERY_PLAN_ID_2'];

        it.each([
            ['deliveryPlanIds', ListViewTypeEnum.fcl],
            ['transportDocumentIds', ListViewTypeEnum.lcl],
        ])('returns { %s } when viewType is %s', (propertyName: string, viewType: ListViewTypeEnum) => {
            expect(getMultipleDeliveryPlanIdQueryParam(viewType, MOCK_DELIVERY_PLAN_IDS)).toEqual({ [propertyName]: MOCK_DELIVERY_PLAN_IDS });
        });
    });

    describe('getMultipleObjectIdQueryParam', () => {
        const MOCK_DELIVERY_PLAN_IDS = ['TEST_DELIVERY_PLAN_ID_1', 'TEST_DELIVERY_PLAN_ID_2'];

        it.each([
            ['deliveryPlanIds', ListViewTypeEnum.fcl],
            ['objectIds', ListViewTypeEnum.lcl],
        ])('returns { %s } when viewType is %s', (propertyName: string, viewType: ListViewTypeEnum) => {
            expect(getMultipleObjectIdQueryParam(viewType, MOCK_DELIVERY_PLAN_IDS)).toEqual({ [propertyName]: MOCK_DELIVERY_PLAN_IDS });
        });
    });
});
