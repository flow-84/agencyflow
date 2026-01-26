import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Play, Clock, Sparkles, Network } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TeamMindmap from "@/components/team/TeamMindmap";

export default function VIPDashboard() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: () => base44.entities.VideoCategory.list('order'),
  });

  const { data: videos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => base44.entities.VideoContent.list('order'),
  });

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const getVideosByCategory = (categoryId) => {
    return videos.filter(v => v.category_id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">VIP Bereich</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Exklusive Video-Inhalte
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Willkommen im VIP-Bereich. Genieße unsere exklusiven Videos.
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Keine Videos verfügbar</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Aktuell sind keine Videos vorhanden.</p>
          </div>
        ) : (
          categories.map((category, idx) => {
            const categoryVideos = getVideosByCategory(category.id);
            if (categoryVideos.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{category.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryVideos.map((video) => (
                        <motion.div
                          key={video.id}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Card className="overflow-hidden border-2 border-transparent hover:border-violet-400 transition-all">
                            <div className="relative aspect-video bg-slate-100">
                              {video.thumbnail_url ? (
                                <img
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Play className="w-12 h-12 text-slate-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                  <Play className="w-8 h-8 text-violet-600 ml-1" />
                                </div>
                              </div>
                              {video.duration && (
                                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {video.duration}
                                </Badge>
                              )}
                            </div>
                            <CardContent className="p-4 bg-white dark:bg-slate-800">
                              <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                                  {video.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {selectedVideo && (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {selectedVideo?.description && (
              <p className="text-slate-600">{selectedVideo.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Map */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Team Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMindmap />
        </CardContent>
      </Card>
    </div>
  );
}