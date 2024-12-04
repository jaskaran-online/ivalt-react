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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Biometric Authentication
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  id="phone"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
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
              className={`w-full py-3.5 px-4 rounded-lg text-white font-medium transition-all duration-300 ease-in-out shadow-sm
                ${status !== "polling"
                  ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
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
              <div className={`mt-6 p-4 rounded-lg ${status === "success" ? "bg-green-50" : status === "error" ? "bg-red-50" : "bg-blue-50"}`}>
                <div className={`text-center ${getStatusColor()}`}>
                  <p className="font-semibold text-lg capitalize">Status: {status}</p>
                  {error && <p className="text-red-500 mt-2">{error.message}</p>}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
