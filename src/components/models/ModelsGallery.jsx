import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import ModelDetailDialog from "./ModelDetailDialog";

export default function ModelsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedModel, setSelectedModel] = useState(null);

  const { data: models = [], isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || model.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.display_name || "").localeCompare(b.display_name || "");
      } else if (sortBy === "subscribers") {
        return (b.onlyfans_stats?.subscribers || 0) - (a.onlyfans_stats?.subscribers || 0);
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Model suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="inactive">Inaktiv</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="subscribers">Abonnenten</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedModel(model)}
            >
              <div className="relative aspect-square bg-gradient-to-br from-violet-100 to-purple-100">
                {model.profile_image_url ? (
                  <img
                    src={model.profile_image_url}
                    alt={model.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-violet-300" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-3 right-3 ${
                    model.status === 'active' ? 'bg-emerald-500' :
                    model.status === 'inactive' ? 'bg-slate-500' :
                    'bg-amber-500'
                  } text-white border-0`}
                >
                  {model.status === 'active' ? 'Aktiv' : 
                   model.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 truncate text-lg">
                  {model.display_name}
                </h3>
                {model.onlyfans_username && (
                  <p className="text-sm text-slate-500 truncate">@{model.onlyfans_username}</p>
                )}
                {model.onlyfans_stats?.subscribers && (
                  <p className="text-xs text-violet-600 mt-2">
                    {model.onlyfans_stats.subscribers.toLocaleString()} Abonnenten
                  </p>
                )}
                {model.skills && model.skills.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {model.skills.slice(0, 2).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {model.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Keine Models gefunden
        </div>
      )}

      {selectedModel && (
        <ModelDetailDialog
          model={selectedModel}
          open={!!selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}