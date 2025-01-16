import { BaseQueryFn } from '@reduxjs/toolkit/query';
import api from './axios';
import { AxiosError, AxiosRequestConfig } from 'axios';

interface IAxiosBaseQueryFn {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
}

const axiosBaseQuery = (): BaseQueryFn<IAxiosBaseQueryFn, unknown, unknown> => {
    return async ({ url, method, body, params, headers }) => {
        try {
            const result = await api({
                url,
                method,
                data: body,
                params,
                headers,
            });

            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;

            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };
};

export default axiosBaseQuery;
