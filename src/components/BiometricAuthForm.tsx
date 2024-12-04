import React, { useRef, useEffect, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
import "../styles/biometric-form.css";
import { useBiometricAuth } from "../hooks/useBiometricAuth";

interface BiometricAuthFormProps {
  onSuccess?: (userData: any) => void;
}

export const BiometricAuthForm: React.FC<BiometricAuthFormProps> = ({ onSuccess }) => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [itiInstance, setItiInstance] = useState<any>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itiInstance) {
      const fullNumber = itiInstance.getNumber();
      await startAuth(fullNumber);
    }
  };

  const handlePhoneChange = () => {
    if (itiInstance) {
      setPhoneNumber(itiInstance.getNumber());
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success": return "text-green-500";
      case "error": return "text-red-500";
      case "polling": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="biometric-form-container">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          Biometric Authentication
        </h2>

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
                className={`biometric-input ${phoneNumber && !itiInstance?.isValidNumber() ? 'error' : ''}`}
                onChange={handlePhoneChange}
              />
            </div>
            {phoneNumber && !itiInstance?.isValidNumber() && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid phone number
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
                <span>Verifying...</span>
              </span>
            ) : (
              "Start Authentication"
            )}
          </button>

          {status !== "idle" && (
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
