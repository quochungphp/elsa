import { getServerUrl } from "../utils/envs";
import { Api } from "./api";
import {
  AuthSigninPayloadDto,
  CommentResponseDto,
  UserResponseDto,
  UserSignUpPayloadDto,
} from "../domain/api-interface";
import { AxiosRequestHeaders } from "axios";
import store from "../reduxStore/store";
import { logout } from "../reduxStore/signin-request-by-password/sliceReducer";

class ServerApi extends Api {
  constructor() {
    super();
    this.baseUrl = getServerUrl();
    const headers = {
      "Content-Type": "application/json",
    } as AxiosRequestHeaders;

    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    this.setHeaders(headers);
  }
  async authSignIn(payload: AuthSigninPayloadDto): Promise<UserResponseDto> {
    const response = await this.post(`/users/login`, payload);
    const { rememberMe } = payload;
    this.setTokensFromResponse(response, rememberMe);
    return response.data;
  }
  async authLogout(): Promise<any> {
    const response = await this.delete(`/users/logout`);
    this.clearLocalStorage();
    return response.data;
  }

  async userSignUp(payload: UserSignUpPayloadDto): Promise<UserResponseDto> {
    const response = await this.post(`/users`, payload);
    this.setTokensFromResponse(response);
    return response.data;
  }

  async fetchComment(query: any): Promise<CommentResponseDto[]> {
    const response = await this.get(`/comments`, query);
    return response.data;
  }
}

const serverApi = new ServerApi();
serverApi.axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export { serverApi };
