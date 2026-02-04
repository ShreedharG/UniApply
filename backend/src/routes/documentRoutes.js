import express from 'express';
import { uploadDocument, verifyDocument } from '../controllers/documentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadDocument);
router.put('/:id/verify', protect, admin, verifyDocument);

export default router;
