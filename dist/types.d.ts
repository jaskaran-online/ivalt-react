export interface BiometricAuthRequestParams {
    mobileNumber: string;
}
export interface BiometricAuthResponse {
    success: boolean;
    message: string;
}
export interface BiometricResultResponse {
    success: boolean;
    authenticated: boolean;
    message: string;
}
export type BiometricStatus = "idle" | "requesting" | "polling" | "success" | "error";
