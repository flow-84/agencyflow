import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCircle, Crown, MessageCircle, Users, Camera, Star } from "lucide-react";
import { motion } from "framer-motion";
import TeamMemberDialog from "./TeamMemberDialog";

export default function TeamMindmap() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  // Organize team members by role
  const admins = users.filter(u => u.role === 'admin');
  const chatters = users.filter(u => u.user_role === 'chatter');
  const vips = users.filter(u => u.user_role === 'vip');

  const getNodeIcon = (role, userRole) => {
    if (role === 'admin') return Crown;
    if (userRole === 'chatter') return MessageCircle;
    if (userRole === 'model') return Camera;
    if (userRole === 'vip') return Star;
    return UserCircle;
  };

  const getNodeColor = (role, userRole) => {
    if (role === 'admin') return 'from-violet-500 to-purple-600';
    if (userRole === 'chatter') return 'from-blue-500 to-indigo-600';
    if (userRole === 'model') return 'from-pink-500 to-rose-600';
    if (userRole === 'vip') return 'from-amber-500 to-orange-600';
    return 'from-slate-500 to-slate-600';
  };

  const TeamNode = ({ member, role, delay = 0 }) => {
    const Icon = getNodeIcon(member.role, member.user_role);
    const colorClass = getNodeColor(member.role, member.user_role);
    const modelProfile = member.user_role === 'model' 
      ? models.find(m => m.user_email === member.email)
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        onMouseEnter={() => setHoveredNode(member.id)}
        onMouseLeave={() => setHoveredNode(null)}
        className="relative"
      >
        <Card
          className={`cursor-pointer transition-all border-2 ${
            hoveredNode === member.id ? 'border-violet-500 shadow-xl' : 'border-transparent shadow-lg'
          }`}
          onClick={() => setSelectedMember({ ...member, modelProfile })}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                {modelProfile?.profile_image_url ? (
                  <img
                    src={modelProfile.profile_image_url}
                    alt={member.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icon className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-900 text-sm truncate max-w-[120px]">
                  {modelProfile?.display_name || member.full_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {member.role === 'admin' ? 'Admin' : 
                   member.user_role === 'chatter' ? 'Chatter' :
                   member.user_role === 'model' ? 'Model' :
                   member.user_role === 'vip' ? 'VIP' : 'Team'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12 py-6">
      {/* Legend */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          <span className="text-xs text-slate-600">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
          <span className="text-xs text-slate-600">Chatter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-600" />
          <span className="text-xs text-slate-600">Model</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
          <span className="text-xs text-slate-600">VIP</span>
        </div>
      </div>

      {/* Admins Level */}
      {admins.length > 0 && (
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-violet-600" />
              Administration
            </h3>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {admins.map((admin, i) => (
              <TeamNode key={admin.id} member={admin} role="admin" delay={i * 0.1} />
            ))}
          </div>
          {(chatters.length > 0 || models.length > 0) && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-violet-300 to-transparent" />
          )}
        </div>
      )}

      {/* Chatters Level */}
      {chatters.length > 0 && (
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Chatter Team
            </h3>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {chatters.map((chatter, i) => (
              <TeamNode key={chatter.id} member={chatter} role="chatter" delay={0.2 + i * 0.1} />
            ))}
          </div>
          {models.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-blue-300 to-transparent" />
          )}
        </div>
      )}

      {/* Models Level */}
      {models.length > 0 && (
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Camera className="w-5 h-5 text-pink-600" />
              Models
            </h3>
          </div>
          <div className="flex justify-center gap-6 flex-wrap max-w-6xl mx-auto">
            {models.map((model, i) => {
              const user = users.find(u => u.email === model.user_email);
              if (!user) return null;
              return (
                <TeamNode 
                  key={model.id} 
                  member={{ ...user, user_role: 'model' }} 
                  role="model" 
                  delay={0.4 + i * 0.05} 
                />
              );
            })}
          </div>
        </div>
      )}

      {/* VIPs Level */}
      {vips.length > 0 && (
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              VIP Mitglieder
            </h3>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {vips.map((vip, i) => (
              <TeamNode key={vip.id} member={vip} role="vip" delay={0.6 + i * 0.1} />
            ))}
          </div>
        </div>
      )}

      {selectedMember && (
        <TeamMemberDialog
          member={selectedMember}
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}