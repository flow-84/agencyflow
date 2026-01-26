import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import ShiftCard from "@/components/shifts/ShiftCard";

export default function Shifts() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDialog, setShowDialog] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({
    chatter_email: "",
    chatter_name: "",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "17:00",
    assigned_model: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => base44.entities.Shift.list('-date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => base44.entities.ModelProfile.list(),
  });

  const chatters = users.filter(u => u.user_role === 'chatter');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Shift.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Shift.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Shift.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  const resetForm = () => {
    setFormData({
      chatter_email: "",
      chatter_name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      end_time: "17:00",
      assigned_model: "",
      notes: "",
    });
    setEditingShift(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedChatter = chatters.find(c => c.email === formData.chatter_email);
    const data = {
      ...formData,
      chatter_name: selectedChatter?.full_name || formData.chatter_email,
    };

    if (editingShift) {
      updateMutation.mutate({ id: editingShift.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      chatter_email: shift.chatter_email,
      chatter_name: shift.chatter_name,
      date: shift.date,
      start_time: shift.start_time,
      end_time: shift.end_time,
      assigned_model: shift.assigned_model || "",
      notes: shift.notes || "",
    });
    setShowDialog(true);
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const getShiftsForDay = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shifts.filter(s => s.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schichtplan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Plane und verwalte Chatter-Schichten</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Schicht
        </Button>
      </motion.div>

      {/* Week Navigation */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
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
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dayShifts = getShiftsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div key={index} className="min-h-[200px]">
                  <div className={`text-center p-2 rounded-lg mb-2 ${
                    isToday ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' : 'bg-slate-50 dark:bg-slate-700/50'
                  }`}>
                    <p className={`text-xs font-medium uppercase ${isToday ? '' : 'text-slate-600 dark:text-slate-400'}`}>
                      {format(day, "EEE", { locale: de })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-pink-700 dark:text-pink-400' : 'text-slate-900 dark:text-white'}`}>
                      {format(day, "d")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {dayShifts.map(shift => (
                        <ShiftCard
                          key={shift.id}
                          shift={shift}
                          onClick={() => handleEdit(shift)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Schicht bearbeiten' : 'Neue Schicht erstellen'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Chatter</Label>
              <Select
                value={formData.chatter_email}
                onValueChange={(value) => setFormData({ ...formData, chatter_email: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chatter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {chatters.map(chatter => (
                    <SelectItem key={chatter.id} value={chatter.email}>
                      {chatter.full_name || chatter.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Datum</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Startzeit</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Endzeit</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Model zuweisen (optional)</Label>
              <Select
                value={formData.assigned_model}
                onValueChange={(value) => setFormData({ ...formData, assigned_model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Model auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Kein Model</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.display_name}>
                      {model.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notizen</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optionale Notizen..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              {editingShift && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    deleteMutation.mutate(editingShift.id);
                    setShowDialog(false);
                  }}
                >
                  Löschen
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                {editingShift ? 'Speichern' : 'Erstellen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}