import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { MessageCircle, Camera, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // If user already has a role, redirect
  useEffect(() => {
    if (user?.user_role) {
      if (user.user_role === 'model') {
        window.location.href = createPageUrl('ModelDashboard');
      } else if (user.user_role === 'chatter') {
        window.location.href = createPageUrl('ChatterDashboard');
      }
    }
    if (user?.role === 'admin') {
      window.location.href = createPageUrl('Dashboard');
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (role) => base44.auth.updateMe({ user_role: role }),
    onSuccess: (_, role) => {
      if (role === 'model') {
        window.location.href = createPageUrl('ModelDashboard');
      } else {
        window.location.href = createPageUrl('ChatterDashboard');
      }
    },
  });

  const handleContinue = () => {
    if (selectedRole) {
      updateMutation.mutate(selectedRole);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Willkommen, {user?.full_name}!
          </h1>
          <p className="text-slate-300 text-lg">
            Wähle deine Rolle, um fortzufahren
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Chatter Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedRole === 'chatter' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
              onClick={() => setSelectedRole('chatter')}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                  selectedRole === 'chatter' ? 'bg-blue-500' : 'bg-blue-500/20'
                }`}>
                  <MessageCircle className={`w-10 h-10 ${
                    selectedRole === 'chatter' ? 'text-white' : 'text-blue-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chatter</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Kommuniziere mit Fans, absolviere Schulungen und verwalte deine Schichten
                </p>
                <ul className="text-left space-y-2">
                  {["Schichtplan einsehen", "Video-Schulungen", "Quiz absolvieren"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                {selectedRole === 'chatter' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Model Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedRole === 'model' 
                  ? 'border-pink-500 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
              onClick={() => setSelectedRole('model')}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                  selectedRole === 'model' ? 'bg-pink-500' : 'bg-pink-500/20'
                }`}>
                  <Camera className={`w-10 h-10 ${
                    selectedRole === 'model' ? 'text-white' : 'text-pink-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Model</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Verwalte dein Profil, unterschreibe Verträge und chatte mit dem Team
                </p>
                <ul className="text-left space-y-2">
                  {["Profil verwalten", "Verträge unterschreiben", "Team Chat"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-pink-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                {selectedRole === 'model' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || updateMutation.isPending}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-12 py-6 text-lg shadow-xl shadow-violet-500/25"
          >
            {updateMutation.isPending ? (
              'Wird gespeichert...'
            ) : (
              <>
                Weiter
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}