import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ShiftCard({ shift, onClick }) {
  const statusConfig = {
    scheduled: { label: "Geplant", color: "bg-blue-100 text-blue-700 border-blue-200" },
    active: { label: "Aktiv", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    completed: { label: "Abgeschlossen", color: "bg-slate-100 text-slate-700 border-slate-200" },
    cancelled: { label: "Abgesagt", color: "bg-rose-100 text-rose-700 border-rose-200" },
  };

  const status = statusConfig[shift.status] || statusConfig.scheduled;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-4 border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-medium">
              {shift.chatter_name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">
              {shift.chatter_name || shift.chatter_email}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{shift.start_time} - {shift.end_time}</span>
            </div>
          </div>

          <Badge variant="outline" className={`${status.color} font-medium`}>
            {status.label}
          </Badge>
        </div>

        {shift.assigned_model && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <User className="w-3 h-3" />
            <span>Model: {shift.assigned_model}</span>
          </div>
        )}

        {shift.notes && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-1">{shift.notes}</p>
        )}
      </Card>
    </motion.div>
  );
}