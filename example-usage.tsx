import React, { useState } from "react";
import { initializeIValt, BiometricAuthForm } from "ivalt-react";
import "ivalt-react/src/styles/biometric-form.css";

// Initialize the package with your configuration
initializeIValt({
  baseURL: "https://your-ivalt-api-url",
  apiKey: "your-api-key",
});

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // Handle successful authentication
  const handleAuthSuccess = (userData: any) => {
    console.log("Authentication successful:", userData);
    // Handle post-authentication logic here
  };

  // Handle authentication errors
  const handleAuthError = (error: Error) => {
    console.error("Authentication error:", error);
    // Handle error display or logging here
  };

  // Handle authentication status changes
  const handleStatusChange = (status: string) => {
    setIsLoading(status === 'polling');
    switch (status) {
      case 'polling':
        console.log('Verification in progress...');
        break;
      case 'success':
        console.log('Verification successful!');
        break;
      case 'error':
        console.log('Verification failed');
        break;
    }
  };

  // Handle phone number changes and validation
  const handlePhoneChange = (phoneNumber: string, isValid: boolean) => {
    console.log('Phone number:', phoneNumber);
    console.log('Is valid:', isValid);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <BiometricAuthForm
          // Core callbacks
          onSuccess={handleAuthSuccess}
          onError={handleAuthError}
          onStatusChange={handleStatusChange}
          onPhoneNumberChange={handlePhoneChange}
          
          // UI customization
          title="Phone Verification"
          buttonText="Verify Phone Number"
          loadingText="Verifying..."
          customErrorMessage="Please enter a valid phone number"
          
          // Additional options
          hideStatusMessage={false}
          className="custom-form"
        />
        
        {/* Optional loading indicator */}
        {isLoading && (
          <div className="mt-4 text-center text-gray-600">
            Verifying your phone number...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
