# iVALT React - Biometric Authentication Package

A flexible React hooks package for integrating iVALT biometric authentication into your React applications.

## INSTALLATION

To install the package, run one of the following commands:

```bash
npm install ivalt-react
# or
yarn add ivalt-react
# or
pnpm add ivalt-react
```

## Additional dependencies (only if using the pre-built form component):

If you want to use the pre-built form component with Tailwind CSS, install these required libraries:

```bash
npm install intl-tel-input tailwindcss postcss autoprefixer
```

## PACKAGE STRUCTURE

### `ivalt-react`

- **📂 api**
  - `index.ts`: ⚙️ Core API integration functions
- **📂 config**
  - `index.ts`: 🛠️ Configuration and setup management
- **📂 types**
  - `index.ts`: 📝 TypeScript type definitions
- **📂 hooks**
  - `useBiometricAuth.ts`: 🔐 Main authentication hook
- **📂 components**
  - `BiometricAuthForm.tsx`: 📝 Optional pre-built form component
- `index.ts`: 🚀 Main package exports

## BASIC SETUP

1. Initialize the package before use:

```javascript
const initializeIValt = require("ivalt-react").initializeIValt;

initializeIValt({
  baseURL: "https://your-ivalt-api-url",
  apiKey: "your-api-key",
});
```

2. If using the pre-built form component with Tailwind CSS, add to your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## USING THE HOOK

The useBiometricAuth hook provides all necessary functionality for authentication:

```javascript
const {
  status, // Current authentication status
  error, // Error object if any
  startAuth, // Function to start authentication
  stopPolling, // Function to stop polling
  userData, // User data after successful authentication
  isPolling, // Boolean indicating if currently polling
} = useBiometricAuth({
  requestFrom: "YourAppName", // Required: App identifier
  pollingInterval: 2000, // Optional: Default 2000ms
  maxAttempts: 150, // Optional: Default 150
  onSuccess: (userData) => {}, // Optional: Success callback
  onError: (error) => {}, // Optional: Error callback
});
```

## HOOK CONFIGURATION OPTIONS

- requestFrom: (Required) String - Application identifier
- pollingInterval: (Optional) Number - Polling interval in milliseconds (default: 2000)
- maxAttempts: (Optional) Number - Maximum polling attempts (default: 150)
- onSuccess: (Optional) Function - Callback for successful authentication
- onError: (Optional) Function - Callback for authentication errors

## AUTHENTICATION STATES

- idle: Initial state
- requesting: Authentication request is being sent
- polling: Waiting for user authentication
- success: Authentication successful
- error: Authentication failed

## TYPE DEFINITIONS

```javascript
interface UserData {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
}

interface BiometricAuthHookResult {
  status: BiometricStatus;
  error: Error | null;
  startAuth: (mobileNumber: string) => Promise<void>;
  stopPolling: () => void;
  userData: UserData | null;
  isPolling: boolean;
}
```

## EXAMPLE USAGE

```javascript
import { useBiometricAuth } from "ivalt-react";

function AuthComponent() {
const { status, error, startAuth, userData } = useBiometricAuth({
requestFrom: 'MyApp',
onSuccess: (data) => console.log('Success:', data),
onError: (err) => console.error('Error:', err)
});

    const handleSubmit = (phoneNumber) => {
        startAuth(phoneNumber);
    };

    return (
        // Your custom UI implementation
    );
}
```

## Example of using the pre-built form component:

```javascript
import { BiometricAuthForm } from "ivalt-react";

function App() {
  const handleAuthSuccess = (userData: any) => {
    console.log("Authentication successful:", userData);
  };

  return <BiometricAuthForm onSuccess={handleAuthSuccess} />;
}
```

## ERROR HANDLING

The hook handles various error scenarios:

- Network errors
- Authentication timeout (after maxAttempts)
- Invalid phone numbers
- Server errors

Errors are available through:

1. The error object in hook result
2. The onError callback function

## SECURITY BEST PRACTICES

1. Store API keys securely
2. Use HTTPS for all API communications
3. Implement proper session management
4. Follow security best practices for user data
5. Never store sensitive data in local storage
6. Always validate phone numbers before submission

## TROUBLESHOOTING

Common issues:

1. Authentication timeout: Check maxAttempts and pollingInterval
2. Network errors: Verify API endpoint and connectivity
3. Invalid phone format: Ensure proper phone number formatting
4. Configuration errors: Verify initializeIValt setup

For additional support:

- Check documentation at docs.ivalt.com
- Submit issues at https://github.com/iVALT-Inc/ivalt-react/issues
- Contact support at support@ivalt.com

---

## LICENSE

MIT License - See LICENSE file for details

Version: 1.0.4
Last Updated: 2024-11-11
