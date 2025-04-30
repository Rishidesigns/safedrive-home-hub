
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQuizzes, deleteQuiz, getTrainingModule } from '@/services/trainingService';
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
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Plus, Trash2, Check } from 'lucide-react';

const QuizzesList: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // Fetch module and quiz data
  const { data: module } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getTrainingModule(moduleId!)
  });

  const { data: quizzes, isLoading, error, refetch } = useQuery({
    queryKey: ['quizzes', moduleId],
    queryFn: () => moduleId ? getQuizzes(moduleId) : Promise.resolve([])
  });

  // Delete quiz mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      toast({
        title: "Question deleted",
        description: "The quiz question has been successfully deleted."
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the quiz question.",
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
          Quiz Questions for {module?.title || 'Module'}
        </h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Manage the quiz questions for this training module
        </p>
        <Button asChild>
          <Link to={`/admin/modules/${moduleId}/quiz/new`} className="flex items-center gap-1">
            <Plus size={16} />
            Add Question
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p className="text-red-500">Error loading quiz questions</p>
      ) : quizzes && quizzes.length > 0 ? (
        <div className="space-y-6">
          {quizzes.map((quiz, index) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{quiz.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-md border ${quiz.correct_option === 'A' ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    {quiz.correct_option === 'A' && (
                      <Badge className="bg-green-500 mb-1 flex w-fit items-center gap-1">
                        <Check size={12} />
                        Correct
                      </Badge>
                    )}
                    <span className="font-medium text-sm">A:</span> {quiz.option_a}
                  </div>
                  
                  <div className={`p-3 rounded-md border ${quiz.correct_option === 'B' ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    {quiz.correct_option === 'B' && (
                      <Badge className="bg-green-500 mb-1 flex w-fit items-center gap-1">
                        <Check size={12} />
                        Correct
                      </Badge>
                    )}
                    <span className="font-medium text-sm">B:</span> {quiz.option_b}
                  </div>
                  
                  {quiz.option_c && (
                    <div className={`p-3 rounded-md border ${quiz.correct_option === 'C' ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      {quiz.correct_option === 'C' && (
                        <Badge className="bg-green-500 mb-1 flex w-fit items-center gap-1">
                          <Check size={12} />
                          Correct
                        </Badge>
                      )}
                      <span className="font-medium text-sm">C:</span> {quiz.option_c}
                    </div>
                  )}
                  
                  {quiz.option_d && (
                    <div className={`p-3 rounded-md border ${quiz.correct_option === 'D' ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      {quiz.correct_option === 'D' && (
                        <Badge className="bg-green-500 mb-1 flex w-fit items-center gap-1">
                          <Check size={12} />
                          Correct
                        </Badge>
                      )}
                      <span className="font-medium text-sm">D:</span> {quiz.option_d}
                    </div>
                  )}
                </div>
                
                {quiz.explanation && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-700">{quiz.explanation}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/admin/modules/${moduleId}/quiz/${quiz.id}`}>
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
                      <AlertDialogTitle>Delete Question</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this quiz question? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => quiz.id && handleDelete(quiz.id)}
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
          <p className="text-gray-500">No quiz questions found for this module</p>
          <Button asChild className="mt-4">
            <Link to={`/admin/modules/${moduleId}/quiz/new`}>Create your first quiz question</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizzesList;
