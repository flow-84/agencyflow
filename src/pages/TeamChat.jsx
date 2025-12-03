import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Users, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import { de } from "date-fns/locale";

export default function TeamChat() {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['teamMessages'],
    queryFn: () => base44.entities.ChatMessage.filter({ is_team_chat: true }, '-created_date', 100),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const sendMutation = useMutation({
    mutationFn: (data) => base44.entities.ChatMessage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMessages'] });
      setMessage("");
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMutation.mutate({
      sender_email: user?.email,
      sender_name: user?.full_name || 'Unbekannt',
      message: message.trim(),
      is_team_chat: true,
    });
  };

  const formatMessageDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, "'Heute um' HH:mm", { locale: de });
    }
    if (isYesterday(date)) {
      return format(date, "'Gestern um' HH:mm", { locale: de });
    }
    return format(date, "dd. MMM 'um' HH:mm", { locale: de });
  };

  const sortedMessages = [...messages].reverse();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-violet-600" />
          Team Chat
        </h1>
        <p className="text-slate-500 mt-1">Kommuniziere mit deinem Team</p>
      </motion.div>

      <Card className="flex-1 border-0 shadow-lg flex flex-col overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Team Kanal</CardTitle>
              <p className="text-sm text-slate-500">Alle Teammitglieder</p>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
              <p>Noch keine Nachrichten</p>
              <p className="text-sm">Starte die Konversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {sortedMessages.map((msg, index) => {
                  const isOwn = msg.sender_email === user?.email;
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className={`text-sm ${
                            isOwn ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {msg.sender_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`${isOwn ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${isOwn ? 'text-violet-600' : 'text-slate-700'}`}>
                              {isOwn ? 'Du' : msg.sender_name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatMessageDate(msg.created_date)}
                            </span>
                          </div>
                          <div className={`p-3 rounded-2xl ${
                            isOwn 
                              ? 'bg-violet-600 text-white rounded-br-md' 
                              : 'bg-slate-100 text-slate-900 rounded-bl-md'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-slate-50">
          <form onSubmit={handleSend} className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nachricht schreiben..."
              className="flex-1 border-slate-200"
              disabled={sendMutation.isPending}
            />
            <Button 
              type="submit" 
              disabled={!message.trim() || sendMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}