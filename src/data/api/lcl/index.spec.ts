import axios from '@/data/axios';
import { IFclList } from '@/interfaces';
import { API_URLS } from '@/static';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LCL API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('List View', () => {
        it('getLclList', async () => {
            const data: IFclList = { result: [], resultTotalCount: 0, pageNumber: 1, pageSize: 10 };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getLclList();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_LCL_LIST(), {});

            expect(output).toEqual(data);
        });
    });
});
