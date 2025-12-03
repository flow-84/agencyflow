import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Play, FileText, CheckCircle, Clock, Award, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/training/VideoPlayer";
import QuizPlayer from "@/components/training/QuizPlayer";
import { motion } from "framer-motion";

export default function TrainingCourse() {
  const urlParams = new URLSearchParams(window.location.search);
  const materialId = urlParams.get('id');
  const [activeTab, setActiveTab] = useState('video');

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: material, isLoading: materialLoading } = useQuery({
    queryKey: ['material', materialId],
    queryFn: async () => {
      const materials = await base44.entities.TrainingMaterial.filter({ id: materialId });
      return materials[0];
    },
    enabled: !!materialId,
  });

  const { data: progress } = useQuery({
    queryKey: ['myProgress', user?.email, materialId],
    queryFn: async () => {
      const progresses = await base44.entities.TrainingProgress.filter({ 
        user_email: user?.email,
        material_id: materialId 
      });
      return progresses[0];
    },
    enabled: !!user?.email && !!materialId,
  });

  const { data: quiz } = useQuery({
    queryKey: ['quiz', materialId],
    queryFn: async () => {
      const quizzes = await base44.entities.Quiz.filter({ training_material_id: materialId });
      return quizzes[0];
    },
    enabled: !!materialId,
  });

  const createProgressMutation = useMutation({
    mutationFn: (data) => base44.entities.TrainingProgress.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProgress'] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TrainingProgress.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProgress'] });
    },
  });

  // Initialize progress when starting course
  useEffect(() => {
    if (user?.email && materialId && !progress) {
      createProgressMutation.mutate({
        user_email: user.email,
        material_id: materialId,
        status: 'in_progress',
        progress_percent: 0,
        video_progress_seconds: 0,
        quiz_attempts: 0,
      });
    }
  }, [user?.email, materialId, progress]);

  const handleVideoProgress = (seconds, percent) => {
    if (progress) {
      updateProgressMutation.mutate({
        id: progress.id,
        data: {
          video_progress_seconds: seconds,
          progress_percent: quiz ? Math.min(percent * 0.7, 70) : percent,
          status: 'in_progress',
        },
      });
    }
  };

  const handleVideoComplete = () => {
    if (progress) {
      const newPercent = quiz ? 70 : 100;
      const newStatus = quiz ? 'in_progress' : 'completed';
      
      updateProgressMutation.mutate({
        id: progress.id,
        data: {
          progress_percent: newPercent,
          status: newStatus,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() }),
        },
      });

      if (quiz) {
        setActiveTab('quiz');
      }
    }
  };

  const handleQuizComplete = (score, passed) => {
    if (progress) {
      updateProgressMutation.mutate({
        id: progress.id,
        data: {
          quiz_score: score,
          quiz_passed: passed,
          quiz_attempts: (progress.quiz_attempts || 0) + 1,
          ...(passed && {
            progress_percent: 100,
            status: 'completed',
            completed_at: new Date().toISOString(),
          }),
        },
      });
    }
  };

  if (materialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Kurs nicht gefunden</h2>
        <Link to={createPageUrl("MyTraining")}>
          <Button variant="link" className="mt-4">
            Zurück zur Übersicht
          </Button>
        </Link>
      </div>
    );
  }

  const isCompleted = progress?.status === 'completed';
  const currentProgress = progress?.progress_percent || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to={createPageUrl("MyTraining")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Übersicht
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {material.is_required && (
                <Badge className="bg-rose-100 text-rose-700 border-0">Pflicht</Badge>
              )}
              {isCompleted && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Abgeschlossen
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{material.title}</h1>
            {material.description && (
              <p className="text-slate-500 mt-2">{material.description}</p>
            )}
          </div>
          
          {material.duration_minutes && (
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{material.duration_minutes} Min.</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mt-6 border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Fortschritt</span>
              <span className="text-sm font-bold text-violet-600">{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${currentProgress >= 70 || !quiz ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Video
              </div>
              {quiz && (
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${progress?.quiz_passed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Quiz
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="video" className="data-[state=active]:bg-white">
            <Play className="w-4 h-4 mr-2" />
            Video
          </TabsTrigger>
          {quiz && (
            <TabsTrigger 
              value="quiz" 
              className="data-[state=active]:bg-white"
              disabled={currentProgress < 70}
            >
              <Award className="w-4 h-4 mr-2" />
              Quiz
              {currentProgress < 70 && (
                <Badge variant="outline" className="ml-2 text-xs">Gesperrt</Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="video" className="mt-6">
          <VideoPlayer
            videoUrl={material.file_url}
            title={material.title}
            totalDuration={(material.duration_minutes || 10) * 60}
            savedProgress={progress?.video_progress_seconds || 0}
            onProgressUpdate={handleVideoProgress}
            onComplete={handleVideoComplete}
          />

          {!material.file_url && (
            <Card className="mt-4 p-6 text-center bg-slate-50">
              <p className="text-slate-500">
                Kein Video verfügbar. Bitte kontaktiere den Administrator.
              </p>
            </Card>
          )}

          {quiz && currentProgress >= 70 && (
            <Card className="mt-6 p-6 bg-violet-50 border-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-violet-900">Video abgeschlossen!</h3>
                  <p className="text-violet-700 text-sm">
                    Jetzt kannst du das Quiz absolvieren, um den Kurs abzuschließen.
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab('quiz')}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Zum Quiz
                  <Award className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {quiz && (
          <TabsContent value="quiz" className="mt-6">
            {progress?.quiz_passed ? (
              <Card className="p-8 text-center bg-emerald-50">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz bereits bestanden!</h2>
                <p className="text-slate-600">
                  Du hast das Quiz mit <span className="font-bold">{progress.quiz_score}%</span> bestanden.
                </p>
              </Card>
            ) : (
              <QuizPlayer
                quiz={quiz}
                onComplete={handleQuizComplete}
                passingScore={quiz.passing_score || 70}
                previousScore={progress?.quiz_score}
                attempts={progress?.quiz_attempts || 0}
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}