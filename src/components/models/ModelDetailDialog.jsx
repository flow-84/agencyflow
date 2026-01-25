import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Link as LinkIcon, UserCircle, TrendingUp, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ModelDetailDialog({ model, open, onClose }) {
  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Model Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="space-y-6 pr-4">
            {/* Profile Header */}
            <div className="flex gap-6 items-start">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 flex-shrink-0">
                {model.profile_image_url ? (
                  <img
                    src={model.profile_image_url}
                    alt={model.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-violet-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{model.display_name}</h3>
                <p className="text-slate-500">{model.user_email}</p>
                <Badge 
                  className={`mt-2 ${
                    model.status === 'active' ? 'bg-emerald-500' :
                    model.status === 'inactive' ? 'bg-slate-500' :
                    'bg-amber-500'
                  } text-white border-0`}
                >
                  {model.status === 'active' ? 'Aktiv' : 
                   model.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
                </Badge>
              </div>
            </div>

            {/* Bio */}
            {model.bio && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Biografie</h4>
                <p className="text-slate-600 text-sm">{model.bio}</p>
              </div>
            )}

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Social Media & Links</h4>
              <div className="space-y-2">
                {model.onlyfans_username && (
                  <a
                    href={`https://onlyfans.com/${model.onlyfans_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">OnlyFans</p>
                      <p className="text-sm text-slate-500">@{model.onlyfans_username}</p>
                    </div>
                  </a>
                )}
                {model.instagram_url && (
                  <a
                    href={model.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Instagram</p>
                      <p className="text-sm text-slate-500">Profil öffnen</p>
                    </div>
                  </a>
                )}
                {model.linktree_url && (
                  <a
                    href={model.linktree_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Linktree</p>
                      <p className="text-sm text-slate-500">Alle Links</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* OnlyFans Stats */}
            {model.onlyfans_stats && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">OnlyFans Statistiken</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-pink-50 rounded-xl">
                    <Users className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">
                      {model.onlyfans_stats.subscribers?.toLocaleString() || '-'}
                    </p>
                    <p className="text-xs text-slate-500">Abonnenten</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">
                      ${model.onlyfans_stats.earnings?.toLocaleString() || '-'}
                    </p>
                    <p className="text-xs text-slate-500">Umsatz</p>
                  </div>
                  <div className="text-center p-4 bg-violet-50 rounded-xl">
                    <ExternalLink className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">
                      {model.onlyfans_stats.posts || '-'}
                    </p>
                    <p className="text-xs text-slate-500">Posts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {model.skills && model.skills.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Fähigkeiten</h4>
                <div className="flex flex-wrap gap-2">
                  {model.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, i) => (
                    <Badge key={i} className="bg-violet-100 text-violet-700 border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contract Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Vertragsstatus</span>
              <Badge className={model.contract_signed ? 'bg-emerald-500' : 'bg-amber-500'}>
                {model.contract_signed ? '✓ Unterschrieben' : 'Ausstehend'}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}