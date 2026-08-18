import { AnalysisReport } from '../types';
import { db, auth } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SavedReport {
  id: string;
  report: AnalysisReport;
}

/**
 * Saves an AnalysisReport to Firestore.
 */
export async function saveReport(report: AnalysisReport): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const userId = auth.currentUser.uid;
  
  const reportId = 'report_' + Math.random().toString(36).substring(2, 11);

  // Prepare standard payload
  const payload: AnalysisReport = {
    ...report,
    title: (report.title || 'Analysis Report').slice(0, 500),
    dataset_name: (report.dataset_name || 'Dataset').slice(0, 500),
    question: (report.question || '').slice(0, 5000),
    executive_summary: (report.executive_summary || '').slice(0, 5000),
    generated_at: (report.generated_at || new Date().toISOString()).slice(0, 128),
  };

  const docRef = doc(db, 'reports', reportId);
  await setDoc(docRef, {
    userId,
    report: payload,
    createdAt: new Date().toISOString()
  });
  
  return reportId;
}

/**
 * Fetches all saved reports from Firestore.
 */
export async function getReports(): Promise<SavedReport[]> {
  if (!auth.currentUser) return [];
  const userId = auth.currentUser.uid;

  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const results: SavedReport[] = [];
  snapshot.forEach(doc => {
    results.push({ id: doc.id, report: doc.data().report as AnalysisReport });
  });

  return results.sort((a, b) => {
    const dateA = a.report.generated_at || '';
    const dateB = b.report.generated_at || '';
    return dateB.localeCompare(dateA); // Descending
  });
}

/**
 * Deletes a saved report by ID.
 */
export async function deleteReport(reportId: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const docRef = doc(db, 'reports', reportId);
  await deleteDoc(docRef);
}


