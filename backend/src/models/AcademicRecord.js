import mongoose from 'mongoose';

const academicRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['10TH_MARKSHEET', '12TH_MARKSHEET'],
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    board: {
        type: String,
        default: "CBSE"
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    percentage: {
        type: Number,
        default: 0
    },
    subjects: [{
        subject: { type: String, required: true },
        marks: { type: Number, required: true }
    }],
    aiScoreVerification: {
        confidenceScore: { type: Number },
        status: {
            type: String,
            enum: ['PASS', 'FLAGGED', 'FAIL', 'PENDING'],
            default: 'PENDING'
        },
        flags: [String],
        extractedData: {
            rawText: String,
            detectedBoard: String
        },
        verificationDate: { type: Date }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

import User from './User.js';

academicRecordSchema.index({ userId: 1, type: 1 }, { unique: true });

// Enforce that academic records are only for students
academicRecordSchema.pre('save', async function () {
    if (this.isNew || this.isModified('userId')) {
        const user = await User.findById(this.userId);
        if (!user || user.role !== 'STUDENT') {
            throw new Error('Academic records can only be created for students');
        }
    }
});

// Method to process AI extraction results
academicRecordSchema.methods.processAIResult = async function (aiData) {
    const { confidenceScore, extractedSubjects, rawText, detectedBoard } = aiData;

    // Initialize aiScoreVerification structure
    this.aiScoreVerification = {
        confidenceScore,
        verificationDate: new Date(),
        extractedData: {
            rawText: rawText || '',
            detectedBoard: detectedBoard || ''
        },
        flags: [],
        status: 'FAIL' // Default
    };

    if (confidenceScore >= 80) {
        this.aiScoreVerification.status = 'PASS';
        this.subjects = extractedSubjects || [];
        this.board = detectedBoard || '';
        this.calculatePercentage();
    } else if (confidenceScore >= 60) {
        this.aiScoreVerification.status = 'FLAGGED';
        this.aiScoreVerification.flags.push('Low Confidence Score');
        this.subjects = extractedSubjects || [];
        this.board = detectedBoard || '';
        this.calculatePercentage();
    } else {
        // AI score < 60%
        this.aiScoreVerification.status = 'FAIL';
        this.aiScoreVerification.flags.push('Extraction Failed - Low Confidence');
        this.subjects = [];
        this.board = '';
        this.percentage = 0;
    }

    return await this.save();
};

// Helper method to calculate percentage from subjects
academicRecordSchema.methods.calculatePercentage = function () {
    if (this.subjects && this.subjects.length > 0) {
        const totalMarks = this.subjects.reduce((sum, sub) => sum + sub.marks, 0);
        // Assuming each subject is out of 100
        this.percentage = parseFloat((totalMarks / this.subjects.length).toFixed(2));
    } else {
        this.percentage = 0;
    }
};

const AcademicRecord = mongoose.model('AcademicRecord', academicRecordSchema);
export default AcademicRecord;
