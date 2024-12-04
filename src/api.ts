import axios from "axios";
import { getConfig } from "./config";
import {
  BiometricAuthRequestParams,
  BiometricAuthResponse,
  BiometricResultResponse,
} from "./types";

const createAxiosInstance = () => {
  const config = getConfig();
  return axios.create({
    baseURL: config.baseURL,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
    },
  });
};

export const requestBiometricAuth = async (
  params: BiometricAuthRequestParams
): Promise<BiometricAuthResponse> => {
  const api = createAxiosInstance();
  const response = await api.post<BiometricAuthResponse>(
    "/biometric-auth-request",
    params
  );
  return response.data;
};

export const checkBiometricResult = async (
  mobile: string
): Promise<BiometricResultResponse> => {
  const api = createAxiosInstance();
  const response = await api.post<BiometricResultResponse>(
    `/biometric-geo-fence-auth-results`,
    { mobile }
  );
  return response.data;
};
