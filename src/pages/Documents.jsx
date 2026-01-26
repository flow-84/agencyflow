import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, FileText, Download, Trash2, Eye, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "contract",
    file_url: "",
    owner_email: "",
    notes: "",
    is_signed: false,
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Document.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Document.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "contract",
      file_url: "",
      owner_email: "",
      notes: "",
      is_signed: false,
    });
  };

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
      setFormData({ ...formData, file_url: result.file_url });
    } finally {
      setUploading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeConfig = {
    contract: { label: "Vertrag", color: "bg-violet-100 text-violet-700" },
    nda: { label: "NDA", color: "bg-blue-100 text-blue-700" },
    policy: { label: "Richtlinie", color: "bg-emerald-100 text-emerald-700" },
    other: { label: "Sonstiges", color: "bg-slate-100 text-slate-700" },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dokumente</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte Verträge und Dokumente</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neues Dokument
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Dokument suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="contract">Verträge</SelectItem>
            <SelectItem value="nda">NDA</SelectItem>
            <SelectItem value="policy">Richtlinien</SelectItem>
            <SelectItem value="other">Sonstiges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents Table */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-700/50">
              <TableHead className="text-slate-700 dark:text-slate-300">Dokument</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Typ</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Nutzer</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Status</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Datum</TableHead>
              <TableHead className="w-24 text-slate-700 dark:text-slate-300">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-12 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Keine Dokumente gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map(doc => {
                const type = typeConfig[doc.type] || typeConfig.other;
                
                return (
                  <TableRow key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.title}</p>
                          {doc.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${type.color} border-0`}>
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {doc.owner_email || '-'}
                    </TableCell>
                    <TableCell>
                      {doc.is_signed ? (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                          Unterschrieben
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700">
                          Ausstehend
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {doc.created_date ? format(new Date(doc.created_date), "dd. MMM yyyy", { locale: de }) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {doc.file_url && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            asChild
                          >
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => deleteMutation.mutate(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neues Dokument</DialogTitle>
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
              <Label>Typ</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Vertrag</SelectItem>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="policy">Richtlinie</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Datei</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                {formData.file_url ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                    <FileText className="w-4 h-4" />
                    Datei hochgeladen
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => setFormData({ ...formData, file_url: "" })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">
                        {uploading ? 'Wird hochgeladen...' : 'Datei auswählen'}
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Zuweisen an (optional)</Label>
              <Select
                value={formData.owner_email}
                onValueChange={(value) => setFormData({ ...formData, owner_email: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nutzer auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Keine Zuweisung</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notizen</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Bereits unterschrieben</Label>
              <Switch
                checked={formData.is_signed}
                onCheckedChange={(checked) => setFormData({ ...formData, is_signed: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                disabled={!formData.file_url}
              >
                Hochladen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}