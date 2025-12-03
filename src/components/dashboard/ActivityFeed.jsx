import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { motion } from "framer-motion";

export default function ActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    const icons = {
      application: "📋",
      shift: "⏰",
      training: "📚",
      document: "📄",
      user: "👤",
    };
    return icons[type] || "📌";
  };

  const getActivityColor = (type) => {
    const colors = {
      application: "bg-violet-100 text-violet-700",
      shift: "bg-blue-100 text-blue-700",
      training: "bg-emerald-100 text-emerald-700",
      document: "bg-amber-100 text-amber-700",
      user: "bg-rose-100 text-rose-700",
    };
    return colors[type] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Letzte Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Keine Aktivitäten vorhanden
          </p>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {format(new Date(activity.date), "dd. MMM", { locale: de })}
              </span>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}