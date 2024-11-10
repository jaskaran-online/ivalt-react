export interface BiometricAuthRequestParams {
  mobileNumber: string;
  requestFrom: string;
  // Add any other required parameters
}

export interface BiometricAuthResponse {
  success: boolean;
  message: string;
  // Add other response fields
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  // Add any other user fields you need
}

export interface BiometricResultResponse {
  success: boolean;
  authenticated: boolean;
  message: string;
  userData?: UserData; // Add user data to the response
}

export type BiometricStatus =
  | "idle"
  | "requesting"
  | "polling"
  | "success"
  | "error";

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
