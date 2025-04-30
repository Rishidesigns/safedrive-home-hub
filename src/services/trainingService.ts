
import { supabase } from "@/integrations/supabase/client";

export interface TrainingModule {
  id?: string;
  title: string;
  description: string | null;
  status: 'draft' | 'published';
  created_at?: string;
}

export interface Slide {
  id?: string;
  module_id: string;
  hero_text: string;
  description: string | null;
  hero_image_url: string | null;
  order: number;
  created_at?: string;
}

export interface Quiz {
  id?: string;
  module_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
  created_at?: string;
}

// Training Modules
export const getTrainingModules = async () => {
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getTrainingModule = async (id: string) => {
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createTrainingModule = async (module: TrainingModule) => {
  const { data, error } = await supabase
    .from('training_modules')
    .insert(module)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateTrainingModule = async (id: string, module: TrainingModule) => {
  const { data, error } = await supabase
    .from('training_modules')
    .update(module)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteTrainingModule = async (id: string) => {
  const { error } = await supabase
    .from('training_modules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Slides
export const getSlides = async (moduleId: string) => {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('module_id', moduleId)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getSlide = async (id: string) => {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createSlide = async (slide: Slide) => {
  const { data, error } = await supabase
    .from('slides')
    .insert(slide)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateSlide = async (id: string, slide: Slide) => {
  const { data, error } = await supabase
    .from('slides')
    .update(slide)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteSlide = async (id: string) => {
  const { error } = await supabase
    .from('slides')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Quizzes
export const getQuizzes = async (moduleId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getQuiz = async (id: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createQuiz = async (quiz: Quiz) => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert(quiz)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateQuiz = async (id: string, quiz: Quiz) => {
  const { data, error } = await supabase
    .from('quizzes')
    .update(quiz)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteQuiz = async (id: string) => {
  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Storage utility functions
export const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('training_images')
    .upload(filePath, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('training_images')
    .getPublicUrl(filePath);
  
  return publicUrl;
};
