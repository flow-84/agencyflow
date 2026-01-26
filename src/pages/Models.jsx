import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Grid, List, X } from "lucide-react";
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
import ModelCard from "@/components/models/ModelCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Models() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDialog, setShowDialog] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [formData, setFormData] = useState({
    user_email: "",
    display_name: "",
    bio: "",
    onlyfans_username: "",
    profile_image_url: "",
    status: "pending",
    contract_signed: false,
  });

  const queryClient = useQueryClient();

  const { data: models = [], isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list('-created_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const modelUsers = users.filter(u => u.user_role === 'model');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ModelProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ModelProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      user_email: "",
      display_name: "",
      bio: "",
      onlyfans_username: "",
      profile_image_url: "",
      status: "pending",
      contract_signed: false,
    });
    setEditingModel(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingModel) {
      updateMutation.mutate({ id: editingModel.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (model) => {
    setEditingModel(model);
    setFormData({
      user_email: model.user_email,
      display_name: model.display_name,
      bio: model.bio || "",
      onlyfans_username: model.onlyfans_username || "",
      profile_image_url: model.profile_image_url || "",
      status: model.status || "pending",
      contract_signed: model.contract_signed || false,
    });
    setShowDialog(true);
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = 
      model.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.onlyfans_username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Models</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte Model-Profile und Daten</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neues Profil
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Name oder Username suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="pending">Ausstehend</TabsTrigger>
            <TabsTrigger value="inactive">Inaktiv</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Models Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
            ))
          ) : filteredModels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Keine Models</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Es wurden keine passenden Profile gefunden.</p>
            </motion.div>
          ) : (
            filteredModels.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                onEdit={handleEdit}
                onView={handleEdit}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingModel ? 'Model bearbeiten' : 'Neues Model-Profil'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nutzer verknüpfen</Label>
              <Select
                value={formData.user_email}
                onValueChange={(value) => setFormData({ ...formData, user_email: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nutzer auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {modelUsers.map(user => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Künstlername *</Label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>OnlyFans Username</Label>
              <Input
                value={formData.onlyfans_username}
                onChange={(e) => setFormData({ ...formData, onlyfans_username: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label>Profilbild URL</Label>
              <Input
                value={formData.profile_image_url}
                onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Biografie</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Kurze Beschreibung..."
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Vertrag unterschrieben</Label>
              <Switch
                checked={formData.contract_signed}
                onCheckedChange={(checked) => setFormData({ ...formData, contract_signed: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                {editingModel ? 'Speichern' : 'Erstellen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserCircle(props) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}