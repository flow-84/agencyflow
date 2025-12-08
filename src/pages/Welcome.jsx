import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export default function Welcome() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        
        // Create notification for new registrations
        if (user && user.user_role) {
          const notificationTypes = {
            'model': 'model_registered',
            'chatter': 'chatter_registered',
            'vip': 'user_registered',
          };
          
          const notificationType = notificationTypes[user.user_role];
          if (notificationType) {
            await base44.entities.Notification.create({
              type: notificationType,
              title: `Neue Registrierung: ${user.user_role === 'model' ? 'Model' : user.user_role === 'chatter' ? 'Chatter' : 'VIP'}`,
              message: `${user.full_name || user.email} hat sich als ${user.user_role === 'model' ? 'Model' : user.user_role === 'chatter' ? 'Chatter' : 'VIP'} registriert`,
              user_email: user.email,
              for_admins: true,
            });
          }
        }
        
        return user;
      } catch (error) {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!isLoading && user) {
      const isAdmin = user.role === 'admin';
      const userRole = user.user_role;

      if (isAdmin) {
        window.location.href = createPageUrl('Dashboard');
      } else if (userRole === 'chatter') {
        window.location.href = createPageUrl('ChatterDashboard');
      } else if (userRole === 'model') {
        window.location.href = createPageUrl('ModelDashboard');
      } else if (userRole === 'vip') {
        window.location.href = createPageUrl('VIPDashboard');
      } else {
        window.location.href = createPageUrl('SelectRole');
      }
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
        <p className="text-slate-600">Wird geladen...</p>
      </div>
    </div>
  );
}