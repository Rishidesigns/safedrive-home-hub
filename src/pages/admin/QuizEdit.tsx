
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getQuiz, 
  createQuiz, 
  updateQuiz, 
  getTrainingModule,
  Quiz 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

const quizSchema = z.object({
  question: z.string().min(1, "Question is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().optional(),
  option_d: z.string().optional(),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional()
});

type FormValues = z.infer<typeof quizSchema>;

const QuizEdit: React.FC = () => {
  const { moduleId, quizId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!quizId;

  // Fetch module data
  const { data: module } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getTrainingModule(moduleId!)
  });

  // Fetch quiz data if in edit mode
  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId!),
    enabled: isEditMode
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A' as const,
      explanation: ''
    }
  });

  // Set form values when quiz data is loaded
  React.useEffect(() => {
    if (isEditMode && quiz) {
      form.reset({
        question: quiz.question,
        option_a: quiz.option_a,
        option_b: quiz.option_b,
        option_c: quiz.option_c || '',
        // Check if option_d exists on the quiz object before accessing it
        option_d: quiz.option_d !== undefined ? quiz.option_d : '',
        correct_option: quiz.correct_option as 'A' | 'B' | 'C' | 'D',
        explanation: quiz.explanation || ''
      });
    }
  }, [quiz, form, isEditMode]);

  // Create quiz mutation
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!moduleId) throw new Error("Module ID is required");
      
      // Ensure all required fields are present
      const quizData: Quiz = {
        module_id: moduleId,
        question: data.question,
        option_a: data.option_a,
        option_b: data.option_b,
        option_c: data.option_c || null,
        option_d: data.option_d || null,
        correct_option: data.correct_option,
        explanation: data.explanation || null
      };
      
      return createQuiz(quizData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Quiz question created successfully."
      });
      navigate(`/admin/modules/${moduleId}/quiz`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quiz question.",
        variant: "destructive"
      });
    }
  });

  // Update quiz mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!moduleId || !quizId) throw new Error("Module ID and Quiz ID are required");
      
      // Ensure all required fields are present
      const quizData: Quiz = {
        module_id: moduleId,
        question: data.question,
        option_a: data.option_a,
        option_b: data.option_b,
        option_c: data.option_c || null,
        option_d: data.option_d || null,
        correct_option: data.correct_option,
        explanation: data.explanation || null
      };
      
      return updateQuiz(quizId, quizData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Quiz question updated successfully."
      });
      navigate(`/admin/modules/${moduleId}/quiz`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quiz question.",
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

  if (isEditMode && isLoadingQuiz) {
    return <div>Loading question...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/admin/modules/${moduleId}/quiz`)}
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Quiz Question' : 'Create Quiz Question'}
        </h2>
      </div>
      
      <p className="text-gray-500 mb-6">
        For module: {module?.title || 'Loading...'}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your quiz question" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="option_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option A</FormLabel>
                  <FormControl>
                    <Input placeholder="First option" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="option_b"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option B</FormLabel>
                  <FormControl>
                    <Input placeholder="Second option" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="option_c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option C (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Third option" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="option_d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option D (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Fourth option" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="correct_option"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">Option A</SelectItem>
                    <SelectItem value="B">Option B</SelectItem>
                    <SelectItem value="C">Option C</SelectItem>
                    <SelectItem value="D">Option D</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explanation for the correct answer" 
                    {...field} 
                    value={field.value || ''}
                    className="min-h-[100px]"
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
              onClick={() => navigate(`/admin/modules/${moduleId}/quiz`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-1"
            >
              <Save size={16} />
              {isEditMode ? 'Update Question' : 'Create Question'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuizEdit;
