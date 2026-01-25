import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Crown, MessageCircle, Camera, Users } from "lucide-react";
import { motion } from "framer-motion";
import MemberProfileDialog from "./MemberProfileDialog";

export default function TeamMindmap() {
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  // Organize by role
  const admins = users.filter(u => u.role === 'admin');
  const chatters = users.filter(u => u.user_role === 'chatter');
  const modelUsers = users.filter(u => u.user_role === 'model');

  // Group chatters by department
  const departments = [...new Set(chatters.map(c => c.department).filter(Boolean))];
  const chattersByDept = departments.reduce((acc, dept) => {
    acc[dept] = chatters.filter(c => c.department === dept);
    return acc;
  }, {});
  const unassignedChatters = chatters.filter(c => !c.department);

  const NodeCard = ({ member, type, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
          type === 'admin' ? 'border-amber-300 bg-amber-50' :
          type === 'chatter' ? 'border-blue-300 bg-blue-50' :
          'border-pink-300 bg-pink-50'
        }`}
        onClick={() => setSelectedMember({ ...member, type })}
      >
        <CardContent className="p-4 text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
            type === 'admin' ? 'bg-amber-200' :
            type === 'chatter' ? 'bg-blue-200' :
            'bg-pink-200'
          }`}>
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <Icon className={`w-8 h-8 ${color}`} />
            )}
          </div>
          <h3 className="font-semibold text-sm truncate">{member.full_name || member.display_name}</h3>
          <p className="text-xs text-slate-500 truncate">{member.email}</p>
          {member.department && (
            <Badge variant="outline" className="mt-1 text-xs">{member.department}</Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Admins */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">Administratoren</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {admins.map(admin => (
            <NodeCard key={admin.id} member={admin} type="admin" icon={Crown} color="text-amber-600" />
          ))}
        </div>
      </div>

      {/* Connecting Line */}
      <div className="h-8 relative">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-amber-300 via-blue-300 to-pink-300" />
      </div>

      {/* Chatters by Department */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Chatter</h2>
        </div>
        
        {Object.entries(chattersByDept).map(([dept, members]) => (
          <div key={dept} className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 ml-2">{dept}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.map(chatter => (
                <NodeCard key={chatter.id} member={chatter} type="chatter" icon={MessageCircle} color="text-blue-600" />
              ))}
            </div>
          </div>
        ))}

        {unassignedChatters.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 ml-2">Nicht zugewiesen</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {unassignedChatters.map(chatter => (
                <NodeCard key={chatter.id} member={chatter} type="chatter" icon={MessageCircle} color="text-blue-600" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connecting Line */}
      <div className="h-8 relative">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-300 to-pink-300" />
      </div>

      {/* Models */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-600" />
          <h2 className="text-xl font-bold text-slate-900">Models</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {models.map(model => {
            const user = modelUsers.find(u => u.email === model.user_email);
            return (
              <NodeCard 
                key={model.id} 
                member={{ ...model, ...user }} 
                type="model" 
                icon={Camera} 
                color="text-pink-600" 
              />
            );
          })}
        </div>
      </div>

      {/* Member Profile Dialog */}
      <MemberProfileDialog
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}