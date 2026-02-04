import React, { useState, useEffect } from 'react';
import { CreditCard, History, Download, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { applicationService } from '../../services/applicationService';
import { ApplicationStatus } from '../../types';
import { Link } from 'react-router-dom';

export const PaymentsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const pendingPayments = applications.filter(
    app => app.status !== 'DRAFT' && !app.feePaid
  );

  const paymentHistory = applications.filter(
    app => app.feePaid
  );

  const totalPaid = paymentHistory.reduce((acc, curr) => acc + (curr.programName?.fee || 0), 0);
  const totalPending = pendingPayments.reduce((acc, curr) => acc + (curr.programName?.fee || 0), 0);

  const handlePay = async (id: string) => {
    setProcessingId(id);
    try {
      await applicationService.payApplicationFee(id);
      // Refresh data
      const data = await applicationService.getMyApplications();
      setApplications(data);
      alert("Payment Successful!");
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payments & Transactions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your application fees and view transaction history.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Paid</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">₹{totalPaid.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Dues</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">₹{totalPending.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Payments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" /> Action Required: Pending Payments
        </h2>

        {pendingPayments.length > 0 ? (
          <div className="grid gap-4">
            {pendingPayments.map(app => (
              <div key={app.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm border-l-4 border-l-orange-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{app.universityName?.name}</h3>
                      <Badge status={app.status} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{app.programName?.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Application ID: {app.id}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Amount Due</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{app.programName?.fee?.toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={() => handlePay(app.id)}
                      isLoading={processingId === app.id}
                      className="min-w-[120px]"
                    >
                      Pay Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">No Pending Payments</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">You're all caught up! All approved application fees have been paid.</p>
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-500" /> Transaction History
        </h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{app.universityName?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{app.programName?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {app.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900 dark:text-slate-100">
                        ₹{app.programName?.fee?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                          <Download className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No transaction history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};