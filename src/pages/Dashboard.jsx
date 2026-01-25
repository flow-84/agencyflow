import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, ClipboardList, Calendar, GraduationCap, UserCircle, TrendingUp, Camera, Network } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ModelsGallery from "@/components/models/ModelsGallery";
import TeamMindmap from "@/components/team/TeamMindmap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function Dashboard() {
  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.Application.list('-created_date', 100),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: shifts = [] } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => base44.entities.Shift.list('-date', 50),
  });

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  const { data: trainings = [] } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => base44.entities.TrainingMaterial.list(),
  });

  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const todayShifts = shifts.filter(s => s.date === format(new Date(), 'yyyy-MM-dd')).length;
  const activeModels = models.filter(m => m.status === 'active').length;

  const recentActivities = [
    ...applications.slice(0, 3).map(a => ({
      id: a.id,
      type: 'application',
      title: `Neue Bewerbung: ${a.applicant_name}`,
      description: `Als ${a.role_type === 'chatter' ? 'Chatter' : 'Model'}`,
      date: a.created_date,
    })),
    ...shifts.slice(0, 2).map(s => ({
      id: s.id,
      type: 'shift',
      title: `Schicht geplant`,
      description: `${s.chatter_name || s.chatter_email} - ${s.start_time} bis ${s.end_time}`,
      date: s.created_date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Willkommen zurück! Hier ist deine Übersicht.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard
          title="Offene Bewerbungen"
          value={pendingApplications}
          subtitle={`${applications.length} insgesamt`}
          icon={ClipboardList}
          color="violet"
        />
        <StatsCard
          title="Aktive Nutzer"
          value={activeUsers}
          subtitle={`${users.length} registriert`}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Schichten heute"
          value={todayShifts}
          subtitle="Geplante Schichten"
          icon={Calendar}
          color="emerald"
        />
        <StatsCard
          title="Aktive Models"
          value={activeModels}
          subtitle={`${models.length} insgesamt`}
          icon={UserCircle}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Aktivität</TabsTrigger>
              <TabsTrigger value="models">
                <Camera className="w-4 h-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger value="team">
                <Network className="w-4 h-4 mr-2" />
                Team Map
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-6">
              <ActivityFeed activities={recentActivities} />
            </TabsContent>
            <TabsContent value="models" className="mt-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-pink-600" />
                    Models Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ModelsGallery />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="mt-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Network className="w-5 h-5 text-violet-600" />
                    Team Hierarchie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamMindmap />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Stats - moved below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Schnellübersicht
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Schulungsmaterial</span>
              <span className="font-semibold text-slate-900">{trainings.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Genehmigte Bewerbungen</span>
              <span className="font-semibold text-emerald-600">
                {applications.filter(a => a.status === 'approved').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Models mit Vertrag</span>
              <span className="font-semibold text-slate-900">
                {models.filter(m => m.contract_signed).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Abgeschl. Schichten</span>
              <span className="font-semibold text-slate-900">
                {shifts.filter(s => s.status === 'completed').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}