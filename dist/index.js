"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBiometricAuth = exports.initializeIValt = void 0;
var config_1 = require("./config");
Object.defineProperty(exports, "initializeIValt", { enumerable: true, get: function () { return config_1.initializeIValt; } });
var useBiometricAuth_1 = require("./hooks/useBiometricAuth");
Object.defineProperty(exports, "useBiometricAuth", { enumerable: true, get: function () { return useBiometricAuth_1.useBiometricAuth; } });
