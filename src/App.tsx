
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrainingSlide from "./pages/TrainingSlide";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModulesList from "./pages/admin/ModulesList";
import ModuleEdit from "./pages/admin/ModuleEdit";
import SlidesList from "./pages/admin/SlidesList";
import SlideEdit from "./pages/admin/SlideEdit";
import QuizzesList from "./pages/admin/QuizzesList";
import QuizEdit from "./pages/admin/QuizEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training/:moduleId" element={<TrainingSlide />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="modules" element={<ModulesList />} />
            <Route path="modules/new" element={<ModuleEdit />} />
            <Route path="modules/:id" element={<ModuleEdit />} />
            <Route path="modules/:moduleId/slides" element={<SlidesList />} />
            <Route path="modules/:moduleId/slides/new" element={<SlideEdit />} />
            <Route path="modules/:moduleId/slides/:slideId" element={<SlideEdit />} />
            <Route path="modules/:moduleId/quiz" element={<QuizzesList />} />
            <Route path="modules/:moduleId/quiz/new" element={<QuizEdit />} />
            <Route path="modules/:moduleId/quiz/:quizId" element={<QuizEdit />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
