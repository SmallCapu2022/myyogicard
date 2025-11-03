"use client";

import { motion } from "framer-motion";
import { BarChart2, Activity, Clock } from "lucide-react";

interface StudioStatsProps {
  stats: {
    active: number;
    expired: number;
    pending: number;
  };
}

/**
 * 🌿 Composant affichant les statistiques du studio :
 * cartes actives, en attente, expirées.
 * Animé et harmonisé avec la palette MyYogiCard.
 */
export default function StudioStats({ stats }: StudioStatsProps) {
  const data = [
    {
      label: "Actives",
      value: stats.active,
      color: "text-tealdeep",
      bg: "bg-sage/30",
      icon: <Activity className="text-tealdeep" size={22} />,
    },
    {
      label: "En attente",
      value: stats.pending,
      color: "text-warning",
      bg: "bg-amber-100",
      icon: <Clock className="text-warning" size={22} />,
    },
    {
      label: "Expirées",
      value: stats.expired,
      color: "text-terracotta",
      bg: "bg-rose-100",
      icon: <BarChart2 className="text-terracotta" size={22} />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-8">
      {data.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-2xl shadow-sm ${item.bg} border border-sage flex flex-col items-center justify-center transition duration-300`}
        >
          <div className="mb-2">{item.icon}</div>
          <p className={`text-2xl font-semibold ${item.color}`}>{item.value}</p>
          <p className="text-sm text-brownsoft">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
