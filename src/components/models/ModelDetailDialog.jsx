import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserCircle, Users, TrendingUp, FileText } from "lucide-react";

export default function ModelDetailDialog({ model, open, onClose }) {
  if (!model) return null;

  const getOnlyFansUrl = () => {
    if (!model.onlyfans_username) return null;
    return `https://onlyfans.com/${model.onlyfans_username}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {model.profile_image_url ? (
              <img
                src={model.profile_image_url}
                alt={model.display_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-violet-600" />
              </div>
            )}
            <div>
              <div className="text-xl font-bold">{model.display_name}</div>
              {model.onlyfans_username && (
                <div className="text-sm text-slate-500">@{model.onlyfans_username}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Status:</span>
            <Badge className={
              model.status === 'active' ? 'bg-emerald-500' :
              model.status === 'inactive' ? 'bg-slate-500' : 'bg-amber-500'
            }>
              {model.status === 'active' ? 'Aktiv' :
               model.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
            </Badge>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Social Links
            </h3>
            <div className="flex flex-wrap gap-2">
              {getOnlyFansUrl() && (
                <Button variant="outline" asChild>
                  <a href={getOnlyFansUrl()} target="_blank" rel="noopener noreferrer">
                    OnlyFans
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              )}
              {model.instagram_url && (
                <Button variant="outline" asChild>
                  <a href={model.instagram_url} target="_blank" rel="noopener noreferrer">
                    Instagram
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              )}
              {model.linktree_url && (
                <Button variant="outline" asChild>
                  <a href={model.linktree_url} target="_blank" rel="noopener noreferrer">
                    Linktree
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Bio */}
          {model.bio && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Biografie
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{model.bio}</p>
            </div>
          )}

          {/* Skills */}
          {model.skills && model.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Fähigkeiten</h3>
              <div className="flex flex-wrap gap-2">
                {model.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* OnlyFans Stats */}
          {model.onlyfans_stats && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                OnlyFans Statistiken
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {model.onlyfans_stats.subscribers && (
                  <div className="text-center p-3 bg-pink-50 rounded-xl">
                    <Users className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-slate-900">
                      {model.onlyfans_stats.subscribers.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Abonnenten</p>
                  </div>
                )}
                {model.onlyfans_stats.earnings && (
                  <div className="text-center p-3 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-slate-900">
                      ${model.onlyfans_stats.earnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Umsatz</p>
                  </div>
                )}
                {model.onlyfans_stats.posts && (
                  <div className="text-center p-3 bg-violet-50 rounded-xl">
                    <FileText className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-slate-900">
                      {model.onlyfans_stats.posts}
                    </p>
                    <p className="text-xs text-slate-500">Posts</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {model.tags && model.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Kategorien</h3>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-violet-100 text-violet-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {model.gallery_urls && model.gallery_urls.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Galerie</h3>
              <div className="grid grid-cols-3 gap-2">
                {model.gallery_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}