import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { UserCircle, FileText, TrendingUp, Users, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function ModelDashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.ModelProfile.filter({ user_email: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['myDocs', user?.email],
    queryFn: () => base44.entities.Document.filter({ owner_email: user?.email }),
    enabled: !!user?.email,
  });

  const signedDocs = documents.filter(d => d.is_signed).length;
  const pendingDocs = documents.filter(d => !d.is_signed).length;

  const profileCompleteness = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.display_name) score += 20;
    if (profile.bio) score += 20;
    if (profile.onlyfans_username) score += 20;
    if (profile.profile_image_url) score += 20;
    if (profile.contract_signed) score += 20;
    return score;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Willkommen, {profile?.display_name || user?.full_name?.split(' ')[0] || 'Model'}! ✨
        </h1>
        <p className="text-slate-500 mt-1">
          Dein persönliches Dashboard
        </p>
      </motion.div>

      {/* Profile Status Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`border-0 shadow-xl ${
          profile?.status === 'active' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-r from-amber-500 to-orange-600'
        } text-white`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.display_name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-white/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">{profile?.display_name || 'Profil erstellen'}</h2>
                  {profile?.onlyfans_username && (
                    <p className="text-white/80 text-sm truncate">@{profile.onlyfans_username}</p>
                  )}
                  <Badge className={`mt-1 sm:mt-2 ${
                    profile?.status === 'active' ? 'bg-white/20' : 'bg-white/20'
                  }`}>
                    {profile?.status === 'active' ? 'Aktiv' : 
                     profile?.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
                  </Badge>
                </div>
              </div>
              <Link to={createPageUrl("MyProfile")} className="w-full sm:w-auto">
                <Button className="bg-white/20 hover:bg-white/30 text-white w-full sm:w-auto">
                  Profil bearbeiten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Completeness */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-violet-600" />
                Profil-Vollständigkeit
              </CardTitle>
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
                      stroke="#8b5cf6"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${profileCompleteness() * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{profileCompleteness()}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Künstlername</span>
                  {profile?.display_name ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Biografie</span>
                  {profile?.bio ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Profilbild</span>
                  {profile?.profile_image_url ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Vertrag unterschrieben</span>
                  {profile?.contract_signed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Meine Dokumente
                </CardTitle>
                <Link to={createPageUrl("MyDocuments")}>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Alle anzeigen
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-600">{signedDocs}</p>
                  <p className="text-sm text-slate-500">Unterschrieben</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{pendingDocs}</p>
                  <p className="text-sm text-slate-500">Ausstehend</p>
                </div>
              </div>

              {pendingDocs > 0 && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>{pendingDocs}</strong> Dokument(e) warten auf deine Unterschrift
                  </p>
                </div>
              )}

              {documents.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[150px]">{doc.title}</span>
                  </div>
                  {doc.is_signed ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">✓</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 border-0">Offen</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats */}
      {profile?.onlyfans_stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-600" />
                OnlyFans Statistiken
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-xl">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {profile.onlyfans_stats.subscribers?.toLocaleString() || '-'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">Abonnenten</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      ${profile.onlyfans_stats.earnings?.toLocaleString() || '-'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">Umsatz</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-violet-50 rounded-xl">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {profile.onlyfans_stats.posts || '-'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">Posts</p>
                  </div>
                </div>
              </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}