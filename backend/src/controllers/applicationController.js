import { Application, User } from '../models/index.js';

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private (Student)
export const createApplication = async (req, res) => {
    try {
        const { universityName, programName, personalDetails } = req.body;

        const application = await Application.create({
            userId: req.user.id,
            universityName,
            programName,
            personalDetails,
            status: 'DRAFT'
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications for logged in student
// @route   GET /api/applications/my
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id })
            .populate('academicRecords')
            .populate('universityName', 'name location')
            .populate('programName', 'name fee duration degree');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('User', 'name email')
            .populate('academicRecords')
            .populate('universityName', 'name location')
            .populate('programName', 'name fee duration degree');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('User', 'name email')
            .populate('academicRecords')
            .populate('universityName', 'name location')
            .populate('programName', 'name fee duration degree');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership or admin
        // req.user.id is string from token middleware usually, or object?
        // In Mongoose authMiddleware, we'll see. Assuming it's the User model instance or ID.
        // Usually it's req.user = user (the document).
        // comparing ObjectId needs .toString() or .equals()
        if (req.user.role !== 'ADMIN' && application.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res) => {
    const { status, adminComments, documentStatuses } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (status) application.status = status;
        if (adminComments) application.adminComments = adminComments;
        if (documentStatuses) application.documentStatuses = documentStatuses;

        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Student)
export const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        if (application.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to withdraw this application' });
        }

        // Check if already processed or fee paid
        // feePaid is not schema backed, checking status instead or just existing logic
        if (application.status === 'PAYMENT_RECEIVED') { // Fallback if feePaid logic was obscure
            return res.status(400).json({ message: 'Cannot withdraw application after fee payment' });
        }

        if (application.status === 'REJECTED') {
            return res.status(400).json({ message: 'Cannot withdraw a rejected application' });
        }

        // Delete the application
        await application.deleteOne();

        res.json({ message: 'Application withdrawn and deleted successfully' });
    } catch (error) {
        console.error('SERVER ERROR in withdrawApplication:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Pay application fee
// @route   PUT /api/applications/:id/pay
// @access  Private (Student)
export const payApplicationFee = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        if (application.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to pay for this application' });
        }

        if (application.feePaid) {
            return res.status(400).json({ message: 'Fee already paid' });
        }

        // Simulate payment success
        application.feePaid = true;
        application.status = 'SUBMITTED'; // Optionally move to submitted if logical flow dictates
        await application.save();

        res.json({ message: 'Fee paid successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
