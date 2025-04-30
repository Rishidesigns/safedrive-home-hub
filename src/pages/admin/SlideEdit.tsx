
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getSlide, 
  createSlide, 
  updateSlide, 
  getSlides,
  uploadImage,
  Slide,
  getTrainingModule 
} from '@/services/trainingService';
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
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const slideSchema = z.object({
  hero_text: z.string().min(1, "Hero text is required"),
  description: z.string().optional(),
  hero_image_url: z.string().optional(),
  order: z.number().int().min(1, "Order must be at least 1")
});

type FormValues = z.infer<typeof slideSchema>;

const SlideEdit: React.FC = () => {
  const { moduleId, slideId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!slideId;
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch module data
  const { data: module } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getTrainingModule(moduleId!)
  });

  // Fetch slide data if in edit mode
  const { data: slide, isLoading: isLoadingSlide } = useQuery({
    queryKey: ['slide', slideId],
    queryFn: () => getSlide(slideId!),
    enabled: isEditMode
  });

  // Fetch existing slides to determine next order number
  const { data: slides } = useQuery({
    queryKey: ['slides', moduleId],
    queryFn: () => moduleId ? getSlides(moduleId) : Promise.resolve([])
  });

  // Calculate next order number for new slide
  const nextOrderNumber = React.useMemo(() => {
    if (!slides || slides.length === 0) return 1;
    const maxOrder = Math.max(...slides.map(s => s.order));
    return maxOrder + 1;
  }, [slides]);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      hero_text: '',
      description: '',
      hero_image_url: '',
      order: isEditMode ? 0 : nextOrderNumber
    }
  });

  // Set form values when slide data is loaded
  React.useEffect(() => {
    if (isEditMode && slide) {
      form.reset({
        hero_text: slide.hero_text,
        description: slide.description || '',
        hero_image_url: slide.hero_image_url || '',
        order: slide.order
      });
      
      if (slide.hero_image_url) {
        setPreviewImage(slide.hero_image_url);
      }
    } else if (!isEditMode) {
      form.setValue('order', nextOrderNumber);
    }
  }, [slide, form, isEditMode, nextOrderNumber]);

  // Create slide mutation
  const createMutation = useMutation({
    mutationFn: (data: Slide) => createSlide(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Slide created successfully."
      });
      navigate(`/admin/modules/${moduleId}/slides`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create slide.",
        variant: "destructive"
      });
    }
  });

  // Update slide mutation
  const updateMutation = useMutation({
    mutationFn: (data: Slide) => updateSlide(slideId!, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Slide updated successfully."
      });
      navigate(`/admin/modules/${moduleId}/slides`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update slide.",
        variant: "destructive"
      });
    }
  });

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const url = await uploadImage(file);
      form.setValue('hero_image_url', url);
      setPreviewImage(url);
      toast({
        title: "Success",
        description: "Image uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive"
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    if (!moduleId) return;
    
    const slideData: Slide = {
      ...data,
      module_id: moduleId
    };
    
    if (isEditMode) {
      updateMutation.mutate(slideData);
    } else {
      createMutation.mutate(slideData);
    }
  };

  if (isEditMode && isLoadingSlide) {
    return <div>Loading slide...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/admin/modules/${moduleId}/slides`)}
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Slide' : 'Create Slide'}
        </h2>
      </div>
      
      <p className="text-gray-500 mb-6">
        For module: {module?.title || 'Loading...'}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <FormField
            control={form.control}
            name="hero_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slide Title</FormLabel>
                <FormControl>
                  <Input placeholder="Main heading for this slide" {...field} />
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
                    placeholder="Detailed content for this slide" 
                    {...field} 
                    value={field.value || ''}
                    className="min-h-[150px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hero_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <FormControl>
                      <Input 
                        placeholder="Image URL or upload" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <div>
                      <Input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploading}
                      >
                        <Upload size={16} className="mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                  
                  {previewImage && (
                    <Card>
                      <CardContent className="p-2">
                        <div className="relative h-48 overflow-hidden rounded-md">
                          <img 
                            src={previewImage} 
                            alt="Preview"
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/admin/modules/${moduleId}/slides`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-1"
            >
              <Save size={16} />
              {isEditMode ? 'Update Slide' : 'Create Slide'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SlideEdit;
