import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function NotificationBell() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.filter({ for_admins: true }, '-created_date', 50),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => base44.entities.Notification.update(n.id, { read: true }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'vip_invited':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'user_registered':
      case 'model_registered':
      case 'chatter_registered':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-rose-600 border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-slate-900">Benachrichtigungen</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Alle gelesen
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <Bell className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm">Keine Benachrichtigungen</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => !notification.read && markAsReadMutation.mutate(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-slate-900">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(notification.created_date), "dd. MMM yyyy, HH:mm", { locale: de })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}