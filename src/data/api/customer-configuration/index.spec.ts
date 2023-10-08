import axios from '@/data/axios';
import { API_URLS } from '@/static';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Customer Configuration API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getCustomerConfiguration', async () => {
        const data = {};
        const customerBECode = 'TEST_CUSTOMER_BE_CODE';
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getCustomerConfiguration(customerBECode, {});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CUSTOMER_CONFIGURATIONS(customerBECode), {});

        expect(output).toEqual(data);
    });
});
