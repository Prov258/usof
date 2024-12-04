import axios from 'axios';
import { store } from '../store';
import { clearUserState, updateCredentials } from '../store/slices/authSlice';

const authAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

authAxios.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.get(`/auth/refresh`, {
                    baseURL: import.meta.env.VITE_API_URL,
                    withCredentials: true,
                });
                const { accessToken, user } = response.data;

                store.dispatch(updateCredentials({ token: accessToken, user }));

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                console.log('error');
                store.dispatch(clearUserState());
                // window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export default authAxios;
