# BiometricAuthForm Component Documentation

## Overview
The BiometricAuthForm is a React component that provides a user interface for biometric authentication using phone numbers. It includes features like phone number validation, country selection, and status management.

## Installation

```bash
npm install ivalt-api-hook
```

## Basic Usage

```tsx
import { BiometricAuthForm } from 'ivalt-api-hook';

function App() {
  return (
    <BiometricAuthForm
      onSuccess={(userData) => {
        console.log('Authentication successful:', userData);
      }}
    />
  );
}
```

## Props

### Core Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onSuccess` | `(userData: any) => void` | No | - | Callback function called when authentication is successful |
| `onError` | `(error: Error) => void` | No | - | Callback function called when an error occurs |
| `onStatusChange` | `(status: string) => void` | No | - | Callback function called when authentication status changes |
| `onPhoneNumberChange` | `(phoneNumber: string, isValid: boolean) => void` | No | - | Callback function called when phone number changes |

### Customization Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `customErrorMessage` | `string` | No | "Please enter a valid phone number" | Custom error message for invalid phone numbers |
| `hideStatusMessage` | `boolean` | No | `false` | Hide the status message section |
| `className` | `string` | No | `''` | Additional CSS classes for the form container |
| `buttonText` | `string` | No | "Start Authentication" | Custom text for the submit button |
| `loadingText` | `string` | No | "Verifying..." | Custom text shown during authentication |
| `title` | `string` | No | "Biometric Authentication" | Form title (set to empty string to hide) |

## Examples

### Basic Implementation
```tsx
<BiometricAuthForm
  onSuccess={(userData) => {
    console.log('Success:', userData);
  }}
/>
```

### Full Implementation with All Props
```tsx
<BiometricAuthForm
  // Core callbacks
  onSuccess={(userData) => {
    console.log('Authentication successful:', userData);
  }}
  onError={(error) => {
    console.error('Authentication failed:', error);
  }}
  onStatusChange={(status) => {
    console.log('Current status:', status);
  }}
  onPhoneNumberChange={(number, isValid) => {
    console.log('Phone number:', number);
    console.log('Is valid:', isValid);
  }}

  // Customization
  customErrorMessage="Please enter a valid mobile number"
  hideStatusMessage={false}
  className="custom-form-class"
  buttonText="Verify Phone Number"
  loadingText="Processing..."
  title="Phone Verification"
/>
```

### Custom Error Handling
```tsx
<BiometricAuthForm
  onError={(error) => {
    // Custom error handling
    showErrorNotification(error.message);
    logErrorToService(error);
  }}
  customErrorMessage="Please provide a valid phone number to continue"
/>
```

### Custom Styling
```tsx
<BiometricAuthForm
  className="my-custom-form"
  hideStatusMessage={true}
  title="Secure Authentication"
/>
```

### Status Monitoring
```tsx
<BiometricAuthForm
  onStatusChange={(status) => {
    switch (status) {
      case 'polling':
        showLoadingIndicator();
        break;
      case 'success':
        hideLoadingIndicator();
        showSuccessMessage();
        break;
      case 'error':
        hideLoadingIndicator();
        showErrorMessage();
        break;
    }
  }}
/>
```

## Status Types

The component can have the following status types:

- `idle`: Initial state
- `polling`: Authentication in progress
- `success`: Authentication successful
- `error`: Authentication failed

## Styling

The component comes with default styles but can be customized using the following CSS classes:

- `.biometric-form-container`: Main container
- `.biometric-input`: Phone number input
- `.biometric-button`: Submit button
- `.status-message`: Status message container
- `.error`: Error state for input
- `.success`: Success state for status message
- `.polling`: Polling state for status message

## Best Practices

1. **Error Handling**
   ```tsx
   <BiometricAuthForm
     onError={(error) => {
       // Always handle errors appropriately
       logError(error);
       notifyUser(error.message);
     }}
   />
   ```

2. **Status Management**
   ```tsx
   <BiometricAuthForm
     onStatusChange={(status) => {
       // Update UI based on status
       updateUIState(status);
     }}
   />
   ```

3. **Phone Number Validation**
   ```tsx
   <BiometricAuthForm
     onPhoneNumberChange={(number, isValid) => {
       // Track phone number changes and validity
       if (!isValid) {
         showValidationMessage();
       }
     }}
   />
   ```

## Notes

- The component uses the `intl-tel-input` library for phone number input and validation
- All callbacks are optional
- The component is fully responsive and works on both mobile and desktop
- Custom styling can be applied through the `className` prop or by overriding the default CSS classes
