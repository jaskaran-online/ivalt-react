import React, { useRef, useEffect, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.min.css";
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
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Biometric Authentication
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            ref={phoneInputRef}
            type="tel"
            id="phone"
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            onChange={handlePhoneChange}
          />
          {phoneNumber && (
            <p className="text-sm text-red-500 mt-1">
              Please enter a valid phone number
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "polling"}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ease-in-out
            ${status !== "polling"
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {status === "polling" ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : (
            "Start Authentication"
          )}
        </button>

        {status !== "idle" && (
          <div className={`mt-6 text-center ${getStatusColor()}`}>
            <p className="font-semibold text-lg">Status: {status}</p>
            {error && <p className="text-red-500 mt-2">{error.message}</p>}
          </div>
        )}
      </form>
    </div>
  );
};
