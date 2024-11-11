import { BiometricAuthRequestParams, BiometricAuthResponse, BiometricResultResponse } from "./types";
export declare const requestBiometricAuth: (params: BiometricAuthRequestParams) => Promise<BiometricAuthResponse>;
export declare const checkBiometricResult: (mobileNumber: string) => Promise<BiometricResultResponse>;
