import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, User, Bell, Shield, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function Settings() {
  const [formData, setFormData] = useState({
    phone: "",
    avatar_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, avatar_url: result.file_url });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Einstellungen</h1>
        <p className="text-slate-500 mt-1">Verwalte dein Konto und Präferenzen</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" />
              Profil
            </CardTitle>
            <CardDescription>
              Deine grundlegenden Kontoinformationen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="bg-violet-100 text-violet-700 text-xl">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 p-1.5 bg-violet-600 rounded-full cursor-pointer hover:bg-violet-700 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3 text-white" />
                  )}
                </label>
              </div>
              <div>
                <p className="font-medium text-slate-900">{user?.full_name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={user?.full_name || ''}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">Der Name kann nicht geändert werden</p>
              </div>

              <div className="grid gap-2">
                <Label>E-Mail</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="grid gap-2">
                <Label>Telefon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 ..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-600" />
              Konto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Rolle</p>
                <p className="text-sm text-slate-500">Deine Berechtigung im System</p>
              </div>
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium capitalize">
                {user?.user_role || user?.role || 'Nutzer'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Status</p>
                <p className="text-sm text-slate-500">Kontostatus</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {user?.status === 'active' ? 'Aktiv' : 'Ausstehend'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className={`flex-1 ${saved ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-700'}`}
            disabled={updateMutation.isPending}
          >
            {saved ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Gespeichert!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Änderungen speichern
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-rose-600 border-rose-200 hover:bg-rose-50"
            onClick={handleLogout}
          >
            Abmelden
          </Button>
        </div>
      </form>
    </div>
  );
}