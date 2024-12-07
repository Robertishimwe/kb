"use strict";
// src/routes/kbRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kbController_1 = require("../controllers/kbController");
const router = express_1.default.Router();
router.post('/entries', kbController_1.addKBEntry);
router.get('/getAllEntries', kbController_1.getAllKB);
router.get('/search', kbController_1.searchKB);
router.get('/testroute', kbController_1.getAllKB);
router.get('/test', (req, res) => {
    console.log("test");
});
exports.default = router;
