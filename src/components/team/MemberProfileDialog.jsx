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
import { UserCircle, Mail, Phone, Crown, MessageCircle, Camera, Send, Bell } from "lucide-react";
import { toast } from "sonner";

export default function MemberProfileDialog({ member, open, onClose }) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.ChatMessage.create(data);
    },
    onSuccess: () => {
      toast.success("Nachricht gesendet!");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  const mentionMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Notification.create(data);
    },
    onSuccess: () => {
      toast.success("Benachrichtigung gesendet!");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (!member) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      sender_email: currentUser?.email,
      sender_name: currentUser?.full_name,
      recipient_email: member.email || member.user_email,
      message: message,
      is_team_chat: false,
    });
  };

  const handleMention = () => {
    mentionMutation.mutate({
      type: "user_registered",
      title: "Du wurdest erwähnt",
      message: `${currentUser?.full_name} hat dich im Team Mindmap angesehen`,
      user_email: member.email || member.user_email,
      for_admins: false,
    });
    toast.success("Erwähnung gesendet!");
  };

  const getIcon = () => {
    if (member.type === 'admin') return Crown;
    if (member.type === 'chatter') return MessageCircle;
    return Camera;
  };

  const getColor = () => {
    if (member.type === 'admin') return 'text-amber-600';
    if (member.type === 'chatter') return 'text-blue-600';
    return 'text-pink-600';
  };

  const Icon = getIcon();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              member.type === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30' :
              member.type === 'chatter' ? 'bg-blue-100 dark:bg-blue-900/30' :
              'bg-pink-100 dark:bg-pink-900/30'
            }`}>
              {(member.avatar_url || member.profile_image_url) ? (
                <img
                  src={member.avatar_url || member.profile_image_url}
                  alt={member.full_name || member.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Icon className={`w-6 h-6 ${getColor()}`} />
              )}
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{member.full_name || member.display_name}</div>
              <Badge className={
                member.type === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                member.type === 'chatter' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
              }>
                {member.type === 'admin' ? 'Administrator' :
                 member.type === 'chatter' ? 'Chatter' : 'Model'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4" />
              <span>{member.email || member.user_email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
            )}
          </div>

          {/* Department/Status */}
          {member.department && (
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Abteilung: </span>
              <Badge variant="outline">{member.department}</Badge>
            </div>
          )}

          {member.status && (
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Status: </span>
              <Badge className={
                member.status === 'active' ? 'bg-emerald-500' :
                member.status === 'inactive' ? 'bg-slate-500' : 'bg-amber-500'
              }>
                {member.status === 'active' ? 'Aktiv' :
                 member.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
              </Badge>
            </div>
          )}

          {/* Bio (for models) */}
          {member.bio && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">Biografie</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">Fähigkeiten</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact/Mention Actions */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Kontakt</h3>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Nachricht schreiben..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Nachricht senden
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleMention}
                  disabled={mentionMutation.isPending}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Erwähnen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}