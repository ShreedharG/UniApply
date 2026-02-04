import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  MapPin,
  Calendar,
  DollarSign,
  User as UserIcon,
  Building2,
  CreditCard,
  Lock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { applicationService } from '../../services/applicationService';
import { ApplicationStatus } from '../../types';

export const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      console.log('Fetching application with ID:', id);
      try {
        if (id) {
          const app = await applicationService.getApplicationById(id);
          console.log('Fetched application:', app);
          setApplication(app);
        } else {
          setError('No application ID provided');
        }
      } catch (error: any) {
        console.error('Failed to fetch application:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleWithdraw = async () => {
    if (!application || !window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      await applicationService.withdrawApplication(application.id);
      alert('Application withdrawn and deleted successfully');
      navigate('/student/applications');
    } catch (error: any) {
      console.error('Failed to withdraw application:', error);
      alert('Failed to withdraw application: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-slate-600 dark:text-slate-400 mb-2">Loading application...</div>
          <div className="text-sm text-slate-500">ID: {id}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/student/applications')}>
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Application Not Found</h2>
        <Link to="/student/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const app = application;
  const university = null; // Will be fetched from DB in future
  const program = null; // Will be fetched from DB in  future
  const fee = 50000; // Default fee
  const tax = fee * 0.18;
  const totalFee = fee + tax;

  const isApproved = app.status === ApplicationStatus.APPROVED;

  // Timeline Helper
  const getStepStatus = (stepIndex: number) => {
    // Simplified logic for demo mapping statuses to a 4-step process
    // 0: Submitted, 1: Review, 2: Verified, 3: Decision
    let currentStep = 0;

    switch (app.status) {
      case ApplicationStatus.DRAFT: currentStep = -1; break;
      case ApplicationStatus.SUBMITTED: currentStep = 0; break;
      case ApplicationStatus.AI_VERIFICATION:
      case ApplicationStatus.DOCS_PENDING:
        currentStep = 1; break;
      case ApplicationStatus.ADMIN_REVIEW: currentStep = 1; break;
      case ApplicationStatus.VERIFIED: currentStep = 2; break;
      case ApplicationStatus.APPROVED:
      case ApplicationStatus.REJECTED:
        currentStep = 3; break;
      default: currentStep = 0;
    }

    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const steps = [
    { title: 'Submitted', date: new Date(app.submittedAt).toLocaleDateString() },
    { title: 'Under Review', date: 'Processing' },
    { title: 'Verified', date: 'Pending' },
    { title: 'Decision', date: 'Pending' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/student/applications" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Application #{String(app.id).split('-').pop() || app.id}</h1>
            <Badge status={app.status} className="text-sm px-3 py-1" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Submitted on {new Date(app.submittedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          {/* Allow withdrawal until payment is made (feePaid is true) unless rejected or already withdrawn */}
          {!app.feePaid && app.status !== ApplicationStatus.REJECTED && app.status !== 'WITHDRAWN' && (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10 dark:border-red-900/30 dark:text-red-400"
              onClick={handleWithdraw}
            >
              Withdraw Application
            </Button>
          )}
          {app.feePaid && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Download Receipt
            </Button>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="relative flex justify-between">
          <div className="absolute left-0 top-[15px] w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-10" />

          {steps.map((step, idx) => {
            const status = getStepStatus(idx);
            return (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 bg-white dark:bg-slate-900 ${status === 'completed' ? 'border-green-500 text-green-600' :
                  status === 'current' ? 'border-blue-500 text-blue-600' :
                    'border-slate-200 text-slate-400 dark:border-slate-700'
                  }`}>
                  {status === 'completed' ? <CheckCircle2 className="w-5 h-5 fill-green-50" /> :
                    status === 'current' ? <Clock className="w-4 h-4 animate-pulse text-blue-600" /> :
                      <span className="text-sm font-medium">{idx + 1}</span>}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    status === 'current' ? 'text-blue-600 dark:text-blue-400' :
                      'text-slate-500 dark:text-slate-500'
                    }`}>{step.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-600">{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* University Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" /> University Details
            </h3>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${university?.logoColor || 'bg-slate-100 text-slate-600'}`}>
                {app.universityName.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{app.universityName}</h4>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{university?.location || 'New Delhi, India'}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Program</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{app.programName}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Course Fee</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">₹{fee.toLocaleString()}/yr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> Documents
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(app.Documents || []).map((doc: any, idx: number) => (
                <div key={idx} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{doc.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{doc.type} • {doc.uploadDate || 'Pending'}</p>
                    </div>
                  </div>
                  <Badge status={doc.status} />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to="/student/documents">
                <Button variant="outline" size="sm" className="w-full">Manage Documents</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" /> Payment Status
            </h3>
            <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${app.feePaid
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : isApproved
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
              {app.feePaid ? <CheckCircle2 className="w-6 h-6" /> : isApproved ? <AlertCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              <div>
                <p className="font-bold">
                  {app.feePaid ? 'Fee Paid' : isApproved ? 'Payment Due' : 'Payment Locked'}
                </p>
                <p className="text-xs opacity-90">
                  {app.feePaid
                    ? 'Transaction ID: TXN123456789'
                    : isApproved
                      ? 'Application approved. Please pay to secure seat.'
                      : 'Available after admin approval'}
                </p>
              </div>
            </div>

            {!app.feePaid && isApproved && (
              <Link to="/student/payments">
                <Button className="w-full mb-3">Pay Now (₹{totalFee.toLocaleString()})</Button>
              </Link>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Tuition Fee (1st Sem)</span>
                <span>₹{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-medium text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>₹{totalFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/20 p-6">
            <h3 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">Need Assistance?</h3>
            <p className="text-sm text-brand-700 dark:text-brand-300 mb-4">
              Having trouble with your application? Our support team is here to help.
            </p>
            <Link to="/student/support">
              <Button variant="outline" className="w-full bg-white dark:bg-slate-900 border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/20">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};