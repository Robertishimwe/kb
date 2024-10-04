"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("./config/environment");
const kbRoutes_1 = __importDefault(require("./routes/kbRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/kb', kbRoutes_1.default);
async function startServer() {
    app.listen(environment_1.CONFIG.PORT, () => {
        console.log(`Server is running on port ${environment_1.CONFIG.PORT}`);
    });
}
startServer().catch(console.error);
exports.default = app;
