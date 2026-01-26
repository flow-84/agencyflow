import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Download, CheckCircle, Clock, AlertCircle, PenTool } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import SignatureDialog from "@/components/documents/SignatureDialog";

export default function MyDocuments() {
  const queryClient = useQueryClient();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['myDocs', user?.email],
    queryFn: () => base44.entities.Document.filter({ owner_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const { data: profile } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.ModelProfile.filter({ user_email: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  const updateDocMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Document.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDocs'] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.ModelProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });

  const handleSign = async (doc, signatureDataUrl) => {
    // Upload signature as image
    const response = await fetch(signatureDataUrl);
    const blob = await response.blob();
    const file = new File([blob], "signature.png", { type: "image/png" });
    
    const { file_url: signatureUrl } = await base44.integrations.Core.UploadFile({ file });
    
    // Update document with signature
    await updateDocMutation.mutateAsync({
      id: doc.id,
      data: {
        is_signed: true,
        signed_at: new Date().toISOString(),
        signature_url: signatureUrl,
      },
    });

    // Update ModelProfile contract_signed if this is a contract
    if (doc.type === 'contract' && profile) {
      await updateProfileMutation.mutateAsync({
        contract_signed: true,
        contract_url: doc.file_url,
      });
    }
  };

  const openSignDialog = (doc) => {
    setSelectedDoc(doc);
    setSignDialogOpen(true);
  };

  const typeConfig = {
    contract: { label: "Vertrag", color: "bg-violet-100 text-violet-700", icon: "📄" },
    nda: { label: "NDA", color: "bg-blue-100 text-blue-700", icon: "🔒" },
    policy: { label: "Richtlinie", color: "bg-emerald-100 text-emerald-700", icon: "📋" },
    other: { label: "Sonstiges", color: "bg-slate-100 text-slate-700", icon: "📎" },
  };

  const pendingDocs = documents.filter(d => !d.is_signed);
  const signedDocs = documents.filter(d => d.is_signed);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meine Dokumente</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Verträge und wichtige Unterlagen</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-slate-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingDocs.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ausstehend</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-slate-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{signedDocs.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Unterschrieben</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Documents */}
      {pendingDocs.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50 border-l-4 border-l-amber-500 dark:border-l-amber-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Ausstehende Dokumente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingDocs.map(doc => {
              const type = typeConfig[doc.type] || typeConfig.other;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{type.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${type.color} border-0 dark:bg-opacity-20`}>
                          {type.label}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {format(new Date(doc.created_date), "dd. MMM yyyy", { locale: de })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => openSignDialog(doc)}
                  >
                    <PenTool className="w-4 h-4 mr-1" />
                    Öffnen & Unterschreiben
                  </Button>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Signed Documents */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 dark:shadow-slate-900/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            Unterschriebene Dokumente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {signedDocs.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              Noch keine unterschriebenen Dokumente
            </p>
          ) : (
            <div className="space-y-3">
              {signedDocs.map(doc => {
                const type = typeConfig[doc.type] || typeConfig.other;
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{doc.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${type.color} border-0 dark:bg-opacity-20`}>
                            {type.label}
                          </Badge>
                          {doc.signed_at && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              Unterschrieben am {format(new Date(doc.signed_at), "dd. MMM yyyy", { locale: de })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {doc.file_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {documents.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Keine Dokumente</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Dir wurden noch keine Dokumente zugewiesen.</p>
        </div>
      )}

      <SignatureDialog
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
        document={selectedDoc}
        onSign={handleSign}
      />
    </div>
  );
}