"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Alert, Slider, Button,
  ToggleButtonGroup, ToggleButton, Divider, Paper, Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import Navbar from "@/components/Navbar";
import NotificationCard from "@/components/NotificationCard";
import { fetchNotifications, getTopNPriority, getPriorityScore } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Notification, NotificationType } from "@/lib/types";

export default function PriorityPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");

  const loadNotifications = useCallback(async () => {
    setLoading(true); setError(null);
    logger.info("PriorityPage", "Loading notifications");
    try {
      const data = await fetchNotifications();
      const readIds: string[] = JSON.parse(sessionStorage.getItem("readIds") || "[]");
      setAllNotifications(data.map((n) => ({ ...n, isRead: readIds.includes(n.ID) })));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch";
      logger.error("PriorityPage", "Error", { error: msg });
      setError(msg);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  function handleMarkRead(id: string) {
    const readIds: string[] = JSON.parse(sessionStorage.getItem("readIds") || "[]");
    if (!readIds.includes(id)) { readIds.push(id); sessionStorage.setItem("readIds", JSON.stringify(readIds)); }
    setAllNotifications((prev) => prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n)));
  }

  const filtered = typeFilter ? allNotifications.filter((n) => n.Type === typeFilter) : allNotifications;
  const priorityNotifications = getTopNPriority(filtered, topN);
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;
  const typeCount = (type: NotificationType) => allNotifications.filter((n) => n.Type === type).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar unreadCount={unreadCount} />
      <Box sx={{
        background: "linear-gradient(180deg, rgba(245,158,11,0.06) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(100,116,139,0.1)", px: { xs: 2, md: 4 }, py: 3,
      }}>
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <StarIcon sx={{ fontSize: 20, color: "#0A0F1E" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Priority Inbox</Typography>
              <Typography variant="body2" color="text.secondary">
                Top notifications ranked by type importance and recency
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
            {[
              { type: "Placement", color: "#F59E0B", weight: 3 },
              { type: "Result", color: "#6EE7B7", weight: 2 },
              { type: "Event", color: "#818CF8", weight: 1 },
            ].map((item) => (
              <Chip key={item.type}
                label={`${item.type} — weight ${item.weight}`} size="small"
                sx={{ bgcolor: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30`, fontWeight: 600, fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
        <Paper sx={{ p: 2.5, mb: 3, bgcolor: "rgba(15,23,41,0.8)", border: "1px solid rgba(100,116,139,0.15)" }} elevation={0}>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}>
                Show top{" "}
                <Typography component="span" sx={{ color: "#F59E0B", fontWeight: 700 }}>{topN}</Typography>
                {" "}notifications
              </Typography>
              <Slider
                value={topN} min={5} max={Math.min(50, filtered.length || 50)} step={5}
                marks={[{ value: 5, label: "5" }, { value: 10, label: "10" }, { value: 15, label: "15" }, { value: 20, label: "20" }]}
                onChange={(_, val) => { setTopN(val as number); logger.info("PriorityPage", "TopN changed", { topN: val }); }}
                sx={{
                  color: "#F59E0B",
                  "& .MuiSlider-markLabel": { color: "text.secondary", fontSize: "0.7rem" },
                  "& .MuiSlider-thumb": { boxShadow: "0 0 8px rgba(245,158,11,0.4)" },
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}>Filter by type</Typography>
              <ToggleButtonGroup
                value={typeFilter} exclusive
                onChange={(_, val) => { setTypeFilter(val ?? ""); logger.info("PriorityPage", "Filter changed", { val }); }}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "text.secondary", border: "1px solid rgba(100,116,139,0.2)",
                    textTransform: "none", fontWeight: 500, px: 1.5,
                    "&.Mui-selected": { color: "#0A0F1E", fontWeight: 700 },
                  },
                }}
              >
                <ToggleButton value="" sx={{ "&.Mui-selected": { bgcolor: "#6EE7B7 !important" } }}>
                  <AllInboxIcon sx={{ fontSize: 15, mr: 0.5 }} /> All
                </ToggleButton>
                <ToggleButton value="Placement" sx={{ "&.Mui-selected": { bgcolor: "#F59E0B !important" } }}>
                  <WorkIcon sx={{ fontSize: 15, mr: 0.5 }} /> Placement ({typeCount("Placement")})
                </ToggleButton>
                <ToggleButton value="Result" sx={{ "&.Mui-selected": { bgcolor: "#6EE7B7 !important" } }}>
                  <EmojiEventsIcon sx={{ fontSize: 15, mr: 0.5 }} /> Result ({typeCount("Result")})
                </ToggleButton>
                <ToggleButton value="Event" sx={{ "&.Mui-selected": { bgcolor: "#818CF8 !important" } }}>
                  <EventIcon sx={{ fontSize: 15, mr: 0.5 }} /> Event ({typeCount("Event")})
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Button size="small" startIcon={<RefreshIcon />} onClick={loadNotifications}
              variant="outlined"
              sx={{ borderColor: "rgba(100,116,139,0.3)", color: "text.secondary", alignSelf: "flex-end", textTransform: "none" }}>
              Refresh
            </Button>
          </Box>
        </Paper>
        <Divider sx={{ mb: 2.5, borderColor: "rgba(100,116,139,0.1)" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#F59E0B" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ bgcolor: "rgba(248,113,113,0.1)", color: "#FCA5A5" }}
            action={<Button size="small" onClick={loadNotifications} sx={{ color: "#FCA5A5" }}>Retry</Button>}>
            {error}
          </Alert>
        ) : priorityNotifications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">No notifications match the current filter.</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Showing{" "}
              <Typography component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
                {priorityNotifications.length}
              </Typography>
              {" "}highest-priority notifications{typeFilter ? ` (${typeFilter} only)` : " (all types)"}
            </Typography>
            {priorityNotifications.map((n, i) => (
              <NotificationCard key={n.ID} notification={n} onMarkRead={handleMarkRead}
                rank={i + 1} showScore score={getPriorityScore(n)} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}
