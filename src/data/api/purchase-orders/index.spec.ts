import axios from '@/data/axios';
import { API_URLS } from '@/static';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Purchase Order List API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getPOList', async () => {
        const data = { poskUs: [], filteredRecords: 0, stockKeepingUnitDataSummary: {}, totalRecords: 0 };
        mockedAxios.get.mockResolvedValue({ data });
        const output = await api.getPOList({});

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_PO_LIST(), {});
        expect(output).toEqual(data);
    });
});
