import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { FileText, Plus, MapPin, Sparkles, ArrowRight, CreditCard, Headphones, Ban, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ApplicationStatus, User } from '../../types';
import { applicationService } from '../../services/applicationService';
import { universityService } from '../../services/universityService';

export const StudentDashboard = () => {
  const { user } = useOutletContext<{ user: User }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, unis] = await Promise.all([
          applicationService.getMyApplications(),
          universityService.getAllUniversities()
        ]);
        setApplications(apps);
        setUniversities(unis);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get at most 2 recent applications sorted by updatedAt
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2);

  const getStatusEnum = (status: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
      'DRAFT': ApplicationStatus.DRAFT,
      'SUBMITTED': ApplicationStatus.SUBMITTED,
      'ADMIN_REVIEW': ApplicationStatus.ADMIN_REVIEW,
      'DOCS_PENDING': ApplicationStatus.DOCS_PENDING,
      'VERIFIED': ApplicationStatus.VERIFIED,
      'APPROVED': ApplicationStatus.APPROVED,
      'REJECTED': ApplicationStatus.REJECTED,
      'ISSUE_RAISED': ApplicationStatus.DOCS_PENDING,
      'PAYMENT_RECEIVED': ApplicationStatus.APPROVED
    };
    return statusMap[status] || ApplicationStatus.DRAFT;
  };

  return (
    <div className="space-y-8">
      {/* Stylish Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-900 dark:to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-100 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Student Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-brand-100 text-lg max-w-xl">
              Track and manage your university applications seamlessly.
            </p>
          </div>
          <Link to="/student/apply">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 border-0 shadow-lg font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Applications</h2>
          <Link to="/student/applications" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">Loading applications...</p>
              </div>
            ) : recentApps.length > 0 ? (
              recentApps.map((app) => (
                <div key={app.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                        ${getStatusEnum(app.status) === ApplicationStatus.APPROVED || getStatusEnum(app.status) === ApplicationStatus.VERIFIED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          getStatusEnum(app.status) === ApplicationStatus.REJECTED || getStatusEnum(app.status) === ApplicationStatus.DOCS_PENDING ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                      `}>
                        {app.universityName?.name ? app.universityName.name.substring(0, 1) : 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{app.universityName?.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{app.programName?.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                          <span className="font-mono">APP-{app.id.substring(app.id.length - 6)}</span>
                          <span>•</span>
                          <span>Last updated {new Date(app.updatedAt).toLocaleDateString()}</span>
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
                  Start your journey by applying to a university.
                </p>
                <Link to="/student/apply" className="inline-block mt-4">
                  <Button variant="outline">Start Application</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Section*/}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/student/payments" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Make Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pay application fees</p>
            </div>
          </Link>

          <Link to="/student/support" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Help & Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Get expert assistance</p>
            </div>
          </Link>

          <Link to="/student/applications" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg group-hover:scale-110 transition-transform">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Withdraw Application</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cancel active applications</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Available Universities Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Available Universities</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search universities or programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-80 transition-all shadow-sm"
            />
          </div>
        </div>

        {universities.filter(uni =>
          uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          uni.programs?.some((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        ).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.filter(uni =>
              uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              uni.programs?.some((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map((uni) => (
              <div key={uni.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${uni.logoColor}`}>
                    {uni.name.charAt(0)}
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700">
                    Rank #{uni.ranking}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {uni.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {uni.location}
                  </p>
                </div>

                <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Programs & Fees</p>
                  {uni.programs?.slice(0, 3).map((program: any) => (
                    <div key={program.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-300 truncate mr-2">{program.name}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">₹{Number(program.fee).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Link to="/student/apply" className="block mt-auto">
                  <Button className="w-full justify-center">
                    Apply Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No universities found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};