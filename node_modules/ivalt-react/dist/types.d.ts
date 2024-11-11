export interface BiometricAuthRequestParams {
    mobileNumber: string;
    requestFrom: string;
}
export interface BiometricAuthResponse {
    success: boolean;
    message: string;
}
export interface UserData {
    id: string;
    name: string;
    email: string;
    mobileNumber: string;
}
export interface BiometricResultResponse {
    success: boolean;
    authenticated: boolean;
    message: string;
    userData?: UserData;
}
export type BiometricStatus = "idle" | "requesting" | "polling" | "success" | "error";
export interface BiometricAuthHookResult {
    status: BiometricStatus;
    error: Error | null;
    startAuth: (mobileNumber: string) => Promise<void>;
    stopPolling: () => void;
    userData: UserData | null;
    isPolling: boolean;
}
export interface BiometricAuthHookConfig {
    pollingInterval?: number;
    maxAttempts?: number;
    requestFrom: string;
    onSuccess?: (userData: UserData) => void;
    onError?: (error: Error) => void;
}
