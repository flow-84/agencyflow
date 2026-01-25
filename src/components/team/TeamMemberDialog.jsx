import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  UserCircle, 
  Mail, 
  Calendar, 
  MessageCircle, 
  Crown,
  Camera,
  Star,
  ExternalLink,
  Instagram,
  Link as LinkIcon,
  Send,
  Bell
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

export default function TeamMemberDialog({ member, open, onClose }) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData) => {
      return await base44.entities.Notification.create(notificationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("Erwähnung gesendet!");
      setMessage("");
    },
  });

  const handleMention = () => {
    if (!message.trim()) return;

    sendNotificationMutation.mutate({
      type: "user_registered",
      title: `${currentUser?.full_name} hat dich erwähnt`,
      message: message,
      user_email: member.email,
      for_admins: false,
    });
  };

  const getRoleIcon = () => {
    if (member.role === 'admin') return Crown;
    if (member.user_role === 'chatter') return MessageCircle;
    if (member.user_role === 'model') return Camera;
    if (member.user_role === 'vip') return Star;
    return UserCircle;
  };

  const RoleIcon = getRoleIcon();
  const modelProfile = member.modelProfile;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Team Mitglied</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="space-y-6 pr-4">
            {/* Profile Header */}
            <div className="flex gap-6 items-start">
              <div className={`relative w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-br ${
                member.role === 'admin' ? 'from-violet-500 to-purple-600' :
                member.user_role === 'chatter' ? 'from-blue-500 to-indigo-600' :
                member.user_role === 'model' ? 'from-pink-500 to-rose-600' :
                member.user_role === 'vip' ? 'from-amber-500 to-orange-600' :
                'from-slate-500 to-slate-600'
              } flex items-center justify-center shadow-lg`}>
                {modelProfile?.profile_image_url ? (
                  <img
                    src={modelProfile.profile_image_url}
                    alt={member.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <RoleIcon className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">
                  {modelProfile?.display_name || member.full_name}
                </h3>
                <p className="text-slate-500">{member.email}</p>
                <Badge className="mt-2 capitalize">
                  {member.role === 'admin' ? 'Admin' : 
                   member.user_role || 'Team'}
                </Badge>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">E-Mail</p>
                  <p className="text-sm font-medium text-slate-900">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Registriert seit</p>
                  <p className="text-sm font-medium text-slate-900">
                    {format(new Date(member.created_date), 'PPP', { locale: de })}
                  </p>
                </div>
              </div>
            </div>

            {/* Model Details */}
            {modelProfile && (
              <>
                {/* Bio */}
                {modelProfile.bio && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Biografie</h4>
                    <p className="text-slate-600 text-sm">{modelProfile.bio}</p>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Social Media</h4>
                  <div className="space-y-2">
                    {modelProfile.onlyfans_username && (
                      <a
                        href={`https://onlyfans.com/${modelProfile.onlyfans_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">@{modelProfile.onlyfans_username}</span>
                      </a>
                    )}
                    {modelProfile.instagram_url && (
                      <a
                        href={modelProfile.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-medium">Instagram Profil</span>
                      </a>
                    )}
                    {modelProfile.linktree_url && (
                      <a
                        href={modelProfile.linktree_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <LinkIcon className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium">Linktree</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {modelProfile.skills && modelProfile.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Fähigkeiten</h4>
                    <div className="flex flex-wrap gap-2">
                      {modelProfile.skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Contact/Mention Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Erwähnen & Benachrichtigen
              </h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="Schreibe eine Nachricht..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleMention}
                  disabled={!message.trim() || sendNotificationMutation.isPending}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendNotificationMutation.isPending ? 'Wird gesendet...' : 'Benachrichtigung senden'}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}