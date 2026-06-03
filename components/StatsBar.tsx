"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { Notification } from "@/lib/types";

interface Props { notifications: Notification[]; }

export default function StatsBar({ notifications }: Props) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.isRead).length;
  const placements = notifications.filter((n) => n.Type === "Placement").length;
  const results = notifications.filter((n) => n.Type === "Result").length;
  const events = notifications.filter((n) => n.Type === "Event").length;

  const stats = [
    { label: "Total", value: total, color: "#94A3B8" },
    { label: "Unread", value: unread, color: "#6EE7B7" },
    { label: "Placements", value: placements, color: "#F59E0B" },
    { label: "Results", value: results, color: "#6EE7B7" },
    { label: "Events", value: events, color: "#818CF8" },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 0.5 }}>
      {stats.map((s) => (
        <Box
          key={s.label}
          sx={{
            flexShrink: 0, px: 2, py: 1.5, borderRadius: 2,
            background: "rgba(15,23,41,0.8)",
            border: "1px solid rgba(100,116,139,0.15)",
            minWidth: 90, textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: s.color, fontWeight: 700, lineHeight: 1 }}>
            {s.value}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {s.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
