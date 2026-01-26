import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Shield, Users, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleGetStarted = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/30 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/e5d44f5c1_copilot_image_17621658834212.png" 
              alt="Model2Star" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('PrivacyPolicy')} className="text-slate-300 hover:text-white text-sm">
              Datenschutz
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="text-slate-300 hover:text-white text-sm">
              AGB
            </Link>
            <Button onClick={handleGetStarted} className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800">
              Anmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/d6c2be4a6_Gemini_Generated_Image_qcd35hqcd35hqcd3.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-pink-900/80 to-slate-900/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="mb-8">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/18cfc3c09_AlbedoBase_XL_A_pink_star_on_a_transparent_background_inside_t_0.png"
              alt="Model2Star"
              className="w-24 h-24 mx-auto object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Vom Model zum Star
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
              Deine Karriere-Plattform
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Die All-in-One Management Plattform für Models und Creator. Professionell, sicher, erfolgreich.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-6 text-lg shadow-xl"
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Team Management</h3>
                <p className="text-slate-400 text-sm">
                  Verwalte Models und Chatter effizient
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
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

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
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

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
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
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/fd0792384_model2star-logo-grey.png"
                alt="Model2Star"
                className="h-8 w-auto object-contain opacity-60"
              />
              <p className="text-slate-400 text-sm">
                © 2026 Model2Star. Alle Rechte vorbehalten.
              </p>
            </div>
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