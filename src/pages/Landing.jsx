import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Shield, Users, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleGetStarted = () => {
    base44.auth.redirectToLogin(createPageUrl('Welcome'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">Agency Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('PrivacyPolicy')} className="text-slate-300 hover:text-white text-sm">
              Datenschutz
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="text-slate-300 hover:text-white text-sm">
              AGB
            </Link>
            <Button onClick={handleGetStarted} className="bg-violet-600 hover:bg-violet-700">
              Anmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professionelles Management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              für dein Team
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Die All-in-One Plattform für Agenturen. Verwalte Models, Chatter, Schulungen und mehr an einem Ort.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl"
          >
            Jetzt starten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Alles was du brauchst
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Team Management</h3>
                <p className="text-slate-400 text-sm">
                  Verwalte Models und Chatter effizient
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Schulungen</h3>
                <p className="text-slate-400 text-sm">
                  Professionelle Trainings und Quizzes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Dokumente</h3>
                <p className="text-slate-400 text-sm">
                  Verträge digital unterschreiben
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Sicherheit</h3>
                <p className="text-slate-400 text-sm">
                  Datenschutz und Compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Agency Hub. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6">
              <Link to={createPageUrl('PrivacyPolicy')} className="text-slate-400 hover:text-white text-sm">
                Datenschutzerklärung
              </Link>
              <Link to={createPageUrl('TermsOfService')} className="text-slate-400 hover:text-white text-sm">
                Nutzungsbedingungen
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}