import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Upload, Plus, X, Camera, Download, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function MyProfile() {
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    onlyfans_username: "",
    profile_image_url: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.ModelProfile.filter({ user_email: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        onlyfans_username: profile.onlyfans_username || "",
        profile_image_url: profile.profile_image_url || "",
        tags: profile.tags || [],
      });
    }
  }, [profile]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ModelProfile.create({ ...data, user_email: user?.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.ModelProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profile) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, profile_image_url: result.file_url });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const importFromOnlyFans = async () => {
    if (!formData.onlyfans_username) return;
    
    setImporting(true);
    setImportError("");
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Finde das OnlyFans Profil für den Username "${formData.onlyfans_username}" auf onlyfans.com/${formData.onlyfans_username}.

Extrahiere diese Informationen:
1. Die vollständige Bio/Beschreibung des Profils (der komplette Text den das Model dort geschrieben hat)
2. Anzahl der Likes, Posts, Fotos, Videos falls sichtbar

WICHTIG: OnlyFans Profilbilder können nicht direkt verlinkt werden, daher ignoriere das Profilbild.

Gib die gefundene Bio zurück. Wenn das Profil nicht existiert oder privat ist, setze found auf false.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            bio: { type: "string", description: "Die vollständige Bio des Profils" },
            likes_count: { type: "string", description: "Anzahl der Likes" },
            posts_count: { type: "string", description: "Anzahl der Posts" },
            photos_count: { type: "string", description: "Anzahl der Fotos" },
            videos_count: { type: "string", description: "Anzahl der Videos" },
            found: { type: "boolean", description: "Ob das Profil gefunden wurde" }
          }
        }
      });

      if (result.found && result.bio) {
        setFormData(prev => ({
          ...prev,
          bio: result.bio,
        }));
        setImportError("");
      } else if (result.found && !result.bio) {
        setImportError("Profil gefunden, aber keine Bio vorhanden.");
      } else {
        setImportError("Profil konnte nicht gefunden werden. Bitte überprüfe den Username.");
      }
    } catch (error) {
      setImportError("Import fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Mein Profil</h1>
        <p className="text-slate-500 mt-1">Verwalte deine Profilinformationen</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg">Profilbild</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.profile_image_url ? (
                  <img
                    src={formData.profile_image_url}
                    alt="Profil"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full cursor-pointer hover:bg-violet-700 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">
                  Lade ein Profilbild hoch. Empfohlene Größe: 400x400px
                </p>
                {formData.profile_image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 mt-2"
                    onClick={() => setFormData({ ...formData, profile_image_url: "" })}
                  >
                    Bild entfernen
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg">Grundinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Künstlername *</Label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Dein Künstlername"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>OnlyFans Username</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-md text-slate-500">
                    @
                  </span>
                  <Input
                    value={formData.onlyfans_username}
                    onChange={(e) => setFormData({ ...formData, onlyfans_username: e.target.value })}
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={importFromOnlyFans}
                  disabled={importing || !formData.onlyfans_username}
                  className="whitespace-nowrap"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importiere...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Profil importieren
                    </>
                  )}
                </Button>
              </div>
              {importError && (
                <p className="text-sm text-rose-600">{importError}</p>
              )}
              <p className="text-xs text-slate-500">
                Gib deinen OnlyFans Username ein und klicke auf "Profil importieren" um deine Bio automatisch zu laden.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Biografie</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Erzähl etwas über dich..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg">Tags / Kategorien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Neuer Tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`px-8 ${saved ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-700'}`}
            disabled={updateMutation.isPending || createMutation.isPending}
          >
            {saved ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Gespeichert!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}