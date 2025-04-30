
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSlides, deleteSlide, getTrainingModule } from '@/services/trainingService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { ArrowLeft, Edit, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

const SlidesList: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // Fetch module and slides data
  const { data: module } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getTrainingModule(moduleId!)
  });

  const { data: slides, isLoading, error, refetch } = useQuery({
    queryKey: ['slides', moduleId],
    queryFn: () => moduleId ? getSlides(moduleId) : Promise.resolve([])
  });

  // Delete slide mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSlide(id),
    onSuccess: () => {
      toast({
        title: "Slide deleted",
        description: "The slide has been successfully deleted."
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the slide.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/modules')}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold">
          Slides for {module?.title || 'Module'}
        </h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Manage the training content slides for this module
        </p>
        <Button asChild>
          <Link to={`/admin/modules/${moduleId}/slides/new`} className="flex items-center gap-1">
            <Plus size={16} />
            Add Slide
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p>Loading slides...</p>
      ) : error ? (
        <p className="text-red-500">Error loading slides</p>
      ) : slides && slides.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {slides.map((slide) => (
            <Card key={slide.id}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                  <span>Slide #{slide.order}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <MoveUp size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoveDown size={16} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium">{slide.hero_text}</h3>
                {slide.hero_image_url && (
                  <div className="mt-2 relative h-32 overflow-hidden rounded-md">
                    <img 
                      src={slide.hero_image_url} 
                      alt={slide.hero_text}
                      className="object-cover w-full h-full" 
                    />
                  </div>
                )}
                {slide.description && (
                  <p className="text-sm mt-2 text-gray-500 line-clamp-2">
                    {slide.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/admin/modules/${moduleId}/slides/${slide.id}`}>
                    <Edit size={16} className="mr-1" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this slide? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => slide.id && handleDelete(slide.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No slides found for this module</p>
          <Button asChild className="mt-4">
            <Link to={`/admin/modules/${moduleId}/slides/new`}>Create your first slide</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SlidesList;
