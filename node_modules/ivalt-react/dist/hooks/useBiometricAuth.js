"use strict";
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
exports.useBiometricAuth = void 0;
var react_1 = require("react");
var api_1 = require("../api");
var axios_1 = __importDefault(require("axios"));
var useBiometricAuth = function (_a) {
    var _b = _a.pollingInterval, pollingInterval = _b === void 0 ? 2000 : _b, _c = _a.maxAttempts, maxAttempts = _c === void 0 ? 150 : _c, requestFrom = _a.requestFrom, onSuccess = _a.onSuccess, onError = _a.onError;
    var _d = (0, react_1.useState)("idle"), status = _d[0], setStatus = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(false), isPolling = _f[0], setIsPolling = _f[1];
    var _g = (0, react_1.useState)(0), attempts = _g[0], setAttempts = _g[1];
    var _h = (0, react_1.useState)(null), userData = _h[0], setUserData = _h[1];
    var _j = (0, react_1.useState)(""), currentMobileNumber = _j[0], setCurrentMobileNumber = _j[1];
    var stopPolling = (0, react_1.useCallback)(function () {
        setIsPolling(false);
        setAttempts(0);
    }, []);
    (0, react_1.useEffect)(function () {
        var pollTimer;
        var pollResult = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, err_1, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.checkBiometricResult)(currentMobileNumber)];
                    case 1:
                        result = _b.sent();
                        if (result.authenticated) {
                            setStatus("success");
                            if (result.userData) {
                                setUserData(result.userData);
                                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(result.userData);
                            }
                            stopPolling();
                            return [2 /*return*/];
                        }
                        setAttempts(function (prev) {
                            if (prev >= maxAttempts) {
                                var timeoutError = new Error("Authentication timeout");
                                setStatus("error");
                                setError(timeoutError);
                                onError === null || onError === void 0 ? void 0 : onError(timeoutError);
                                stopPolling();
                                return prev;
                            }
                            return prev + 1;
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        error_1 = err_1;
                        if (axios_1.default.isAxiosError(err_1)) {
                            if (((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.status) === 422) {
                                return [2 /*return*/]; // Continue polling
                            }
                        }
                        setStatus("error");
                        setError(error_1);
                        onError === null || onError === void 0 ? void 0 : onError(error_1);
                        stopPolling();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (isPolling && currentMobileNumber) {
            pollTimer = setInterval(pollResult, pollingInterval);
        }
        return function () {
            if (pollTimer) {
                clearInterval(pollTimer);
            }
        };
    }, [
        isPolling,
        pollingInterval,
        maxAttempts,
        stopPolling,
        currentMobileNumber,
        onSuccess,
        onError,
    ]);
    var startAuth = function (mobileNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setStatus("requesting");
                    setError(null);
                    setUserData(null);
                    setCurrentMobileNumber(mobileNumber);
                    return [4 /*yield*/, (0, api_1.requestBiometricAuth)({ mobileNumber: mobileNumber, requestFrom: requestFrom })];
                case 1:
                    _a.sent();
                    setStatus("polling");
                    setIsPolling(true);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    error_2 = err_2;
                    setStatus("error");
                    setError(error_2);
                    onError === null || onError === void 0 ? void 0 : onError(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return {
        status: status,
        error: error,
        startAuth: startAuth,
        stopPolling: stopPolling,
        userData: userData,
        isPolling: isPolling,
    };
};
exports.useBiometricAuth = useBiometricAuth;
