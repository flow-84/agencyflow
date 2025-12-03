import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export default function ChatterDashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: shifts = [] } = useQuery({
    queryKey: ['myShifts', user?.email],
    queryFn: () => base44.entities.Shift.filter({ chatter_email: user?.email }, '-date'),
    enabled: !!user?.email,
  });

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ 
      target_role: 'chatter' 
    }),
  });

  const { data: allMaterials = [] } = useQuery({
    queryKey: ['allMaterials'],
    queryFn: () => base44.entities.TrainingMaterial.filter({ target_role: 'all' }),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['myProgress', user?.email],
    queryFn: () => base44.entities.TrainingProgress.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const allTrainingMaterials = [...materials, ...allMaterials];
  const completedTrainings = progress.filter(p => p.status === 'completed').length;
  const totalTrainings = allTrainingMaterials.length;
  const trainingPercent = totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0;

  const upcomingShifts = shifts
    .filter(s => new Date(s.date) >= new Date() && s.status !== 'cancelled')
    .slice(0, 3);

  const todayShift = shifts.find(s => isToday(parseISO(s.date)) && s.status !== 'cancelled');

  const getDateLabel = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Heute';
    if (isTomorrow(date)) return 'Morgen';
    return format(date, 'EEEE, d. MMM', { locale: de });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Hallo, {user?.full_name?.split(' ')[0] || 'Chatter'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Hier ist deine persönliche Übersicht
        </p>
      </motion.div>

      {/* Today's Shift Banner */}
      {todayShift && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-200 text-sm font-medium">Deine Schicht heute</p>
                  <h2 className="text-2xl font-bold mt-1">
                    {todayShift.start_time} - {todayShift.end_time}
                  </h2>
                  {todayShift.assigned_model && (
                    <p className="text-violet-200 mt-2">
                      Zugewiesenes Model: {todayShift.assigned_model}
                    </p>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {todayShift.status === 'active' ? 'Aktiv' : 'Geplant'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  Kommende Schichten
                </CardTitle>
                <Link to={createPageUrl("MyShifts")}>
                  <Button variant="ghost" size="sm" className="text-violet-600">
                    Alle anzeigen
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingShifts.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  Keine anstehenden Schichten
                </p>
              ) : (
                upcomingShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {getDateLabel(shift.date)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {shift.start_time} - {shift.end_time}
                      </p>
                    </div>
                    {shift.assigned_model && (
                      <Badge variant="outline" className="bg-white">
                        {shift.assigned_model}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Training Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Schulungsfortschritt
                </CardTitle>
                <Link to={createPageUrl("MyTraining")}>
                  <Button variant="ghost" size="sm" className="text-emerald-600">
                    Zur Schulung
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${trainingPercent * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-slate-900">{trainingPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{completedTrainings}</p>
                  <p className="text-xs text-slate-500">Abgeschlossen</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900">{totalTrainings - completedTrainings}</p>
                  <p className="text-xs text-slate-500">Ausstehend</p>
                </div>
              </div>

              {allTrainingMaterials.filter(m => m.is_required).length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>{allTrainingMaterials.filter(m => m.is_required && !progress.find(p => p.material_id === m.id && p.status === 'completed')).length}</strong> Pflichtschulungen ausstehend
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {shifts.filter(s => s.status === 'completed').length}
            </p>
            <p className="text-xs text-slate-500">Abgeschl. Schichten</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{upcomingShifts.length}</p>
            <p className="text-xs text-slate-500">Anstehend</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{completedTrainings}</p>
            <p className="text-xs text-slate-500">Schulungen ✓</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-violet-600">{trainingPercent}%</p>
            <p className="text-xs text-slate-500">Fortschritt</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function GraduationCap(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}