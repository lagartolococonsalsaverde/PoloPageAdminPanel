import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export const clearSession = () => {
    const pathname = window.location.pathname;
    // Cookies.remove();
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('refreshToken');
    window.location.href = '/login';

    if (pathname.startsWith('/dashboard')) {
        window.location.href = '/dashboard';
    } else {
        window.location.href = '/login';
    }
};

export const createHttpService = (baseURL = 'https://localhost:5000/') => {
    const controller = new AbortController();
    const instance = axios.create({
        baseURL,
        timeout: 50000,
        headers: {
            'Content-Type': 'application/json',
        },
        signal: controller.signal,
    });

    // Axios request interceptor
    instance.interceptors.request.use(
        (config) => {
            const accessToken = Cookies.get('token');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
                config.headers['Content-Type'] =
                    config.url?.includes('product/duplicatePrintifyProduct') || config.url?.includes('/attachment/upload') ||
                        (config.url?.includes('me/profileImage') && config.method === 'post')
                        ? 'multipart/form-data'
                        : 'application/json';
                config.headers['Accept'] = 'application/json';
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    // Axios response interceptor
    let refreshPromise = null;
    const clearPromise = () => { refreshPromise = null; };

    const refreshUserToken = async () => {
        try {
            const response = await instance.post('/refreshToken', { refreshToken: Cookies.get('refreshToken') });
            return response.data.responseData;
        } catch (error) {
            toast.info("Session timed out. Please sign in again.")
            clearSession()
            return {};
        }
    };

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const config = error.config;
            const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later.';
            const status = error?.response?.status;
            if (status === 401 && errorMessage === 'EXPIRED_TOKEN' && !config._retry) {
                config._retry = true;

                // Refresh Token logic 

                // toast.loading('Attempting to refresh token...');
                // if (!refreshPromise) {
                //     refreshPromise = refreshUserToken().finally(clearPromise);
                // }
                // const { token, refreshToken } = await refreshPromise;
                // if (token) {
                //     const cookieOption = {
                //         httpOnly: true,
                //         secure: process.env.NODE_ENV !== 'development',
                //         maxAge: 60 * 60 * 24 * 7,
                //         sameSite: 'strict', path: '/',
                //     }
                //     const decoded = jwtDecode(user?.data?.access_token);
                //     //////////.set('name', value)
                //     Cookies.set('token', user?.data?.access_token,
                //         ///Secure Cookie
                //         cookieOption
                //     );
                //     Cookies.set('refreshToken', user?.data?.refresh_token,
                //         ///Secure Cookie
                //         cookieOption
                //     );

                //     Cookies.set('userId', decoded.user_id);

                //     config.headers['Authorization'] = `Bearer ${token}`;
                //     toast.dismiss();
                //     return instance(config);
                // }

                clearSession()
            } else if (status) {
                toast.info(errorMessage);
                if (status === 401 || status === 440) {
                    // setTimeout(() => clearSession(), 3000);
                }
            }
            return Promise.reject(error);
        },
    );

    // API methods
    const get = async (path, config = {}) => {
        try {
            const response = await instance.get(path, config);
            const isSuccessCode = response.status >= 200 && response.status < 300;
            return {
                success: isSuccessCode,
                data: response.data.data,
                message: response.data.message,
                status: response.status,
            };
        } catch (error) {
            return handleErrorResponse(error);
        }
    };

    const post = async (path, data = {}, config = {}) => {
        try {
            const response = await instance.post(path, data, config);
            const isSuccessCode = response.status >= 200 && response.status < 300;
            return {
                success: isSuccessCode,
                data: response.data.data,
                message: response.data.message,
                status: response.status,
            };
        } catch (error) {
            return handleErrorResponse(error);
        }
    };

    const put = async (path, data = {}, config = {}) => {
        try {
            const response = await instance.put(path, data, config);
            const isSuccessCode = response.status >= 200 && response.status < 300;
            return {
                success: isSuccessCode,
                data: response.data.data,
                message: response.data.message,
                status: response.status,
            };
        } catch (error) {
            return handleErrorResponse(error);
        }
    };

    const patch = async (path, data = {}, config = {}) => {
        try {
            const response = await instance.patch(path, data, config);
            const isSuccessCode = response.status >= 200 && response.status < 300;
            return {
                success: isSuccessCode,
                data: response.data.data,
                message: response.data.message,
                status: response.status,
            };
        } catch (error) {
            return handleErrorResponse(error);
        }
    };

    const deleteMethod = async (path, config = {}) => {
        try {
            const response = await instance.delete(path, config);
            const isSuccessCode = response.status >= 200 && response.status < 300;
            return {
                success: isSuccessCode,
                data: response.data.data,
                message: response.data.message,
                status: response.status,
            };
        } catch (error) {
            return handleErrorResponse(error);
        }
    };

    const handleErrorResponse = (error) => {
        if (axios.isAxiosError(error)) {
            const errorMessageFromAPI = error.response?.data?.message;
            const status = error.response?.status ?? 500;
            return {
                success: false,
                message: errorMessageFromAPI || 'Sorry, something went wrong. Please try again later.',
                status,
            };
        } else {
            return { success: false, message: 'Internal Server Error', status: -1 };
        }
    };

    return {
        get,
        post,
        put,
        patch,
        deleteMethod,
    };
};
