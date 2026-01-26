import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, FileText, BookOpen, HelpCircle, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TrainingCard({ material, progress, onStart }) {
  const typeConfig = {
    video: { icon: Play, color: "bg-red-100 text-red-600" },
    pdf: { icon: FileText, color: "bg-blue-100 text-blue-600" },
    article: { icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
    quiz: { icon: HelpCircle, color: "bg-amber-100 text-amber-600" },
  };

  const categoryLabels = {
    onboarding: "Einführung",
    advanced: "Fortgeschritten",
    compliance: "Compliance",
    sales: "Verkauf",
    communication: "Kommunikation",
  };

  const type = typeConfig[material.type] || typeConfig.article;
  const Icon = type.icon;
  const isCompleted = progress?.status === 'completed';
  const progressPercent = progress?.progress_percent || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50 hover:shadow-xl transition-all">
        {material.thumbnail_url ? (
          <div className="relative h-40 bg-slate-100">
            <img
              src={material.thumbnail_url}
              alt={material.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className={`absolute top-3 left-3 p-2 rounded-lg ${type.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            {isCompleted && (
              <div className="absolute top-3 right-3 p-2 rounded-full bg-emerald-500 text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        ) : (
          <div className={`h-32 ${type.color} flex items-center justify-center`}>
            <Icon className="w-12 h-12 opacity-50" />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-medium">
              {categoryLabels[material.category] || material.category}
            </Badge>
            {material.is_required && (
              <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
                Pflicht
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 min-h-[48px]">
            {material.title}
          </h3>

          {material.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {material.description}
            </p>
          )}

          {material.duration_minutes && (
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{material.duration_minutes} Min.</span>
            </div>
          )}

          {progressPercent > 0 && !isCompleted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Fortschritt</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          )}

          <Button
            className={`w-full mt-4 ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            }`}
            onClick={() => onStart(material)}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Abgeschlossen
              </>
            ) : progressPercent > 0 ? (
              'Fortsetzen'
            ) : (
              'Starten'
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}