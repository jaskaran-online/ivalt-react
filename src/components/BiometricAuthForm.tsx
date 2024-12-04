import React, { useRef, useEffect, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
import { useBiometricAuth } from "../hooks/useBiometricAuth";

interface BiometricAuthFormProps {
  onSuccess?: (userData: any) => void;
}

export const BiometricAuthForm: React.FC<BiometricAuthFormProps> = ({
  onSuccess,
}) => {
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
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/js/utils.js",
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

      return () => {
        iti.destroy();
      };
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
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "polling":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Biometric Authentication
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            ref={phoneInputRef}
            type="tel"
            id="phone"
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handlePhoneChange}
          />
          {phoneNumber && (
            <p className="text-sm text-red-600">
              Please enter a valid phone number
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "polling"}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
            ${
              status !== "polling"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {status === "polling" ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            "Start Authentication"
          )}
        </button>

        {status !== "idle" && (
          <div className={`mt-4 text-center ${getStatusColor()}`}>
            <p className="font-medium">Status: {status}</p>
            {error && <p className="text-red-600 mt-1">{error.message}</p>}
          </div>
        )}

        {userData && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Authentication Successful
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Mobile: {userData.mobile}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
