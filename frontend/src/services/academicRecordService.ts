import api from '../api/axios';

export interface AcademicRecord {
    id: string;
    userId: string;
    type: '10TH_MARKSHEET' | '12TH_MARKSHEET';
    documentUrl: string;
    fileName: string;
    uploadedAt: string;
}

export const academicRecordService = {
    // Get all records
    getMyRecords: async () => {
        const { data } = await api.get('/academic-records');
        return data;
    },

    // Upload record
    uploadRecord: async (type: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const { data } = await api.post('/academic-records', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }
};
