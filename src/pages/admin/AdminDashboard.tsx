
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModules } from '@/services/trainingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ['trainingModules'],
    queryFn: getTrainingModules
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Button asChild>
          <Link to="/admin/modules/new">Create New Module</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : modules?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Training modules available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Modules</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : modules?.filter(m => m.status === 'published').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Modules visible to users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Modules</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : modules?.filter(m => m.status === 'draft').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Modules in preparation
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Training Modules</CardTitle>
          <CardDescription>
            Overview of your most recently created training modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading modules...</p>
          ) : error ? (
            <p className="text-red-500">Error loading modules</p>
          ) : modules && modules.length > 0 ? (
            <ul className="divide-y">
              {modules.slice(0, 5).map(module => (
                <li key={module.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-gray-500">
                        {module.status === 'published' ? 'Published' : 'Draft'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        to={`/admin/modules/${module.id}/slides`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Slides
                      </Link>
                      <Link 
                        to={`/admin/modules/${module.id}/quiz`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Quiz
                      </Link>
                      <Link 
                        to={`/admin/modules/${module.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No modules found. Create your first training module!</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" asChild className="h-auto py-4 justify-start">
            <Link to="/admin/modules" className="flex flex-col items-start">
              <span className="font-medium">Manage Training Modules</span>
              <span className="text-xs text-gray-500 mt-1">Add, edit, or delete training modules</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 justify-start">
            <Link to="/" className="flex flex-col items-start">
              <span className="font-medium">View Driver Training App</span>
              <span className="text-xs text-gray-500 mt-1">See how users will experience your content</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
