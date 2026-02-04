import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { User } from '../../types';

export const UniversityDashboard = () => {
    const { user } = useOutletContext<{ user: User }>();
    const [loading, setLoading] = useState(false);

    // Mock stats - in real app would fetch from API
    const stats = [
        { label: 'Total Applications', value: '12', icon: FileText, color: 'blue' as const },
        { label: 'Pending Review', value: '5', icon: Clock, color: 'orange' as const },
        { label: 'Accepted', value: '4', icon: CheckCircle, color: 'green' as const },
        { label: 'Total Students', value: '150', icon: Users, color: 'purple' as const },
    ];

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        University Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Welcome back, {user.name}
                    </p>
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-lg border border-brand-100 dark:border-brand-800">
                    <span className="text-brand-700 dark:text-brand-300 font-medium">IIT Delhi Portal</span>
                </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div> */}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Recent Applications
                </h2>
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Application list will appear here
                </div>
            </div>
        </div>
    );
};
