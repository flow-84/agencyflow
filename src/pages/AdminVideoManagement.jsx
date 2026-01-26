import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Video, Folder, Save, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminVideoManagement() {
  const queryClient = useQueryClient();
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [videoDialog, setVideoDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: () => base44.entities.VideoCategory.list('order'),
  });

  const { data: videos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => base44.entities.VideoContent.list('order'),
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data) => base44.entities.VideoCategory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoCategories'] });
      setCategoryDialog(false);
      setEditingCategory(null);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VideoCategory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoCategories'] });
      setCategoryDialog(false);
      setEditingCategory(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.VideoCategory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoCategories'] });
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: (data) => base44.entities.VideoContent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setVideoDialog(false);
      setEditingVideo(null);
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VideoContent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setVideoDialog(false);
      setEditingVideo(null);
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (id) => base44.entities.VideoContent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const CategoryForm = () => {
    const [formData, setFormData] = useState(editingCategory || {
      name: "",
      description: "",
      order: categories.length,
      thumbnail_url: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingCategory) {
        updateCategoryMutation.mutate({ id: editingCategory.id, data: formData });
      } else {
        createCategoryMutation.mutate(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Kategoriename *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Beschreibung</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label>Thumbnail URL</Label>
          <Input
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label>Reihenfolge</Label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setCategoryDialog(false)}>
            Abbrechen
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </DialogFooter>
      </form>
    );
  };

  const VideoForm = () => {
    const [formData, setFormData] = useState(editingVideo || {
      title: "",
      description: "",
      youtube_url: "",
      category_id: categories[0]?.id || "",
      thumbnail_url: "",
      duration: "",
      order: videos.length,
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingVideo) {
        updateVideoMutation.mutate({ id: editingVideo.id, data: formData });
      } else {
        createVideoMutation.mutate(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Video-Titel *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>YouTube URL *</Label>
          <Input
            value={formData.youtube_url}
            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <div>
          <Label>Kategorie *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wähle eine Kategorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Beschreibung</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label>Thumbnail URL</Label>
          <Input
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label>Dauer (z.B. 10:24)</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="10:24"
          />
        </div>
        <div>
          <Label>Reihenfolge</Label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setVideoDialog(false)}>
            Abbrechen
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">VIP Video-Verwaltung</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte Videos und Kategorien für VIP-Nutzer</p>
        </div>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="videos">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Folder className="w-4 h-4 mr-2" />
            Kategorien
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Videos ({videos.length})</CardTitle>
                <Button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoDialog(true);
                  }}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Video hinzufügen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videos.map(video => {
                  const category = categories.find(c => c.id === video.category_id);
                  return (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-16 bg-slate-200 dark:bg-slate-600 rounded overflow-hidden">
                          {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{video.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {category && (
                              <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">{category.name}</Badge>
                            )}
                            {video.duration && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">{video.duration}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteVideoMutation.mutate(video.id)}
                          className="text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {videos.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">Noch keine Videos vorhanden</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Kategorien ({categories.length})</CardTitle>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryDialog(true);
                  }}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Kategorie hinzufügen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map(category => {
                  const videoCount = videos.filter(v => v.category_id === category.id).length;
                  return (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                          <Folder className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{category.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{videoCount} Videos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          className="text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {categories.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">Noch keine Kategorien vorhanden</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm />
        </DialogContent>
      </Dialog>

      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? 'Video bearbeiten' : 'Neues Video'}
            </DialogTitle>
          </DialogHeader>
          <VideoForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}