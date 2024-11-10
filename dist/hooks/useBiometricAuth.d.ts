import { BiometricStatus } from "../types";
interface UseBiometricAuthProps {
    pollingInterval?: number;
    maxAttempts?: number;
}
export declare const useBiometricAuth: ({ pollingInterval, maxAttempts, }?: UseBiometricAuthProps) => {
    status: BiometricStatus;
    error: Error | null;
    startAuth: (mobileNumber: string) => Promise<void>;
    stopPolling: () => void;
};
export {};
