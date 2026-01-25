import React from "react";
import { motion } from "framer-motion";
import TeamMindmap from "@/components/team/TeamMindmap";

export default function TeamMindmapPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Team Hierarchie</h1>
        <p className="text-slate-500 mt-1">
          Organisationsstruktur und Teammitglieder
        </p>
      </motion.div>

      <TeamMindmap />
    </div>
  );
}