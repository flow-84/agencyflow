import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  Star, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  MessageCircle,
  Camera,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Welcome() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          // Redirect based on role
          if (user.role === 'admin' || user.user_role === 'admin') {
            window.location.href = createPageUrl('Dashboard');
          } else if (user.user_role === 'model') {
            window.location.href = createPageUrl('ModelDashboard');
          } else {
            window.location.href = createPageUrl('ChatterDashboard');
          }
        } else {
          setIsChecking(false);
        }
      } catch {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">Agency Hub</span>
          </div>
          <Button 
            onClick={handleLogin}
            className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
          >
            Anmelden
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Willkommen bei
              <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Agency Hub
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Die professionelle Management-Plattform für Models und Chatter. 
              Verwalte Profile, Schichten und Schulungen an einem Ort.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg"
              onClick={handleLogin}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl shadow-violet-500/25"
            >
              <Shield className="w-5 h-5 mr-2" />
              Als Admin anmelden
            </Button>
            <Link to={createPageUrl("Apply")}>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/5 backdrop-blur-sm text-white border-white/20 hover:bg-white/10 px-8 py-6 text-lg w-full"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Jetzt bewerben
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Für wen ist Agency Hub?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Administratoren</h3>
                  <p className="text-slate-400 mb-6">
                    Vollständige Kontrolle über Bewerbungen, Nutzer, Schichten und Schulungen.
                  </p>
                  <ul className="space-y-2">
                    {["Bewerbungen verwalten", "Schichten planen", "Schulungen erstellen", "Nutzer administrieren"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-violet-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chatter Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Chatter</h3>
                  <p className="text-slate-400 mb-6">
                    Zugriff auf Schichtpläne und Pflichtschulungen mit Video-Kursen und Quizzes.
                  </p>
                  <ul className="space-y-2">
                    {["Schichten einsehen", "Video-Schulungen", "Quizzes absolvieren", "Fortschritt tracken"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Model Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Models</h3>
                  <p className="text-slate-400 mb-6">
                    Profilverwaltung, Vertragsunterzeichnung und interner Chat mit dem Team.
                  </p>
                  <ul className="space-y-2">
                    {["Profil verwalten", "Verträge unterschreiben", "Team-Chat", "Dokumente einsehen"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-pink-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Bereit durchzustarten?
            </h2>
            <p className="text-slate-300 mb-8">
              Bewirb dich jetzt als Chatter oder Model und werde Teil unseres Teams.
            </p>
            <Link to={createPageUrl("Apply")}>
              <Button 
                size="lg"
                className="bg-white text-violet-900 hover:bg-slate-100 px-8"
              >
                Jetzt bewerben
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Agency Hub. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}