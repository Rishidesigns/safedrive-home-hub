
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTrainingModule, createTrainingModule, updateTrainingModule, TrainingModule } from '@/services/trainingService';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['draft', 'published'])
});

type FormValues = z.infer<typeof moduleSchema>;

const ModuleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Fetch module data if in edit mode
  const { data: module, isLoading: isLoadingModule } = useQuery({
    queryKey: ['module', id],
    queryFn: () => getTrainingModule(id!),
    enabled: isEditMode
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'draft'
    },
    values: module as FormValues
  });

  // Create module mutation
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Ensure all required fields are present
      const moduleData: TrainingModule = {
        title: data.title,
        description: data.description || null,
        status: data.status
      };
      return createTrainingModule(moduleData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training module created successfully."
      });
      navigate('/admin/modules');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create training module.",
        variant: "destructive"
      });
    }
  });

  // Update module mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Ensure all required fields are present
      const moduleData: TrainingModule = {
        title: data.title,
        description: data.description || null,
        status: data.status
      };
      return updateTrainingModule(id!, moduleData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training module updated successfully."
      });
      navigate('/admin/modules');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update training module.",
        variant: "destructive"
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoadingModule) {
    return <div>Loading module...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/modules')}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Training Module' : 'Create Training Module'}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Safety Training Module" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the purpose of this training module" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/modules')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-1"
            >
              <Save size={16} />
              {isEditMode ? 'Update Module' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ModuleEdit;
