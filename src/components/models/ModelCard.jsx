import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, FileText, MoreVertical, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function ModelCard({ model, onEdit, onView }) {
  const statusConfig = {
    active: { label: "Aktiv", color: "bg-emerald-100 text-emerald-700" },
    inactive: { label: "Inaktiv", color: "bg-slate-100 text-slate-700" },
    pending: { label: "Ausstehend", color: "bg-amber-100 text-amber-700" },
  };

  const status = statusConfig[model.status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50 hover:shadow-xl transition-all">
        <div className="relative h-48 bg-gradient-to-br from-violet-500 to-purple-600">
          {model.profile_image_url ? (
            <img
              src={model.profile_image_url}
              alt={model.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-bold text-white/30">
                {model.display_name?.charAt(0) || 'M'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-3 right-3">
            <Badge className={`${status.color} border-0 font-medium`}>
              {status.label}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{model.display_name}</h3>
            {model.onlyfans_username && (
              <p className="text-sm text-white/80 flex items-center gap-1">
                @{model.onlyfans_username}
                <ExternalLink className="w-3 h-3" />
              </p>
            )}
          </div>
        </div>

        <div className="p-5">
          {model.tags && model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {model.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  {tag}
                </Badge>
              ))}
              {model.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  +{model.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {model.onlyfans_stats && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1">
                  <Users className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {model.onlyfans_stats.subscribers?.toLocaleString() || '-'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Subs</p>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  ${model.onlyfans_stats.earnings?.toLocaleString() || '-'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Umsatz</p>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {model.onlyfans_stats.posts || '-'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Posts</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {model.contract_signed ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  Vertrag ✓
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 border-0">
                  Vertrag fehlt
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(model)}>
                  Profil anzeigen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(model)}>
                  Bearbeiten
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}