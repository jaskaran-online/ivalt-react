import { BiometricAuthHookConfig, BiometricAuthHookResult } from "../types";
export declare const useBiometricAuth: ({ pollingInterval, maxAttempts, requestFrom, onSuccess, onError, }: BiometricAuthHookConfig) => BiometricAuthHookResult;
