import React, { useRef, useEffect, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import "../styles/biometric-form.css";
import { useBiometricAuth } from "../hooks/useBiometricAuth";

interface BiometricAuthFormProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: string) => void;
  onPhoneNumberChange?: (phoneNumber: string, isValid: boolean) => void;
  customErrorMessage?: string;
  hideStatusMessage?: boolean;
  className?: string;
  buttonText?: string;
  loadingText?: string;
  title?: string;
}

export const BiometricAuthForm: React.FC<BiometricAuthFormProps> = ({
  onSuccess,
  onError,
  onStatusChange,
  onPhoneNumberChange,
  customErrorMessage,
  hideStatusMessage = false,
  className = '',
  buttonText = 'Start Authentication',
  loadingText = 'Verifying...',
  title = 'Biometric Authentication'
}) => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [itiInstance, setItiInstance] = useState<any>(null);
  const [validationError, setValidationError] = useState<string>("");

  const { status, error, startAuth, userData } = useBiometricAuth({
    pollingInterval: 2000,
    maxAttempts: 150,
    requestFrom: "WebApp",
  });

  useEffect(() => {
    if (phoneInputRef.current) {
      const iti = intlTelInput(phoneInputRef.current, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/js/utils.js",
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: (callback) => {
          fetch("https://ipapi.co/json")
            .then((res) => res.json())
            .then((data) => callback(data.country_code))
            .catch(() => callback("us"));
        },
      });
      setItiInstance(iti);
      return () => { iti.destroy(); };
    }
  }, []);

  useEffect(() => {
    if (userData && onSuccess) {
      onSuccess(userData);
    }
  }, [userData, onSuccess]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  const handlePhoneChange = () => {
    if (itiInstance) {
      const number = itiInstance.getNumber();
      const isValid = itiInstance.isValidNumber();
      setPhoneNumber(number);
      setValidationError(isValid ? "" : customErrorMessage || "Please enter a valid phone number");
      
      if (onPhoneNumberChange) {
        onPhoneNumberChange(number, isValid);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itiInstance) {
      if (!itiInstance.isValidNumber()) {
        setValidationError(customErrorMessage || "Please enter a valid phone number");
        return;
      }
      const fullNumber = itiInstance.getNumber();
      try {
        await startAuth(fullNumber);
      } catch (err) {
        if (onError) {
          onError(err as Error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className={`biometric-form-container ${className}`}>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            {title}
          </h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="biometric-input-container">
              <input
                ref={phoneInputRef}
                type="tel"
                id="phone"
                className={`biometric-input ${validationError ? 'error' : ''}`}
                onChange={handlePhoneChange}
              />
            </div>
            {validationError && (
              <p className="text-sm text-red-500 mt-1">
                {validationError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "polling"}
            className="biometric-button"
          >
            {status === "polling" ? (
              <span className="flex items-center justify-center space-x-2">
                <span>{loadingText}</span>
              </span>
            ) : (
              buttonText
            )}
          </button>

          {!hideStatusMessage && status !== "idle" && (
            <div className={`status-message ${status}`}>
              <p className="font-semibold text-lg capitalize">Status: {status}</p>
              {error && <p className="mt-2">{error.message}</p>}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
