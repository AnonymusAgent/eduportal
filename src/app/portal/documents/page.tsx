import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, studentDocuments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { FolderOpen, FileText } from 'lucide-react';

export default async function DocumentsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><EmptyState title="No Profile" /></Card>;

  const docs = await db.select().from(studentDocuments).where(eq(studentDocuments.studentId, student.id)).orderBy(desc(studentDocuments.createdAt));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">My Documents</h1>
      {docs.length > 0 ? (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{doc.documentName}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="capitalize">{doc.documentType.replace('_', ' ')}</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.isOfficial && <Badge variant="success">Official</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<FolderOpen className="w-8 h-8 text-indigo-400" />} title="No Documents" description="Official documents such as admission letters, transcripts, and certificates will appear here once issued by the institution." /></Card>
      )}
    </div>
  );
}
