import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { paramsSerializer } from 'destination/utilities';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Permissions API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getCustomers', async () => {
        const data: Array<any> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getCustomers();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CUSTOMERS(), { paramsSerializer: paramsSerializer });

        expect(output).toEqual(data);
    });
});
