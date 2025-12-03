import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, CheckCircle, Play, FileText, BookOpen, HelpCircle, Clock, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function MyTraining() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: chatterMaterials = [] } = useQuery({
    queryKey: ['chatterMaterials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ target_role: 'chatter' }),
  });

  const { data: allMaterials = [] } = useQuery({
    queryKey: ['allMaterials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ target_role: 'all' }),
  });

  const materials = [...chatterMaterials, ...allMaterials];

  const { data: progress = [] } = useQuery({
    queryKey: ['myProgress', user?.email],
    queryFn: () => base44.entities.TrainingProgress.filter({ user_email: user?.email }),
    enabled: !!user?.email,
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

  const getProgressForMaterial = (materialId) => {
    return progress.find(p => p.material_id === materialId);
  };

  const handleStartMaterial = (material) => {
    setSelectedMaterial(material);
    const existingProgress = getProgressForMaterial(material.id);
    
    if (!existingProgress) {
      createProgressMutation.mutate({
        user_email: user?.email,
        material_id: material.id,
        status: 'in_progress',
        progress_percent: 0,
      });
    }
  };

  const handleCompleteMaterial = (material) => {
    const existingProgress = getProgressForMaterial(material.id);
    
    if (existingProgress) {
      updateProgressMutation.mutate({
        id: existingProgress.id,
        data: {
          status: 'completed',
          progress_percent: 100,
          completed_at: new Date().toISOString(),
        },
      });
    } else {
      createProgressMutation.mutate({
        user_email: user?.email,
        material_id: material.id,
        status: 'completed',
        progress_percent: 100,
        completed_at: new Date().toISOString(),
      });
    }
    setSelectedMaterial(null);
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
        <p className="text-slate-500 mt-1">Lerne und entwickle deine Fähigkeiten</p>
      </motion.div>

      {/* Progress Overview */}
      <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Gesamtfortschritt</p>
              <h2 className="text-3xl font-bold mt-1">{overallProgress}% abgeschlossen</h2>
              <p className="text-emerald-100 mt-1">
                {completedCount} von {materials.length} Schulungen
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
            placeholder="Schulung suchen..."
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
          {filteredMaterials.map(material => {
            const type = typeConfig[material.type] || typeConfig.article;
            const Icon = type.icon;
            const materialProgress = getProgressForMaterial(material.id);
            const isCompleted = materialProgress?.status === 'completed';

            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -4 }}
              >
                <Card className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all ${
                  isCompleted ? 'ring-2 ring-emerald-200' : ''
                }`}>
                  <div className={`h-32 ${type.color} flex items-center justify-center relative`}>
                    <Icon className="w-12 h-12 opacity-50" />
                    {isCompleted && (
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-emerald-500 text-white">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    {material.is_required && !isCompleted && (
                      <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0">
                        Pflicht
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <Badge variant="outline" className="text-xs mb-2">
                      {categoryLabels[material.category] || material.category}
                    </Badge>

                    <h3 className="font-semibold text-slate-900 line-clamp-2 min-h-[48px]">
                      {material.title}
                    </h3>

                    {material.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {material.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {material.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{material.duration_minutes} Min.</span>
                        </div>
                      )}
                      <Badge className={`${type.color} border-0`}>
                        {type.label}
                      </Badge>
                    </div>

                    <Button
                      className={`w-full mt-4 ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                      onClick={() => handleStartMaterial(material)}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Abgeschlossen
                        </>
                      ) : materialProgress?.status === 'in_progress' ? (
                        'Fortsetzen'
                      ) : (
                        'Starten'
                      )}
                    </Button>
                  </CardContent>
                </Card>
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
          <h3 className="text-lg font-medium text-slate-900">Keine Schulungen</h3>
          <p className="text-slate-500 mt-1">Keine passenden Schulungen gefunden.</p>
        </div>
      )}

      {/* Material Viewer Dialog */}
      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-6 mt-4">
              {selectedMaterial.description && (
                <p className="text-slate-600">{selectedMaterial.description}</p>
              )}

              {selectedMaterial.file_url ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                    <a
                      href={selectedMaterial.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 text-violet-600 hover:text-violet-700"
                    >
                      <ExternalLink className="w-8 h-8" />
                      <span>Material öffnen</span>
                    </a>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleCompleteMaterial(selectedMaterial)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Als abgeschlossen markieren
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Kein Material verfügbar
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}