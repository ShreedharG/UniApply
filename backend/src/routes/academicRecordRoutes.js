import express from 'express';
import { getMyRecords, uploadRecord, deleteRecord } from '../controllers/academicRecordController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyRecords);
router.post('/', protect, upload.single('file'), uploadRecord);
router.delete('/:id', protect, deleteRecord);

export default router;
