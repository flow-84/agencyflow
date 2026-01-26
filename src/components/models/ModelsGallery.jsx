import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import ModelDetailDialog from "./ModelDetailDialog";

export default function ModelsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedModel, setSelectedModel] = useState(null);

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || model.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.display_name || "").localeCompare(b.display_name || "");
      }
      if (sortBy === "subscribers") {
        return (b.onlyfans_stats?.subscribers || 0) - (a.onlyfans_stats?.subscribers || 0);
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Models suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <SelectItem value="name">Nach Name</SelectItem>
            <SelectItem value="subscribers">Nach Abonnenten</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedModel(model)}
            >
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="aspect-square bg-gradient-to-br from-violet-100 to-purple-100 relative overflow-hidden">
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
                  <div className="absolute top-2 right-2">
                    <Badge className={
                      model.status === 'active' ? 'bg-emerald-500' :
                      model.status === 'inactive' ? 'bg-slate-500' : 'bg-amber-500'
                    }>
                      {model.status === 'active' ? 'Aktiv' :
                       model.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
                    </Badge>
                  </div>
                </div>

                {/* Model Info */}
                <div className="p-4 bg-white dark:bg-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {model.display_name}
                  </h3>
                  {model.onlyfans_username && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      @{model.onlyfans_username}
                    </p>
                  )}
                  
                  {/* Stats */}
                  {model.onlyfans_stats?.subscribers && (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">
                        {model.onlyfans_stats.subscribers.toLocaleString()}
                      </span> Abonnenten
                    </div>
                  )}

                  {/* Skills Preview */}
                  {model.skills && model.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.skills.slice(0, 2).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Keine Models gefunden
        </div>
      )}

      {/* Detail Dialog */}
      <ModelDetailDialog
        model={selectedModel}
        open={!!selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </div>
  );
}