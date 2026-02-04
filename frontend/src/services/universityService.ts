import api from '../api/axios';

export const universityService = {
    // Get all universities with programs
    getAllUniversities: async () => {
        const { data } = await api.get('/universities');
        return data;
    },

    // Get university by ID
    getUniversityById: async (id: number) => {
        const { data } = await api.get(`/universities/${id}`);
        return data;
    }
};

export const programService = {
    // Get all programs (optionally filter by university)
    getAllPrograms: async (universityId?: number) => {
        const params = universityId ? { universityId } : {};
        const { data } = await api.get('/programs', { params });
        return data;
    }
};
