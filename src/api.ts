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
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
  });
};

export const requestBiometricAuth = async (
  params: BiometricAuthRequestParams
): Promise<BiometricAuthResponse> => {
  const api = createAxiosInstance();
  const response = await api.post<BiometricAuthResponse>(
    "/biometric-geo-fence-auth-results",
    params
  );
  return response.data;
};

export const checkBiometricResult = async (
  mobileNumber: string
): Promise<BiometricResultResponse> => {
  const api = createAxiosInstance();
  const response = await api.post<BiometricResultResponse>(
    `/biometric-geo-fence-auth-results`,
    { mobileNumber }
  );
  return response.data;
};
