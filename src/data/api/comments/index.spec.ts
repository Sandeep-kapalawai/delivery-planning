import axios from '@/data/axios';
import { ICommentList, ICommentPayload } from '@/interfaces';
import { API_URLS } from '@/static';
import { paramsSerializer } from 'destination/utilities';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Comments API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getFclList', async () => {
        const data: ICommentList = { result: [], resultTotalCount: 0, pageNumber: 1, pageSize: 10 };
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getComments(1000);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_COMMENTS(1000), { paramsSerializer: paramsSerializer });

        expect(output).toEqual(data);
    });

    it('addComment', async () => {
        const data = {};
        mockedAxios.post.mockResolvedValue({ data });

        const payload: ICommentPayload = { deliveryPlanId: 'TEST_123', content: 'TEST_CONTENT' };
        const output = await api.addComment(payload, {});

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(API_URLS.ADD_COMMENT(), payload, {});

        expect(output).toEqual(data);
    });
});
