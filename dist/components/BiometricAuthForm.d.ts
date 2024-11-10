import React from "react";
import "intl-tel-input/build/css/intlTelInput.css";
interface BiometricAuthFormProps {
    onSuccess?: (userData: any) => void;
}
export declare const BiometricAuthForm: React.FC<BiometricAuthFormProps>;
export {};
