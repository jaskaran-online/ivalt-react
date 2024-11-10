import { initializeIValt, useBiometricAuth } from "ivalt-react";
import React from "react";

// Initialize the package with your configuration
initializeIValt({
  baseURL: "https://your-ivalt-api-url",
  apiKey: "your-api-key",
});

function BiometricAuthComponent() {
  const { status, error, startAuth, stopPolling } = useBiometricAuth({
    pollingInterval: 2000, // Optional: default is 2000ms
    maxAttempts: 150, // Optional: default is 150 attempts (5 minutes)
  });

  const handleStartAuth = () => {
    startAuth("1234567890"); // Pass the mobile number
  };

  return (
    <div>
      <button onClick={handleStartAuth}>Start Authentication</button>
      <p>Status: {status}</p>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
