import { useState, useEffect, useCallback } from "react";
import { requestBiometricAuth, checkBiometricResult } from "../api";
import { BiometricStatus } from "../types";
import axios from "axios";

interface UseBiometricAuthProps {
  pollingInterval?: number;
  maxAttempts?: number;
}

export const useBiometricAuth = ({
  pollingInterval = 2000,
  maxAttempts = 150, // 5 minutes with 2-second intervals
}: UseBiometricAuthProps = {}) => {
  const [status, setStatus] = useState<BiometricStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [polling, setPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const stopPolling = useCallback(() => {
    setPolling(false);
    setAttempts(0);
  }, []);
  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout>;

    const pollResult = async (mobileNumber: string) => {
      try {
        const result = await checkBiometricResult(mobileNumber);

        if (result.authenticated) {
          setStatus("success");
          stopPolling();
          return;
        }

        setAttempts((prev) => {
          if (prev >= maxAttempts) {
            setStatus("error");
            setError(new Error("Authentication timeout"));
            stopPolling();
            return prev;
          }
          return prev + 1;
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 422) {
            // Continue polling
            return;
          }
          if (err.response?.status === 403 || err.response?.status === 404) {
            setStatus("error");
            setError(err);
            stopPolling();
            return;
          }
        }
        setStatus("error");
        setError(err as Error);
        stopPolling();
      }
    };

    if (polling) {
      pollTimer = setInterval(() => {
        pollResult("");
      }, pollingInterval);
    }

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [polling, pollingInterval, maxAttempts, stopPolling]);

  const startAuth = async (mobileNumber: string) => {
    try {
      setStatus("requesting");
      setError(null);

      await requestBiometricAuth({ mobileNumber });

      setStatus("polling");
      setPolling(true);
    } catch (err) {
      setStatus("error");
      setError(err as Error);
    }
  };

  return {
    status,
    error,
    startAuth,
    stopPolling,
  };
};
