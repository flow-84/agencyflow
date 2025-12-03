import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, parseISO, isToday } from "date-fns";
import { de } from "date-fns/locale";

export default function MyShifts() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ['myShifts', user?.email],
    queryFn: () => base44.entities.Shift.filter({ chatter_email: user?.email }, '-date'),
    enabled: !!user?.email,
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const getShiftForDay = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shifts.find(s => s.date === dateStr);
  };

  const statusConfig = {
    scheduled: { label: "Geplant", color: "bg-blue-100 text-blue-700 border-blue-200" },
    active: { label: "Aktiv", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    completed: { label: "Abgeschlossen", color: "bg-slate-100 text-slate-700 border-slate-200" },
    cancelled: { label: "Abgesagt", color: "bg-rose-100 text-rose-700 border-rose-200" },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Meine Schichten</h1>
        <p className="text-slate-500 mt-1">Übersicht deiner geplanten Arbeitszeiten</p>
      </motion.div>

      {/* Week Navigation */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-violet-600" />
              {format(weekStart, "MMMM yyyy", { locale: de })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Heute
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {weekDays.map((day, index) => {
              const shift = getShiftForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="min-h-[140px]"
                >
                  <div className={`text-center p-2 rounded-lg mb-2 ${
                    isCurrentDay ? 'bg-violet-100 text-violet-700' : 'bg-slate-50'
                  }`}>
                    <p className="text-xs font-medium uppercase">
                      {format(day, "EEE", { locale: de })}
                    </p>
                    <p className={`text-lg font-bold ${isCurrentDay ? 'text-violet-700' : 'text-slate-900'}`}>
                      {format(day, "d")}
                    </p>
                  </div>

                  {shift ? (
                    <Card className={`p-3 border-l-4 ${
                      shift.status === 'active' ? 'border-l-emerald-500' :
                      shift.status === 'cancelled' ? 'border-l-rose-500' :
                      'border-l-violet-500'
                    } shadow-sm`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {shift.start_time}
                        </div>
                        <div className="text-xs text-slate-500">
                          bis {shift.end_time}
                        </div>
                        {shift.assigned_model && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            {shift.assigned_model}
                          </div>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${statusConfig[shift.status]?.color}`}
                        >
                          {statusConfig[shift.status]?.label}
                        </Badge>
                      </div>
                    </Card>
                  ) : (
                    <div className="h-20 border border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-slate-400">Frei</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming List */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Alle anstehenden Schichten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shifts
              .filter(s => new Date(s.date) >= new Date() && s.status !== 'cancelled')
              .slice(0, 10)
              .map(shift => {
                const status = statusConfig[shift.status] || statusConfig.scheduled;
                return (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs text-slate-500 uppercase">
                          {format(parseISO(shift.date), "EEE", { locale: de })}
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {format(parseISO(shift.date), "d. MMM", { locale: de })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {shift.start_time} - {shift.end_time}
                        </p>
                        {shift.assigned_model && (
                          <p className="text-sm text-slate-500">
                            Model: {shift.assigned_model}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                );
              })}

            {shifts.filter(s => new Date(s.date) >= new Date() && s.status !== 'cancelled').length === 0 && (
              <p className="text-center text-slate-500 py-8">
                Keine anstehenden Schichten geplant
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}