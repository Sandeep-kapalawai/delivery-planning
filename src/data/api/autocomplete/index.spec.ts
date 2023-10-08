import axios from '@/data/axios';
import { ILocationFullAddress, ITransportProvider } from '@/interfaces';
import { API_URLS } from '@/static';
import { paramsSerializer } from 'destination/utilities';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Autocomplete API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getLocationFullAddress', async () => {
        const data: Partial<Array<ILocationFullAddress>> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getLocationFullAddress({});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_LOCATION_FULL_ADDRESS(), {
            params: {
                limit: 10,
                page: 1,
            },
        });

        expect(output).toEqual(data);
    });

    it('getTransportProviders', async () => {
        const data: Partial<Array<ITransportProvider>> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getTransportProviders({});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_PARTIES(), {
            params: {
                limit: 10,
                page: 1,
            },
        });

        expect(output).toEqual(data);
    });

    it('getFiltersAutoComplete', async () => {
        const data: Partial<Array<any>> = [];
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getFiltersAutoComplete({});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_FILTERS_AUTOCOMPLETE(), {
            paramsSerializer: paramsSerializer,
        });

        expect(output).toEqual(data);
    });
});
