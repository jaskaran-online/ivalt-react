export interface BiometricAuthRequestParams {
  mobileNumber: string;
  // Add any other required parameters
}

export interface BiometricAuthResponse {
  success: boolean;
  message: string;
  // Add other response fields
}

export interface BiometricResultResponse {
  success: boolean;
  authenticated: boolean;
  message: string;
  // Add other response fields
}

export type BiometricStatus =
  | "idle"
  | "requesting"
  | "polling"
  | "success"
  | "error";
