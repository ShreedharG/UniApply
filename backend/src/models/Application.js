import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    universityName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    programName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SUBMITTED', 'ISSUE_RAISED', 'VERIFIED', 'REJECTED', 'WITHDRAWN'],
        default: 'DRAFT'
    },
    feePaid: {
        type: Boolean,
        default: false
    },
    documentStatuses: {
        '10TH_MARKSHEET': { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
        '12TH_MARKSHEET': { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' }
    },
    personalDetails: {
        type: Object
    },
    adminComments: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

import Program from './Program.js';

applicationSchema.virtual('academicRecords', {
    ref: 'AcademicRecord',
    localField: 'userId',
    foreignField: 'userId'
});

applicationSchema.virtual('User', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Prevent duplicate applications for the same program by the same user
applicationSchema.index({ userId: 1, programName: 1, universityName: 1 }, { unique: true });

// Integrity checks
applicationSchema.pre('save', async function (next) {
    if (this.isModified('programName') || this.isModified('universityName')) {
        const program = await Program.findById(this.programName);
        if (!program) {
            return next(new Error('Invalid Program ID'));
        }
        if (program.universityId.toString() !== this.universityName.toString()) {
            return next(new Error('Selected program does not belong to the specified university'));
        }
    }

    if (this.status === 'DRAFT' && this.feePaid === true) {
        return next(new Error('Fee cannot be paid for a DRAFT application'));
    }

    next();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
