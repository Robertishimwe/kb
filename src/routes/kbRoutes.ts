// src/routes/kbRoutes.ts

import express from 'express';
import { addKBEntry, searchKB } from '../controllers/kbController';

const router = express.Router();

router.post('/entries', addKBEntry);
router.get('/search', searchKB);

export default router;