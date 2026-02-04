import express from 'express';
import { getMyRecords, uploadRecord } from '../controllers/academicRecordController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyRecords);
router.post('/', protect, upload.single('file'), uploadRecord);

export default router;
