import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationCard from "@/components/applications/ApplicationCard";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.Application.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Application.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesRole = roleFilter === "all" || app.role_type === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bewerbungen</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte eingehende Bewerbungen</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Name oder E-Mail suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Rolle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Rollen</SelectItem>
            <SelectItem value="chatter">Chatter</SelectItem>
            <SelectItem value="model">Model</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            Alle <Badge variant="secondary" className="ml-2 bg-slate-200">{statusCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Offen <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">{statusCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewing" className="data-[state=active]:bg-white">
            In Prüfung <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">{statusCounts.reviewing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white">
            Genehmigt <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">{statusCounts.approved}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applications Grid */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Keine Bewerbungen</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Es wurden keine passenden Bewerbungen gefunden.</p>
            </motion.div>
          ) : (
            filteredApplications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusChange={handleStatusChange}
                onView={setSelectedApplication}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bewerbungsdetails</DialogTitle>
            <DialogDescription>
              Eingereicht am {selectedApplication && format(new Date(selectedApplication.created_date), "dd. MMMM yyyy", { locale: de })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Name</label>
                  <p className="font-medium">{selectedApplication.applicant_name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">E-Mail</label>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Telefon</label>
                  <p className="font-medium">{selectedApplication.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Rolle</label>
                  <p className="font-medium capitalize">{selectedApplication.role_type}</p>
                </div>
              </div>

              {selectedApplication.experience && (
                <div>
                  <label className="text-sm text-slate-500">Erfahrung</label>
                  <p className="mt-1">{selectedApplication.experience}</p>
                </div>
              )}

              {selectedApplication.motivation && (
                <div>
                  <label className="text-sm text-slate-500">Motivation</label>
                  <p className="mt-1">{selectedApplication.motivation}</p>
                </div>
              )}

              {selectedApplication.resume_url && (
                <div>
                  <label className="text-sm text-slate-500">Lebenslauf</label>
                  <a
                    href={selectedApplication.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline block mt-1"
                  >
                    Dokument öffnen
                  </a>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    handleStatusChange(selectedApplication.id, 'approved');
                    setSelectedApplication(null);
                  }}
                >
                  Genehmigen
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    handleStatusChange(selectedApplication.id, 'rejected');
                    setSelectedApplication(null);
                  }}
                >
                  Ablehnen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClipboardList(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}