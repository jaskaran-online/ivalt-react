import { initializeIValt, useBiometricAuth } from "ivalt-react";
import React from "react";

// Initialize the package with your configuration
initializeIValt({
  baseURL: "https://your-ivalt-api-url",
  apiKey: "your-api-key",
});

function BiometricAuthComponent() {
  const { status, error, startAuth, stopPolling, userData } = useBiometricAuth({
    pollingInterval: 2000,
    maxAttempts: 150,
    requestFrom: "MyAwesomeApp",
  });

  const handleStartAuth = () => {
    startAuth("1234567890");
  };

  return (
    <div>
      <button onClick={handleStartAuth}>Start Authentication</button>
      <p>Status: {status}</p>
      {error && <p>Error: {error.message}</p>}
      {userData && (
        <div>
          <h3>User Information:</h3>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Mobile: {userData.mobileNumber}</p>
        </div>
      )}
    </div>
  );
}
