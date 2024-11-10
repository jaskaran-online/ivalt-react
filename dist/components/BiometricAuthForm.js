"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricAuthForm = void 0;
var react_1 = __importStar(require("react"));
var intl_tel_input_1 = __importDefault(require("intl-tel-input"));
require("intl-tel-input/build/css/intlTelInput.css");
var ivalt_react_1 = require("ivalt-react");
var BiometricAuthForm = function (_a) {
    var onSuccess = _a.onSuccess;
    var phoneInputRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(""), phoneNumber = _b[0], setPhoneNumber = _b[1];
    var _c = (0, react_1.useState)(false), isValidNumber = _c[0], setIsValidNumber = _c[1];
    var _d = (0, react_1.useState)(null), itiInstance = _d[0], setItiInstance = _d[1];
    var _e = (0, ivalt_react_1.useBiometricAuth)({
        pollingInterval: 2000,
        maxAttempts: 150,
        requestFrom: "WebApp",
    }), status = _e.status, error = _e.error, startAuth = _e.startAuth, userData = _e.userData;
    (0, react_1.useEffect)(function () {
        if (phoneInputRef.current) {
            var iti_1 = (0, intl_tel_input_1.default)(phoneInputRef.current, {
                utilsScript: "node_modules/intl-tel-input/build/js/utils.js",
                separateDialCode: true,
                initialCountry: "auto",
                geoIpLookup: function (callback) {
                    fetch("https://ipapi.co/json")
                        .then(function (res) { return res.json(); })
                        .then(function (data) { return callback(data.country_code); })
                        .catch(function () { return callback("us"); });
                },
            });
            setItiInstance(iti_1);
            return function () {
                iti_1.destroy();
            };
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (userData && onSuccess) {
            onSuccess(userData);
        }
    }, [userData, onSuccess]);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var fullNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!(itiInstance && isValidNumber)) return [3 /*break*/, 2];
                    fullNumber = itiInstance.getNumber();
                    return [4 /*yield*/, startAuth(fullNumber)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handlePhoneChange = function () {
        if (itiInstance) {
            setPhoneNumber(itiInstance.getNumber());
            setIsValidNumber(itiInstance.isValidNumber());
        }
    };
    var getStatusColor = function () {
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
    return (react_1.default.createElement("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" },
        react_1.default.createElement("h2", { className: "text-2xl font-bold mb-6 text-gray-800" }, "Biometric Authentication"),
        react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
            react_1.default.createElement("div", { className: "space-y-2" },
                react_1.default.createElement("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700" }, "Phone Number"),
                react_1.default.createElement("input", { ref: phoneInputRef, type: "tel", id: "phone", className: "block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500", onChange: handlePhoneChange }),
                !isValidNumber && phoneNumber && (react_1.default.createElement("p", { className: "text-sm text-red-600" }, "Please enter a valid phone number"))),
            react_1.default.createElement("button", { type: "submit", disabled: !isValidNumber || status === "polling", className: "w-full py-3 px-4 rounded-md text-white font-medium transition-colors\n            ".concat(isValidNumber && status !== "polling"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed") }, status === "polling" ? (react_1.default.createElement("span", { className: "flex items-center justify-center" },
                react_1.default.createElement("svg", { className: "animate-spin h-5 w-5 mr-2", viewBox: "0 0 24 24" },
                    react_1.default.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                    react_1.default.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })),
                "Verifying...")) : ("Start Authentication")),
            status !== "idle" && (react_1.default.createElement("div", { className: "mt-4 text-center ".concat(getStatusColor()) },
                react_1.default.createElement("p", { className: "font-medium" },
                    "Status: ",
                    status),
                error && react_1.default.createElement("p", { className: "text-red-600 mt-1" }, error.message))),
            userData && (react_1.default.createElement("div", { className: "mt-6 p-4 bg-green-50 rounded-md" },
                react_1.default.createElement("h3", { className: "text-lg font-medium text-green-800 mb-2" }, "Authentication Successful"),
                react_1.default.createElement("div", { className: "space-y-2 text-sm text-green-700" },
                    react_1.default.createElement("p", null,
                        "Name: ",
                        userData.name),
                    react_1.default.createElement("p", null,
                        "Email: ",
                        userData.email),
                    react_1.default.createElement("p", null,
                        "Mobile: ",
                        userData.mobileNumber)))))));
};
exports.BiometricAuthForm = BiometricAuthForm;
