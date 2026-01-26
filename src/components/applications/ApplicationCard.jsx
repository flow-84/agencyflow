import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Mail, Phone, FileText, MoreVertical, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function ApplicationCard({ application, onStatusChange, onView }) {
  const statusConfig = {
    pending: { label: "Ausstehend", color: "bg-amber-100 text-amber-700 border-amber-200" },
    reviewing: { label: "In Prüfung", color: "bg-blue-100 text-blue-700 border-blue-200" },
    approved: { label: "Genehmigt", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    rejected: { label: "Abgelehnt", color: "bg-rose-100 text-rose-700 border-rose-200" },
  };

  const roleConfig = {
    chatter: { label: "Chatter", color: "bg-violet-100 text-violet-700" },
    model: { label: "Model", color: "bg-pink-100 text-pink-700" },
  };

  const status = statusConfig[application.status] || statusConfig.pending;
  const role = roleConfig[application.role_type] || roleConfig.chatter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-5 border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50 hover:shadow-xl transition-shadow">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-white shadow">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
              {application.applicant_name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 dark:text-white">{application.applicant_name}</h3>
              <Badge className={`${role.color} border-0 font-medium`}>
                {role.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {application.email}
              </span>
              {application.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {application.phone}
                </span>
              )}
            </div>

            {application.motivation && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
                {application.motivation}
              </p>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${status.color} font-medium dark:border-opacity-50`}>
                  {status.label}
                </Badge>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {format(new Date(application.created_date), "dd. MMM yyyy", { locale: de })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {application.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onStatusChange(application.id, 'approved')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Annehmen
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => onStatusChange(application.id, 'rejected')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ablehnen
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(application)}>
                      Details anzeigen
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(application.id, 'reviewing')}>
                      In Prüfung setzen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}