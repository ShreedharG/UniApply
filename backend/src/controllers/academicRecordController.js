import { AcademicRecord } from '../models/index.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";
import path from 'path';

// @desc    Get user's academic records
// @route   GET /api/academic-records
// @access  Private (Student)
export const getMyRecords = async (req, res) => {
    try {
        const records = await AcademicRecord.find({ userId: req.user.id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload academic record
// @route   POST /api/academic-records
// @access  Private (Student)
export const uploadRecord = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;

        console.log("Upload Record Attempt:", { userId: req.user.id, type, fileOriginalName: file?.originalname });

        if (!file) {
            console.log("No file in request");
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (!['10TH_MARKSHEET', '12TH_MARKSHEET'].includes(type)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        // Check if record exists, update or create
        let record = await AcademicRecord.findOne({ userId: req.user.id, type });

        // Generate unique filename
        const fileName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;

        // Upload to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `academic-records/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construct S3 URL
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/academic-records/${fileName}`;

        if (record) {
            record.documentUrl = s3Url;
            record.fileName = file.originalname;
            record.uploadedAt = Date.now();
            // Reset verification status for new upload
            record.aiScoreVerification = {
                status: 'PENDING',
                flags: [],
                extractedData: {}
            };
            await record.save();
        } else {
            record = await AcademicRecord.create({
                userId: req.user.id,
                type,
                documentUrl: s3Url,
                fileName: file.originalname
            });
        }

        res.status(201).json(record);
    } catch (error) {
        console.error("Upload Controller Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
