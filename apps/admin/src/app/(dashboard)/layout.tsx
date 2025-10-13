import { Sidebar } from '../../application/components/Sidebar';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Sidebar />
      <div className="container mx-auto p-6 lg:p-8 lg:pl-28 mt-16 lg:mt-8">
        {children}
      </div>
    </ProtectedRoute>
  );
}
