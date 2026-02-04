import React from 'react';
import { ApplicationStatus } from '../../types';

interface BadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  let styles = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  
  switch (status) {
    case ApplicationStatus.APPROVED:
    case ApplicationStatus.VERIFIED:
    case 'VERIFIED':
      styles = 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50';
      break;
    case ApplicationStatus.REJECTED:
    case 'REJECTED':
      styles = 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
      break;
    case ApplicationStatus.ADMIN_REVIEW:
    case ApplicationStatus.AI_VERIFICATION:
    case 'PENDING':
    case 'REVIEWING':
      styles = 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
      break;
    case ApplicationStatus.DOCS_PENDING:
    case 'MISSING':
      styles = 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50';
      break;
    case 'OPTIONAL':
      styles = 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      break;
    case ApplicationStatus.SUBMITTED:
    case 'UPLOADED':
      styles = 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50';
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles} ${className}`}>
      {status}
    </span>
  );
};