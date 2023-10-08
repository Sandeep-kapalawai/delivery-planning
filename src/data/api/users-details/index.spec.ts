import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { paramsSerializer } from 'destination/utilities';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('User Details API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getUserDetails', async () => {
        const data: Array<any> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getUserDetails();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_USER_DETAILS(), { paramsSerializer: paramsSerializer });

        expect(output).toEqual(data);
    });
});
