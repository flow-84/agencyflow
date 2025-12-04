import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorClasses = {
    violet: "from-violet-500 to-purple-600 shadow-violet-200",
    blue: "from-blue-500 to-cyan-600 shadow-blue-200",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-200",
    amber: "from-amber-500 to-orange-600 shadow-amber-200",
    rose: "from-rose-500 to-pink-600 shadow-rose-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg shadow-slate-200/50">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{title}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{value}</h3>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">{subtitle}</p>
              )}
              {trend && (
                <div className={`inline-flex items-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium ${
                  trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
              )}
            </div>
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex-shrink-0`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`} />
      </Card>
    </motion.div>
  );
}