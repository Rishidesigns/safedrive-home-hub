
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BookOpen, FileText } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getActiveTab = () => {
    if (currentPath.includes('/modules')) return 'modules';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-moveinsync-orange">Driver Training Admin</h1>
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
              Back to App
            </Link>
          </div>
          <Tabs value={getActiveTab()} className="mt-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dashboard" asChild>
                <Link to="/admin" className="flex items-center gap-1">
                  <Home size={16} />
                  Dashboard
                </Link>
              </TabsTrigger>
              <TabsTrigger value="modules" asChild>
                <Link to="/admin/modules" className="flex items-center gap-1">
                  <BookOpen size={16} />
                  Training Modules
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
