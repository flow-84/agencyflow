import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingCard from "@/components/training/TrainingCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Training() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video",
    category: "onboarding",
    target_role: "all",
    file_url: "",
    thumbnail_url: "",
    duration_minutes: 0,
    is_required: false,
    order: 0,
  });

  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => base44.entities.TrainingMaterial.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TrainingMaterial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TrainingMaterial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TrainingMaterial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "video",
      category: "onboarding",
      target_role: "all",
      file_url: "",
      thumbnail_url: "",
      duration_minutes: 0,
      is_required: false,
      order: materials.length,
    });
    setEditingMaterial(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMaterial) {
      updateMutation.mutate({ id: editingMaterial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || "",
      type: material.type,
      category: material.category,
      target_role: material.target_role,
      file_url: material.file_url || "",
      thumbnail_url: material.thumbnail_url || "",
      duration_minutes: material.duration_minutes || 0,
      is_required: material.is_required || false,
      order: material.order || 0,
    });
    setShowDialog(true);
  };

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || mat.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryLabels = {
    all: "Alle",
    onboarding: "Einführung",
    advanced: "Fortgeschritten",
    compliance: "Compliance",
    sales: "Verkauf",
    communication: "Kommunikation",
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schulungen</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte Ausbildungsmaterial</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neues Material
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Material suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>

        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            {Object.entries(categoryLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">{label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-xl animate-pulse" />
            ))
          ) : filteredMaterials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Kein Material</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Erstelle dein erstes Schulungsmaterial.</p>
            </motion.div>
          ) : (
            filteredMaterials.map(material => (
              <TrainingCard
                key={material.id}
                material={material}
                onStart={handleEdit}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Material bearbeiten' : 'Neues Schulungsmaterial'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Titel *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typ</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="article">Artikel</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kategorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Einführung</SelectItem>
                    <SelectItem value="advanced">Fortgeschritten</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="sales">Verkauf</SelectItem>
                    <SelectItem value="communication">Kommunikation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Zielgruppe</Label>
              <Select
                value={formData.target_role}
                onValueChange={(value) => setFormData({ ...formData, target_role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="chatter">Nur Chatter</SelectItem>
                  <SelectItem value="model">Nur Models</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Datei URL</Label>
              <Input
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Vorschaubild URL</Label>
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dauer (Minuten)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reihenfolge</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Pflichtmaterial</Label>
              <Switch
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              {editingMaterial && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    deleteMutation.mutate(editingMaterial.id);
                    setShowDialog(false);
                  }}
                >
                  Löschen
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                {editingMaterial ? 'Speichern' : 'Erstellen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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