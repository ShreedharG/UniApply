import api from '../api/axios';

export const ticketService = {
    // Get student's tickets
    getMyTickets: async () => {
        const { data } = await api.get('/tickets/my');
        return data;
    },

    // Get all tickets (Admin)
    getAllTickets: async (status?: string) => {
        const params = status ? { status } : {};
        const { data } = await api.get('/tickets', { params });
        return data;
    },

    // Create new ticket
    createTicket: async (ticketData: {
        subject: string;
        description: string;
        category?: string;
        priority?: string;
        applicationId?: string;
    }) => {
        const { data } = await api.post('/tickets', ticketData);
        return data;
    },

    // Respond to ticket (Admin)
    respondToTicket: async (id: string, response: string, status?: string) => {
        const { data } = await api.put(`/tickets/${id}/respond`, {
            response,
            status
        });
        return data;
    },

    // Update ticket status
    updateTicketStatus: async (id: string, status: string) => {
        const { data } = await api.put(`/tickets/${id}/status`, { status });
        return data;
    }
};

export const paymentService = {
    // Get user's payments
    getMyPayments: async () => {
        const { data } = await api.get('/payments/my');
        return data;
    },

    // Create payment
    createPayment: async (paymentData: {
        amount: number;
        type: 'APPLICATION_FEE' | 'ISSUE_RESOLUTION_FEE';
        applicationId?: string;
        ticketId?: string;
    }) => {
        const { data } = await api.post('/payments', paymentData);
        return data;
    },

    // Process payment
    processPayment: async (id: string) => {
        const { data } = await api.post(`/payments/${id}/process`);
        return data;
    }
};
