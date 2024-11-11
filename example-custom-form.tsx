import React, { useState } from "react";
import { useBiometricAuth } from "ivalt-react";
import { UserData } from "ivalt-react";

export const CustomAuthForm: React.FC = () => {
  const [phone, setPhone] = useState("");

  const handleSuccess = (userData: UserData) => {
    console.log("Authentication successful!", userData);
    // Handle success (e.g., redirect, show message)
  };

  const handleError = (error: Error) => {
    console.error("Authentication failed:", error);
    // Handle error (e.g., show error message)
  };

  const { status, error, startAuth, userData, isPolling } = useBiometricAuth({
    requestFrom: "CustomApp",
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAuth(phone);
  };

  return (
    <div className="custom-form">
      <form onSubmit={handleSubmit}>
        {/* Custom phone input implementation */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          disabled={isPolling}
        />

        <button type="submit" disabled={isPolling || !phone}>
          {isPolling ? "Verifying..." : "Authenticate"}
        </button>

        {/* Custom status display */}
        {status !== "idle" && (
          <div className="status">
            <p>Status: {status}</p>
            {error && <p className="error">{error.message}</p>}
          </div>
        )}

        {/* Custom success display */}
        {userData && (
          <div className="success">
            <h3>Welcome, {userData.name}!</h3>
            <p>Email: {userData.email}</p>
          </div>
        )}
      </form>
    </div>
  );
};
