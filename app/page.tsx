"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Alert, ToggleButtonGroup, ToggleButton,
  Pagination, Button, Divider, Tooltip, Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import Navbar from "@/components/Navbar";
import NotificationCard from "@/components/NotificationCard";
import StatsBar from "@/components/StatsBar";
import { fetchNotifications } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Notification, NotificationType } from "@/lib/types";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");
  const [page, setPage] = useState(1);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info("HomePage", "Loading notifications", { typeFilter, page });
    try {
      const data = await fetchNotifications({ notification_type: typeFilter || undefined });
      const readIds: string[] = JSON.parse(sessionStorage.getItem("readIds") || "[]");
      const withRead = data.map((n) => ({ ...n, isRead: readIds.includes(n.ID) }));
      setAllNotifications(withRead);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch notifications";
      logger.error("HomePage", "Error loading", { error: msg });
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);
  useEffect(() => { setPage(1); }, [typeFilter]);

  function handleMarkRead(id: string) {
    const readIds: string[] = JSON.parse(sessionStorage.getItem("readIds") || "[]");
    if (!readIds.includes(id)) { readIds.push(id); sessionStorage.setItem("readIds", JSON.stringify(readIds)); }
    setAllNotifications((prev) => prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n)));
  }

  function handleMarkAllRead() {
    sessionStorage.setItem("readIds", JSON.stringify(allNotifications.map((n) => n.ID)));
    setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const totalPages = Math.ceil(allNotifications.length / PAGE_SIZE);
  const paginated = allNotifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar unreadCount={unreadCount} />
      <Box sx={{
        background: "linear-gradient(180deg, rgba(110,231,183,0.06) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(100,116,139,0.1)", px: { xs: 2, md: 4 }, py: 3,
      }}>
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Notifications</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Stay updated with placements, results & campus events
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Mark all as read">
                <Button size="small" startIcon={<DoneAllIcon />} onClick={handleMarkAllRead}
                  disabled={unreadCount === 0} variant="outlined" color="primary"
                  sx={{ borderColor: "rgba(110,231,183,0.3)", textTransform: "none" }}>
                  Mark all read
                </Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <Button size="small" startIcon={<RefreshIcon />} onClick={loadNotifications}
                  variant="outlined"
                  sx={{ borderColor: "rgba(100,116,139,0.3)", color: "text.secondary", textTransform: "none" }}>
                  Refresh
                </Button>
              </Tooltip>
            </Box>
          </Box>
          <StatsBar notifications={allNotifications} />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <ToggleButtonGroup
            value={typeFilter} exclusive
            onChange={(_, val) => setTypeFilter(val ?? "")}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                color: "text.secondary", border: "1px solid rgba(100,116,139,0.2)",
                textTransform: "none", fontWeight: 500, px: 1.5,
                "&.Mui-selected": { color: "#0A0F1E", fontWeight: 600 },
              },
            }}
          >
            <ToggleButton value="" sx={{ "&.Mui-selected": { bgcolor: "#6EE7B7 !important" } }}>
              <AllInboxIcon sx={{ fontSize: 16, mr: 0.5 }} /> All
            </ToggleButton>
            <ToggleButton value="Placement" sx={{ "&.Mui-selected": { bgcolor: "#F59E0B !important" } }}>
              <WorkIcon sx={{ fontSize: 16, mr: 0.5 }} /> Placement
            </ToggleButton>
            <ToggleButton value="Result" sx={{ "&.Mui-selected": { bgcolor: "#6EE7B7 !important" } }}>
              <EmojiEventsIcon sx={{ fontSize: 16, mr: 0.5 }} /> Result
            </ToggleButton>
            <ToggleButton value="Event" sx={{ "&.Mui-selected": { bgcolor: "#818CF8 !important" } }}>
              <EventIcon sx={{ fontSize: 16, mr: 0.5 }} /> Event
            </ToggleButton>
          </ToggleButtonGroup>
          {!loading && (
            <Chip label={`${allNotifications.length} notifications`} size="small"
              sx={{ color: "text.secondary", bgcolor: "rgba(100,116,139,0.1)" }} />
          )}
        </Box>
        <Divider sx={{ mb: 2.5, borderColor: "rgba(100,116,139,0.1)" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ bgcolor: "rgba(248,113,113,0.1)", color: "#FCA5A5" }}
            action={<Button size="small" onClick={loadNotifications} sx={{ color: "#FCA5A5" }}>Retry</Button>}>
            {error}
          </Alert>
        ) : paginated.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">No notifications found.</Typography>
          </Box>
        ) : (
          <>
            {paginated.map((n) => (
              <NotificationCard key={n.ID} notification={n} onMarkRead={handleMarkRead} />
            ))}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination count={totalPages} page={page}
                  onChange={(_, v) => { setPage(v); logger.info("HomePage", "Page changed", { page: v }); }}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": { color: "text.secondary" },
                    "& .Mui-selected": { bgcolor: "primary.main !important", color: "#0A0F1E" },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
