import { useState, useEffect, useCallback } from "react";
import { requestBiometricAuth, checkBiometricResult } from "../api";
import {
  BiometricStatus,
  UserData,
  BiometricAuthHookConfig,
  BiometricAuthHookResult,
} from "../types";
import axios from "axios";

export const useBiometricAuth = ({
  pollingInterval = 2000,
  maxAttempts = 150,
  requestFrom,
  onSuccess,
  onError,
}: BiometricAuthHookConfig): BiometricAuthHookResult => {
  const [status, setStatus] = useState<BiometricStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentMobileNumber, setCurrentMobileNumber] = useState<string>("");

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    setAttempts(0);
  }, []);

  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout>;

    const pollResult = async () => {
      try {
        const result = await checkBiometricResult(currentMobileNumber);

        if (result.authenticated) {
          setStatus("success");
          if (result.userData) {
            setUserData(result.userData);
            onSuccess?.(result.userData);
          }
          stopPolling();
          return;
        }

        setAttempts((prev) => {
          if (prev >= maxAttempts) {
            const timeoutError = new Error("Authentication timeout");
            setStatus("error");
            setError(timeoutError);
            onError?.(timeoutError);
            stopPolling();
            return prev;
          }
          return prev + 1;
        });
      } catch (err) {
        const error = err as Error;
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 422) {
            return; // Continue polling
          }
        }
        setStatus("error");
        setError(error);
        onError?.(error);
        stopPolling();
      }
    };

    if (isPolling && currentMobileNumber) {
      pollTimer = setInterval(pollResult, pollingInterval);
    }

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [
    isPolling,
    pollingInterval,
    maxAttempts,
    stopPolling,
    currentMobileNumber,
    onSuccess,
    onError,
  ]);

  const startAuth = async (mobileNumber: string) => {
    try {
      setStatus("requesting");
      setError(null);
      setUserData(null);
      setCurrentMobileNumber(mobileNumber);

      await requestBiometricAuth({ mobileNumber, requestFrom });

      setStatus("polling");
      setIsPolling(true);
    } catch (err) {
      const error = err as Error;
      setStatus("error");
      setError(error);
      onError?.(error);
    }
  };

  return {
    status,
    error,
    startAuth,
    stopPolling,
    userData,
    isPolling,
  };
};
