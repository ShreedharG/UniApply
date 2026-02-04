import { Document, Application } from '../models/index.js';

import path from 'path';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private (Student)
export const uploadDocument = async (req, res) => {
    try {
        const { applicationId, type } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user owns application
        if (application.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate unique filename
        const fileName = `${applicationId}-${Date.now()}${path.extname(file.originalname)}`;

        // Upload to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `documents/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construct S3 URL
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/documents/${fileName}`;

        // Create Document record
        const document = await Document.create({
            applicationId,
            type,
            url: s3Url,
            status: 'PENDING'
        });



        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify document (Admin)
// @route   PUT /api/documents/:id/verify
// @access  Private (Admin)
export const verifyDocument = async (req, res) => {
    const { status, adminComments } = req.body;

    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.status = status;
        if (adminComments) {
            document.adminComments = adminComments;
        }

        await document.save();

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
