import React from 'react';

export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  AI_VERIFICATION = 'AI Verification',
  ADMIN_REVIEW = 'Under Review',
  DOCS_PENDING = 'Docs Pending',
  VERIFIED = 'Verified',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface University {
  id: string;
  name: string;
  location: string;
  ranking: number;
  programs: Program[];
  logoColor: string;
}

export interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  fee: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MISSING';
  url?: string;
  uploadDate?: string;
  aiData?: Record<string, string>;
  rejectionReason?: string;
}

export interface Application {
  id: string;
  studentName: string;
  universityName: string;
  programName: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  documents: Document[];
  feePaid: boolean;
  score?: number; // AI Score
}

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}