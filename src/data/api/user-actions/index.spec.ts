import axios from '@/data/axios';
import { MOCK_DO_RESPONSE } from '@/mocks';
import { API_URLS } from '@/static';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('User Actions API', () => {
    describe('Update Details API', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        const data = [
            {
                cargoStuffingId: 278,
                pickupReference: 'Automated test PICKUP_REF',
                pickupReferenceExpiryDateTime: '2022-07-29T00:00:00',
                deliveryPriorityId: null,
                specialProgramId: null,
                emptyReturnReference: null,
                emptyReturnReferenceExpiryDateTime: null,
            },
        ];

        it('getDetails for when single equipment selected and no headers filters applied', async () => {
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getDetails({ params: { deliveryPlanIds: [123] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(), {
                params: { deliveryPlanIds: [123] },
            });
            expect(output).toEqual(data);
        });

        it('getDetails for when single equipment selected', async () => {
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getDetails({ params: { deliveryPlanIds: [123] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(), {
                params: { deliveryPlanIds: [123] },
            });
            expect(output).toEqual(data);
        });

        it('getDetails for when multiple equipments selected', async () => {
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getDetails({ params: { deliveryPlanIds: [123, 456, 789] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(), {
                params: { deliveryPlanIds: [123, 456, 789] },
            });
            expect(output).toEqual(data);
        });

        it('saveDetails for when single equipment selected', async () => {
            const data = {};
            mockedAxios.put.mockResolvedValue({ data });
            const payload = {
                cargoStuffingIds: [643],
                pickupReference: 'test3333343333',
                pickupReferenceExpiryDateTime: '2023-02-15',
                emptyReturnReference: null,
                emptyReturnReferenceExpiryDateTime: '2023-02-17',
                deliveryPriorityId: 64,
                specialProgramId: 1,
            };
            const output = await api.saveDetails(payload, {});

            expect(mockedAxios.put).toHaveBeenCalledTimes(1);
            expect(mockedAxios.put).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(), payload, {});
            expect(output).toEqual(data);
        });
    });

    describe('Priority list API', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it('get Delivery Programs', async () => {
            const data = {
                deliveryProgramGroups: [
                    {
                        programName: 'Black Friday',
                        priorities: [
                            {
                                deliveryPriorityId: 62,
                                priorityLevel: 1,
                                displayName: 'Black Friday',
                            },
                            {
                                deliveryPriorityId: 67,
                                priorityLevel: 2,
                                displayName: 'Black Friday But L2',
                            },
                            {
                                deliveryPriorityId: 68,
                                priorityLevel: 4,
                                displayName: 'Black Friday L4',
                            },
                        ],
                    },
                ],
            };
            mockedAxios.get.mockResolvedValue({ data });
            const output = await api.getDeliveryPrograms({ params: { deliveryPlanIds: [123] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_DELIVERY_PROGRAMS(), {
                params: {
                    deliveryPlanIds: [123],
                },
                paramsSerializer: undefined,
            });
            expect(output).toEqual(data);
        });

        it('get Special Programs', async () => {
            const data = {
                isDifferentCarriers: false,
                specialPrograms: [
                    {
                        specialProgramName: 'Special Program 1',
                        specialProgramId: 1,
                    },
                ],
            };

            mockedAxios.get.mockResolvedValue({ data });
            const output = await api.getSpecialPrograms({ params: { deliveryPlanIds: [123] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_SPECIAL_PROGRAMS(), {
                params: {
                    deliveryPlanIds: [123],
                },
                paramsSerializer: undefined,
            });
            expect(output).toEqual(data);
        });
    });

    describe('Delivery Orders list API', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it('getDeliveryOrders', async () => {
            const data = {
                header: {
                    cargoStuffingNumber: 'CLRE2466595',
                    consigneeName: 'HUFFY CORPORATION',
                    consigneeBECode: 'USHUFFYHQ',
                    carrierName: 'MAERSK LINE',
                    carrierCode: 'MAEU',
                },
                items: [],
                invalidItems: [],
                notChangedItems: [],
                missingFinalDeliveryLocations: [],
            };
            mockedAxios.get.mockResolvedValue({ data });
            const output = await api.getDeliveryOrders({ params: { cargoStuffingIds: [123] } });

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_DELIVERYORDERS(), {
                params: {
                    cargoStuffingIds: [123],
                },
            });
            expect(output).toEqual(data);
        });

        it('getReasonCodes', async () => {
            const data = [
                {
                    reasonCodeId: 999,
                    reasonCodeName: 'TEST_REASONCODE',
                },
            ];
            mockedAxios.get.mockResolvedValue({ data });
            const output = await api.getReasonCodes();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_REASONCODES(), {});
            expect(output).toEqual(data);
        });

        it('sendDeliveryOrders', async () => {
            const data = {};
            mockedAxios.post.mockResolvedValue({ data });
            const payload = Object.assign({ CargoStuffings: MOCK_DO_RESPONSE.items });
            const output = await api.sendDeliveryOrders(payload, {});

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(API_URLS.GET_DELIVERYORDERS(), payload, {});
            expect(output).toEqual(data);
        });
    });
});
