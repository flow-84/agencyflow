import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MoreVertical, UserPlus, Mail, Phone, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (email) => {
      // Invite user with VIP role
      const result = await base44.entities.User.invite(email, { user_role: 'vip' });
      
      // Create notification for all admins
      await base44.entities.Notification.create({
        type: 'vip_invited',
        title: 'Neuer VIP eingeladen',
        message: `VIP-Einladung wurde an ${email} versendet`,
        user_email: email,
        for_admins: true,
      });
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setInviteDialog(false);
      setInviteEmail("");
    },
  });

  const handleStatusChange = (userId, status) => {
    updateMutation.mutate({ id: userId, data: { status } });
  };

  const handleRoleChange = (userId, user_role) => {
    updateMutation.mutate({ id: userId, data: { user_role } });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.user_role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleConfig = {
    admin: { label: "Admin", color: "bg-violet-100 text-violet-700" },
    chatter: { label: "Chatter", color: "bg-blue-100 text-blue-700" },
    model: { label: "Model", color: "bg-pink-100 text-pink-700" },
    vip: { label: "VIP", color: "bg-amber-100 text-amber-700" },
  };

  const statusConfig = {
    active: { label: "Aktiv", color: "bg-emerald-100 text-emerald-700" },
    inactive: { label: "Inaktiv", color: "bg-slate-100 text-slate-700" },
    pending: { label: "Ausstehend", color: "bg-amber-100 text-amber-700" },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nutzer</h1>
          <p className="text-slate-500 mt-1">Verwalte alle Benutzerkonten</p>
        </div>
        <Button
          onClick={() => setInviteDialog(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          VIP einladen
        </Button>
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
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="chatter">Chatter</SelectItem>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="inactive">Inaktiv</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nutzer</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registriert</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-12 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                  Keine Nutzer gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => {
                const role = roleConfig[user.user_role] || roleConfig.chatter;
                const status = statusConfig[user.status] || statusConfig.pending;
                
                return (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                            {user.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{user.full_name || 'Unbekannt'}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${role.color} border-0`}>
                        {role.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${status.color} border`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {user.created_date ? format(new Date(user.created_date), "dd. MMM yyyy", { locale: de }) : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                            Als aktiv markieren
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                            Als inaktiv markieren
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'chatter')}>
                            Rolle: Chatter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'model')}>
                            Rolle: Model
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                            Rolle: Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'vip')}>
                            Rolle: VIP
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VIP einladen</DialogTitle>
            <DialogDescription>
              Lade einen neuen VIP-Nutzer per E-Mail ein. Der Nutzer erhält eine Einladungs-E-Mail mit einem Link zum Setzen des Passworts oder zur Anmeldung mit Google.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>E-Mail-Adresse *</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="vip@beispiel.de"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialog(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => inviteMutation.mutate(inviteEmail)}
              disabled={!inviteEmail || inviteMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {inviteMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Einladung senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}