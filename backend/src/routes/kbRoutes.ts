// src/routes/kbRoutes.ts

import express from 'express';
import { addKBEntry, getAllKB, searchKB } from '../controllers/kbController';

const router = express.Router();

router.post('/entries', addKBEntry);
router.get('/getAllEntries', getAllKB);
router.get('/search', searchKB);

export default router;
