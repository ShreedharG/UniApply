import api from '../api/axios';

export interface ApplicationData {
    universityName: string;
    programName: string;
    personalDetails: {
        firstName: string;
        lastName: string;
        email: string;
        statementOfPurpose?: string;
    };
}

export const applicationService = {
    // Get all applications for the logged-in student
    getMyApplications: async () => {
        const { data } = await api.get('/applications/my');
        return data;
    },

    // Get all applications (Admin only)
    getAllApplications: async () => {
        const { data } = await api.get('/applications');
        return data;
    },

    // Get application by ID
    getApplicationById: async (id: string) => {
        const { data } = await api.get(`/applications/${id}`);
        return data;
    },

    // Create new application
    createApplication: async (applicationData: ApplicationData) => {
        const { data } = await api.post('/applications', applicationData);
        return data;
    },

    // Update application status (Admin only)
    updateApplicationStatus: async (id: string, status: string, adminComments?: string, documentStatuses?: any) => {
        const { data } = await api.put(`/applications/${id}/status`, {
            status,
            adminComments,
            documentStatuses
        });
        return data;
    },

    // Withdraw application
    withdrawApplication: async (id: string) => {
        const { data } = await api.put(`/applications/${id}/withdraw`);
        return data;
    },

    // Pay application fee
    payApplicationFee: async (id: string) => {
        const { data } = await api.put(`/applications/${id}/pay`);
        return data;
    }
};


