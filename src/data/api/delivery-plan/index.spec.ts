import axios from '@/data/axios';
import { ICustomizableField, ICustomizableFieldPayload, IServicePlan, IServicePlanPayload } from '@/interfaces';
import { API_URLS, DeliveryPlanTypeEnum } from '@/static';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Delivery Plan API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getFCLServicePlans', async () => {
        const data: Partial<IServicePlan> = {};
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getFCLServicePlans(1000, {});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_UPDATE_FCL_SERVICE_PLANS(1000), {});

        expect(output).toEqual(data);
    });

    it('updateFCLServicePlans', async () => {
        const data = {};
        mockedAxios.post.mockResolvedValue({ data });

        const payload = { deliveryPlanType: DeliveryPlanTypeEnum.SINGLE_DROP } as IServicePlanPayload;
        const output = await api.updateFCLServicePlans(1000, payload, {});

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(API_URLS.GET_UPDATE_FCL_SERVICE_PLANS(1000), payload, {});

        expect(output).toEqual(data);
    });

    it('getCustomizableField', async () => {
        const data: Partial<Array<ICustomizableField>> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getCustomizableField({});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CUSTOMIZABLE_FIELD(), {});

        expect(output).toEqual(data);
    });

    it('updateCustomizableField', async () => {
        const data = {};
        mockedAxios.post.mockResolvedValue({ data });

        const payload: { customizableFields: Array<ICustomizableFieldPayload> } = { customizableFields: [] };
        const output = await api.updateCustomizableField(payload);

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(API_URLS.GET_UPDATE_CUSTOMIZABLE_FIELD(), { customizableFields: [] }, undefined);

        expect(output).toEqual(data);
    });
});
