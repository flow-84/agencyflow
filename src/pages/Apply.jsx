import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Send, Check, Upload, User, Mail, Phone, FileText, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";

export default function Apply() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    role_type: "chatter",
    experience: "",
    motivation: "",
    resume_url: "",
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Application.create(data),
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, resume_url: result.file_url });
    } finally {
      setUploading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.applicant_name && formData.email;
    if (step === 2) return formData.role_type;
    return true;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Bewerbung eingereicht!</h1>
          <p className="text-slate-600 mb-8">
            Vielen Dank für deine Bewerbung. Wir werden uns in Kürze bei dir melden.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Zurück zur Startseite
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Werde Teil unseres Teams</h1>
          <p className="text-lg text-slate-600">
            Bewirb dich jetzt als Chatter oder Model
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step ? 'w-8 bg-violet-600' : s < step ? 'bg-violet-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="w-5 h-5 text-violet-600" />
                      Persönliche Daten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Vollständiger Name *</Label>
                      <Input
                        value={formData.applicant_name}
                        onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                        placeholder="Max Mustermann"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>E-Mail *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="max@beispiel.de"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon (optional)</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+49 ..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-violet-600" />
                      Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={formData.role_type}
                      onValueChange={(value) => setFormData({ ...formData, role_type: value })}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="chatter" id="chatter" className="peer sr-only" />
                        <Label
                          htmlFor="chatter"
                          className="flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-50 hover:bg-slate-50"
                        >
                          <span className="text-3xl mb-2">💬</span>
                          <span className="font-semibold text-lg">Chatter</span>
                          <span className="text-sm text-slate-500 text-center mt-1">
                            Kommuniziere mit Fans
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="model" id="model" className="peer sr-only" />
                        <Label
                          htmlFor="model"
                          className="flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-50 hover:bg-slate-50"
                        >
                          <span className="text-3xl mb-2">⭐</span>
                          <span className="font-semibold text-lg">Model</span>
                          <span className="text-sm text-slate-500 text-center mt-1">
                            Content Creator
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label>Erfahrung</Label>
                      <Textarea
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Erzähle uns von deiner bisherigen Erfahrung..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="w-5 h-5 text-violet-600" />
                      Motivation & Unterlagen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Motivation</Label>
                      <Textarea
                        value={formData.motivation}
                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                        placeholder="Warum möchtest du bei uns arbeiten?"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lebenslauf (optional)</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-violet-300 transition-colors">
                        {formData.resume_url ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <Check className="w-5 h-5" />
                            <span>Datei hochgeladen</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileUpload}
                              accept=".pdf,.doc,.docx"
                              disabled={uploading}
                            />
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">
                              {uploading ? 'Wird hochgeladen...' : 'PDF oder Word Datei hochladen'}
                            </p>
                          </label>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Zurück
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {createMutation.isPending ? (
                  'Wird gesendet...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Bewerbung absenden
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}