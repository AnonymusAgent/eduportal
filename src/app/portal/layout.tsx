import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PortalSidebar from '@/components/layouts/PortalSidebar';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;

  try {
    session = await getSession();
  } catch (error) {
    console.error('Portal session error:', error);
    redirect('/login');
  }

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'student') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen">
      <PortalSidebar user={session} />
      <main
        id="main-content"
        className="lg:ml-64 transition-all duration-300"
      >
        <div className="min-h-screen p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
