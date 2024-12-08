"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const kbRoutes_1 = __importDefault(require("./routes/kbRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/kb', kbRoutes_1.default);
// Start the server
const PORT = environment_1.CONFIG.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
// import express from 'express';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';
// import cors from "cors";
// const app = express();
// app.use(express.json());
// // Configure CORS
// app.use(cors());
// app.use('/api/kb', kbRoutes);
// async function startServer() {
//   app.listen(CONFIG.PORT, () => {
//     console.log(`Server is running on port ${CONFIG.PORT}`);
//   });
// }
// startServer().catch(console.error);
// export default app;
// import express from 'express';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';
// import cors from "cors";
// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: '*'
// }))
// app.use('/api/kb', kbRoutes);
// async function startServer() {
//   app.listen(CONFIG.PORT, () => {
//     console.log(`Server is running on port ${CONFIG.PORT}`);
//   });
// }
// startServer().catch(console.error);
// export default app;
// import express from 'express';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';
// import cors from "cors";
// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use('/api/kb', kbRoutes);
// async function startServer() {
//   app.listen(CONFIG.PORT, () => {
//     console.log(`Server is running on port ${CONFIG.PORT}`);
//   });
// }
// startServer().catch(console.error);
// export default app;
