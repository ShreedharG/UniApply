import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ApplicationStatus } from '../../types';
import { applicationService } from '../../services/applicationService';

export const MyApplications = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'ACTION'>('ALL');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await applicationService.getMyApplications();
        setApplications(apps);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusEnum = (status: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
      'DRAFT': ApplicationStatus.DRAFT,
      'SUBMITTED': ApplicationStatus.SUBMITTED,
      'ADMIN_REVIEW': ApplicationStatus.ADMIN_REVIEW,
      'DOCS_PENDING': ApplicationStatus.DOCS_PENDING,
      'VERIFIED': ApplicationStatus.VERIFIED,
      'APPROVED': ApplicationStatus.APPROVED,
      'REJECTED': ApplicationStatus.REJECTED
    };
    return statusMap[status] || ApplicationStatus.DRAFT;
  };

  const getFilteredApps = (tab: string) => {
    return applications.filter(app => {
      const statusEnum = getStatusEnum(app.status);
      if (tab === 'ALL') return true;
      if (tab === 'PENDING') return [
        ApplicationStatus.SUBMITTED,
        ApplicationStatus.AI_VERIFICATION,
        ApplicationStatus.ADMIN_REVIEW
      ].includes(statusEnum);
      if (tab === 'APPROVED') return [
        ApplicationStatus.VERIFIED,
        ApplicationStatus.APPROVED
      ].includes(statusEnum);
      if (tab === 'ACTION') return [
        ApplicationStatus.REJECTED,
        ApplicationStatus.DOCS_PENDING
      ].includes(statusEnum);
      return false;
    });
  };

  const filteredApps = getFilteredApps(activeTab);

  const tabs = [
    { id: 'ALL', label: 'All Applications' },
    { id: 'PENDING', label: 'Pending Review' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'ACTION', label: 'Action Required' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your university applications</p>
        </div>
        <Link to="/student/apply">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Application
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Tabs Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex w-full min-w-max">
            {tabs.map((tab) => {
              const count = getFilteredApps(tab.id).length;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2
                    ${isActive
                      ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  {tab.label}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div key={app.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                      ${getStatusEnum(app.status) === ApplicationStatus.APPROVED || getStatusEnum(app.status) === ApplicationStatus.VERIFIED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        getStatusEnum(app.status) === ApplicationStatus.REJECTED || getStatusEnum(app.status) === ApplicationStatus.DOCS_PENDING ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                    `}>
                      {app.universityName.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{app.universityName}</h3>
                      <p className="text-slate-500 dark:text-slate-400">{app.programName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                        <span className="font-mono">{app.id}</span>
                        <span>•</span>
                        <span>Submitted on {new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <Badge status={getStatusEnum(app.status)} className="px-3 py-1" />
                    <Link to={`/student/applications/${app.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No applications found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                There are no applications in the <span className="lowercase font-medium">{tabs.find(t => t.id === activeTab)?.label}</span> category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};