import React, { useEffect, useState } from 'react';
import { FileText, Upload, Shield, Download, Trash2, Eye, AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { academicRecordService } from '../../services/academicRecordService';

type DocStatus = 'MISSING' | 'UPLOADING' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'OPTIONAL';

interface StudentDocument {
  id: string; // The frontend ID
  type: string; // The backend type enum
  title: string;
  description: string;
  status: DocStatus;
  fileName?: string;
  fileSize?: string;
  documentUrl?: string;
  uploadDate?: string;
  rejectionReason?: string;
  icon: React.ElementType;
}

const DOC_DEFINITIONS = [
  {
    id: '10th_marksheet',
    type: '10TH_MARKSHEET',
    title: '10th Class Marksheet',
    description: 'Official marksheet issued by your secondary education board.',
    icon: FileText
  },
  {
    id: '12th_marksheet',
    type: '12TH_MARKSHEET',
    title: '12th Class Marksheet',
    description: 'Official marksheet issued by your higher secondary education board.',
    icon: FileText
  }
];

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState<StudentDocument[]>(DOC_DEFINITIONS.map(def => ({
    ...def,
    status: 'MISSING'
  })));

  const fetchRecords = async () => {
    try {
      const records = await academicRecordService.getMyRecords();

      setDocuments(prev => prev.map(doc => {
        const record = records.find((r: any) => r.type === doc.type);
        if (record) {
          // Map backend status to frontend status
          let status: DocStatus = 'PENDING';
          const backendStatus = record.aiScoreVerification?.status;

          if (backendStatus === 'PASS') status = 'VERIFIED';
          else if (backendStatus === 'FAIL') status = 'REJECTED';
          else if (backendStatus === 'FLAGGED') status = 'PENDING'; // or some other status
          else status = 'PENDING';

          return {
            ...doc,
            status: status,
            fileName: record.fileName || 'document.pdf',
            documentUrl: record.documentUrl,
            fileSize: '2 MB', // Still mock, backend need to store size to be dynamic
            uploadDate: new Date(record.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return { ...doc, status: 'MISSING' };
      }));
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, footerId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const docDef = documents.find(d => d.id === footerId);
    if (!docDef) return;

    // Set uploading state
    setDocuments(prev => prev.map(doc => {
      if (doc.id === footerId) return { ...doc, status: 'UPLOADING' };
      return doc;
    }));

    try {
      await academicRecordService.uploadRecord(docDef.type, file);
      // Refresh records to get the new state
      await fetchRecords();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
      setDocuments(prev => prev.map(doc => {
        if (doc.id === footerId) return { ...doc, status: 'MISSING' };
        return doc;
      }));
    }
  };

  const triggerFileInput = (id: string) => {
    document.getElementById(`file-upload-${id}`)?.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Documents</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your educational and identity documents. These will be used for all your university applications.</p>
      </div>

      <div className="grid gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`
              relative overflow-hidden rounded-xl border p-6 transition-all duration-200
              ${(doc.status === 'MISSING' || doc.status === 'OPTIONAL') ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-dashed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'}
            `}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Icon Section */}
              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
                ${doc.status === 'VERIFIED' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  doc.status === 'REJECTED' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                    doc.status === 'OPTIONAL' ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500' :
                      'bg-blue-50 dark:bg-blue-900/20 text-brand-600 dark:text-brand-400'}
              `}>
                <doc.icon className="w-8 h-8" />
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{doc.title}</h3>
                  <Badge status={doc.status} />
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{doc.description}</p>

                {doc.status === 'REJECTED' && (
                  <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span><span className="font-semibold">Action Required:</span> {doc.rejectionReason}</span>
                  </div>
                )}

                {(doc.status === 'VERIFIED' || doc.status === 'PENDING') && (
                  <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {doc.fileName}
                    </span>
                    <span>{doc.fileSize}</span>
                    <span>• Uploaded on {doc.uploadDate}</span>
                  </div>
                )}
              </div>

              {/* Action Section */}
              <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                <input
                  type="file"
                  id={`file-upload-${doc.id}`}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, doc.id)}
                />
                {doc.status === 'MISSING' || doc.status === 'REJECTED' || doc.status === 'UPLOADING' || doc.status === 'OPTIONAL' ? (
                  <Button
                    onClick={() => triggerFileInput(doc.id)}
                    isLoading={doc.status === 'UPLOADING'}
                    variant={doc.status === 'OPTIONAL' ? 'outline' : 'primary'}
                    className="min-w-[140px]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {doc.status === 'UPLOADING' ? 'Uploading...' : 'Upload File'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-slate-600 dark:text-slate-300"
                      onClick={() => window.open(doc.documentUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Document
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => triggerFileInput(doc.id)} // Allow re-upload
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Verification Watermark for Verified Docs */}
            {doc.status === 'VERIFIED' && (
              <div className="absolute -top-3 -right-3 text-green-100 dark:text-green-900/20 rotate-12 pointer-events-none">
                <CheckCircle2 className="w-32 h-32" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Document Guidelines</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li>Documents must be in PDF, JPG, or PNG format.</li>
          <li>Maximum file size allowed is 5MB per document.</li>
          <li>Ensure scanned copies are clear and all text is readable.</li>
        </ul>
      </div>
    </div>
  );
};