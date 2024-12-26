import axios, { AxiosInstance } from 'axios';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ACCESS_TOKEN, APP_STATE, REFRESH_TOKEN } from '../utils/constants';
import { getLocalStorageTTL, setLocalStorageTTL } from '../utils/local-storage';
export interface QueryParams {
    [key: string]: string | number | undefined;
}
export class Api {
    baseUrl = process.env.REACT_APP_BACKEND_URL_BASE;
    axiosInstance: AxiosInstance;
    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
        });
    }
    bearer: string | null = null;
    headers: AxiosRequestHeaders = {};
    setHeaders(headers: AxiosRequestHeaders) {
        this.headers = headers;
    }
    getHeaders(): AxiosRequestHeaders {
        return this.headers;
    }
    setAuth(bearer: string) {
        this.bearer = bearer;
    }
    setBaseUrl(url: string) {
        this.baseUrl = url;
    }
    async get(url: string, query?: QueryParams) {
        const result = await this.axiosInstance
            .get(this.baseUrl + url, {
                params: query,
                headers: this.getHeaders(),
            })
            .catch((error: any) => {
                return Promise.resolve(error.response);
            });
        return result;
    }
    async put(url: string, data?: any) {
        const result = await this.axiosInstance
            .put(this.baseUrl + url, data, {
                headers: this.getHeaders(),
            })
            .catch((error: any) => {
                return Promise.resolve(error.response);
            });
        return result;
    }
    async post(url: string, data?: any) {
        const result = await this.axiosInstance
            .post(this.baseUrl + url, data, {
                headers: this.getHeaders(),
            })
            .catch((error: any) => {
                return Promise.resolve(error.response);
            });
        return result;
    }

    async delete(url: string, query?: QueryParams) {
        const result = await this.axiosInstance
            .delete(this.baseUrl + url, {
                params: query,
                headers: this.getHeaders(),
            })
            .catch((error: any) => {
                return Promise.resolve(error.response);
            });
        return result;
    }
    public getAccessToken(): string {
        return getLocalStorageTTL(ACCESS_TOKEN);
    }

    protected clearLocalStorage(): void {
        localStorage.clear();
    }

    public setTokensFromResponse(response: AxiosResponse, rememberMe?: boolean): string {
        const accessToken = response.headers.accesstoken || response.data.accessToken;
        const oneHour = 3600000;
        if (accessToken) {
            if (rememberMe) {
                setLocalStorageTTL(ACCESS_TOKEN, accessToken);
            } else {
                setLocalStorageTTL(ACCESS_TOKEN, accessToken, oneHour);
            }
        }
        const refreshToken = response.headers.refreshtoken || response.data.RefreshToken;
        if (refreshToken) {
            if (rememberMe) {
                setLocalStorageTTL(REFRESH_TOKEN, refreshToken);
            } else {
                setLocalStorageTTL(REFRESH_TOKEN, refreshToken, oneHour);
            }
        }
        return accessToken;
    }
}
