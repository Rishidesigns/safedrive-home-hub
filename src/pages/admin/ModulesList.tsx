
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModules, deleteTrainingModule } from '@/services/trainingService';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, FileText, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ModulesList: React.FC = () => {
  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ['trainingModules'],
    queryFn: getTrainingModules
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingModule(id);
      toast({
        title: "Module deleted",
        description: "The training module has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the training module.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Training Modules</h2>
        <Button asChild>
          <Link to="/admin/modules/new" className="flex items-center gap-1">
            <Plus size={16} />
            Create Module
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p>Loading modules...</p>
      ) : error ? (
        <p className="text-red-500">Error loading modules</p>
      ) : modules && modules.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.title}</TableCell>
                <TableCell>
                  {module.status === 'published' ? (
                    <Badge className="bg-green-600">
                      <FileText size={14} className="mr-1" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <HelpCircle size={14} className="mr-1" /> Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(module.created_at!).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/modules/${module.id}/slides`}>
                        Slides
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/modules/${module.id}/quiz`}>
                        Quiz
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/modules/${module.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Module</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this training module? This action cannot be undone.
                            All slides and quiz questions associated with this module will also be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => module.id && handleDelete(module.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No training modules found</p>
          <Button asChild className="mt-4">
            <Link to="/admin/modules/new">Create your first training module</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModulesList;
