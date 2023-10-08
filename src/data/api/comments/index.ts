import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import { paramsSerializer } from 'destination/utilities';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { ICommentList, ICommentPayload } from '@/interfaces';

export const getComments = async (deliveryPlanId: number | string, config?: AxiosRequestConfig): Promise<ICommentList> => {
    const response = await axios.get(
        API_URLS.GET_COMMENTS(deliveryPlanId),
        merge(
            {
                paramsSerializer: paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const addComment = async (payload: ICommentPayload, config?: AxiosRequestConfig): Promise<ICommentList> => {
    const response = await axios.post(API_URLS.ADD_COMMENT(), payload, config);
    return response.data;
};

export default {
    getComments,
    addComment,
};
