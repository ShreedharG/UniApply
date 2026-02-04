import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, Check, X, FileText, Bot } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { applicationService } from '../../services/applicationService';

export const ApplicationReview = () => {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      try {
        const data = await applicationService.getApplicationById(id);
        setApp(data);
      } catch (error) {
        console.error('Failed to fetch application:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleDocumentStatusUpdate = async (docType: string, newStatus: string) => {
    if (!app) return;
    try {
      const updatedStatuses = {
        ...app.documentStatuses,
        [docType]: { ...app.documentStatuses?.[docType], type: 'String', status: newStatus } // Handling weird potential structure or just overwrite
        // Actually backend expects documentStatuses object.
        // Let's simplified: just send the whole object with the modification.
      };
      // wait, the schema is { '10TH_MARKSHEET': { type: String, ... } } but the VALUE stored is just the string status?
      // No, the schema definition `type: String` is for Mongoose. The actual data in DB will be just properties? 
      // Wait, `documentStatuses` in Schema is an object with keys.
      // `documentStatuses: { '10TH_MARKSHEET': 'PENDING' }` if I defined it as Map?
      // The schema defined earlier was:
      // documentStatuses: {
      //    '10TH_MARKSHEET': { type: String, enum: ..., default: 'PENDING' }
      // } 
      // This syntax in Mongoose define sub-documents if not careful, or just fields. 
      // It defines `app.documentStatuses.10TH_MARKSHEET` as a string. Correct.

      const currentStatuses = app.documentStatuses || {};
      const newStatuses = { ...currentStatuses, [docType]: newStatus };

      const updatedApp = await applicationService.updateApplicationStatus(app.id, app.status, '', newStatuses);
      setApp(updatedApp);
    } catch (error) {
      console.error('Failed to update document status:', error);
    }
  };

  const getDocStatus = (type: string) => {
    // Access the status safely
    return app?.documentStatuses?.[type] || 'PENDING';
  };

  if (loading) return <div>Loading...</div>;
  if (!app) return <div>Application not found</div>;

  // Merge academic records with expected types
  const docTypes = [
    { type: 'MARKSHEET_10', label: '10th Marksheet' },
    { type: 'MARKSHEET_12', label: '12th Marksheet' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/admin/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{app.programName}</h1>
            <Badge status={app.status} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{app.universityName}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 border-red-200 dark:border-red-900/50"
            onClick={() => {
              // Reject application logic - call full reject
              if (window.confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
                applicationService.updateApplicationStatus(app.id, 'REJECTED', 'Application Rejected by Admin', app.documentStatuses)
                  .then(updated => setApp(updated));
              }
            }}
          >
            <X className="w-4 h-4 mr-2" /> Reject Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Info & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Applicant Information</h3>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Full Name</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200 mt-1">{app.personalDetails?.firstName} {app.personalDetails?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Email</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200 mt-1">{app.personalDetails?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Documents</h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {docTypes.map((docType) => {
                const recordMatch = app.academicRecords?.find((r: any) => r.type === (docType.type === 'MARKSHEET_10' ? '10TH_MARKSHEET' : '12TH_MARKSHEET'));

                return (
                  <div key={docType.type} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">{docType.label}</h4>
                          {recordMatch ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{recordMatch.fileName} • Uploaded {new Date(recordMatch.createdAt).toLocaleDateString()}</p>
                          ) : (
                            <p className="text-xs text-red-500">Not Uploaded</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      {recordMatch && (
                        <Button size="sm" variant="outline" onClick={() => window.open(recordMatch.documentUrl, '_blank')}>View Document</Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Notes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Internal Notes</h3>
            <textarea
              className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
              placeholder="Add internal notes for other admins..."
            ></textarea>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary">Save Note</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};