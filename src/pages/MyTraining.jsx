import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, CheckCircle, Play, FileText, BookOpen, HelpCircle, Clock, Award, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function MyTraining() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: chatterMaterials = [] } = useQuery({
    queryKey: ['chatterMaterials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ target_role: 'chatter' }, 'order'),
  });

  const { data: allMaterials = [] } = useQuery({
    queryKey: ['allMaterials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ target_role: 'all' }, 'order'),
  });

  const materials = [...chatterMaterials, ...allMaterials].sort((a, b) => (a.order || 0) - (b.order || 0));

  const { data: progress = [] } = useQuery({
    queryKey: ['myProgress', user?.email],
    queryFn: () => base44.entities.TrainingProgress.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => base44.entities.Quiz.list(),
  });

  const getProgressForMaterial = (materialId) => {
    return progress.find(p => p.material_id === materialId);
  };

  const getQuizForMaterial = (materialId) => {
    return quizzes.find(q => q.training_material_id === materialId);
  };

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || mat.category === categoryFilter;
    const materialProgress = getProgressForMaterial(mat.id);
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "completed" && materialProgress?.status === 'completed') ||
      (statusFilter === "pending" && materialProgress?.status !== 'completed');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = materials.filter(m => getProgressForMaterial(m.id)?.status === 'completed').length;
  const overallProgress = materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  const typeConfig = {
    video: { icon: Play, color: "bg-red-100 text-red-600", label: "Video" },
    pdf: { icon: FileText, color: "bg-blue-100 text-blue-600", label: "PDF" },
    article: { icon: BookOpen, color: "bg-emerald-100 text-emerald-600", label: "Artikel" },
    quiz: { icon: HelpCircle, color: "bg-amber-100 text-amber-600", label: "Quiz" },
  };

  const categoryLabels = {
    onboarding: "Einführung",
    advanced: "Fortgeschritten",
    compliance: "Compliance",
    sales: "Verkauf",
    communication: "Kommunikation",
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Meine Schulungen</h1>
        <p className="text-slate-500 mt-1">Absolviere Video-Kurse und Quizzes</p>
      </motion.div>

      {/* Progress Overview */}
      <Card className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-violet-100 text-sm font-medium">Gesamtfortschritt</p>
              <h2 className="text-3xl font-bold mt-1">{overallProgress}% abgeschlossen</h2>
              <p className="text-violet-100 mt-1">
                {completedCount} von {materials.length} Kursen
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Progress value={overallProgress} className="h-3 bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Kurs suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="pending">Ausstehend</TabsTrigger>
            <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMaterials.map((material, index) => {
            const type = typeConfig[material.type] || typeConfig.video;
            const Icon = type.icon;
            const materialProgress = getProgressForMaterial(material.id);
            const hasQuiz = getQuizForMaterial(material.id);
            const isCompleted = materialProgress?.status === 'completed';
            const progressPercent = materialProgress?.progress_percent || 0;
            const isInProgress = materialProgress?.status === 'in_progress';

            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`TrainingCourse?id=${material.id}`)}>
                  <Card className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group ${
                    isCompleted ? 'ring-2 ring-emerald-200' : ''
                  }`}>
                    {/* Thumbnail/Type Header */}
                    <div className={`h-36 ${type.color} flex items-center justify-center relative overflow-hidden`}>
                      {material.thumbnail_url ? (
                        <img 
                          src={material.thumbnail_url} 
                          alt={material.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-16 h-16 opacity-30" />
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {isCompleted && (
                          <div className="p-2 rounded-full bg-emerald-500 text-white">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        {hasQuiz && (
                          <Badge className="bg-amber-500 text-white border-0">
                            <Award className="w-3 h-3 mr-1" />
                            Quiz
                          </Badge>
                        )}
                      </div>

                      {material.is_required && !isCompleted && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0">
                          Pflicht
                        </Badge>
                      )}

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[material.category] || material.category}
                        </Badge>
                        <Badge className={`${type.color} border-0 text-xs`}>
                          {type.label}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-slate-900 line-clamp-2 min-h-[48px] group-hover:text-violet-600 transition-colors">
                        {material.title}
                      </h3>

                      <div className="flex items-center justify-between mt-4 text-sm">
                        {material.duration_minutes && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{material.duration_minutes} Min.</span>
                          </div>
                        )}
                        
                        {isInProgress && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(progressPercent)}% erledigt
                          </Badge>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {(isInProgress || isCompleted) && (
                        <div className="mt-4">
                          <Progress 
                            value={progressPercent} 
                            className={`h-1.5 ${isCompleted ? 'bg-emerald-100' : ''}`}
                          />
                        </div>
                      )}

                      <Button
                        className={`w-full mt-4 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Abgeschlossen
                          </>
                        ) : isInProgress ? (
                          'Fortsetzen'
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Starten
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Keine Kurse</h3>
          <p className="text-slate-500 mt-1">Keine passenden Schulungen gefunden.</p>
        </div>
      )}
    </div>
  );
}