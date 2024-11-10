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
    var _b = _a === void 0 ? {} : _a, _c = _b.pollingInterval, pollingInterval = _c === void 0 ? 2000 : _c, _d = _b.maxAttempts, maxAttempts = _d === void 0 ? 150 : _d;
    var _e = (0, react_1.useState)("idle"), status = _e[0], setStatus = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(false), polling = _g[0], setPolling = _g[1];
    var _h = (0, react_1.useState)(0), attempts = _h[0], setAttempts = _h[1];
    var stopPolling = (0, react_1.useCallback)(function () {
        setPolling(false);
        setAttempts(0);
    }, []);
    (0, react_1.useEffect)(function () {
        var pollTimer;
        var pollResult = function (mobileNumber) { return __awaiter(void 0, void 0, void 0, function () {
            var result, err_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.checkBiometricResult)(mobileNumber)];
                    case 1:
                        result = _d.sent();
                        if (result.authenticated) {
                            setStatus("success");
                            stopPolling();
                            return [2 /*return*/];
                        }
                        setAttempts(function (prev) {
                            if (prev >= maxAttempts) {
                                setStatus("error");
                                setError(new Error("Authentication timeout"));
                                stopPolling();
                                return prev;
                            }
                            return prev + 1;
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _d.sent();
                        if (axios_1.default.isAxiosError(err_1)) {
                            if (((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.status) === 422) {
                                // Continue polling
                                return [2 /*return*/];
                            }
                            if (((_b = err_1.response) === null || _b === void 0 ? void 0 : _b.status) === 403 || ((_c = err_1.response) === null || _c === void 0 ? void 0 : _c.status) === 404) {
                                setStatus("error");
                                setError(err_1);
                                stopPolling();
                                return [2 /*return*/];
                            }
                        }
                        setStatus("error");
                        setError(err_1);
                        stopPolling();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (polling) {
            pollTimer = setInterval(function () {
                pollResult("");
            }, pollingInterval);
        }
        return function () {
            if (pollTimer) {
                clearInterval(pollTimer);
            }
        };
    }, [polling, pollingInterval, maxAttempts, stopPolling]);
    var startAuth = function (mobileNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setStatus("requesting");
                    setError(null);
                    return [4 /*yield*/, (0, api_1.requestBiometricAuth)({ mobileNumber: mobileNumber })];
                case 1:
                    _a.sent();
                    setStatus("polling");
                    setPolling(true);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setStatus("error");
                    setError(err_2);
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
    };
};
exports.useBiometricAuth = useBiometricAuth;
