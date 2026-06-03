"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Notification, NotificationType } from "@/lib/types";
import { logger } from "@/lib/logger";

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
  showScore?: boolean;
  score?: number;
  rank?: number;
}

const typeConfig: Record<
  NotificationType,
  { color: string; bg: string; Icon: React.ElementType; label: string }
> = {
  Placement: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", Icon: WorkIcon, label: "Placement" },
  Result: { color: "#6EE7B7", bg: "rgba(110,231,183,0.12)", Icon: EmojiEventsIcon, label: "Result" },
  Event: { color: "#818CF8", bg: "rgba(129,140,248,0.12)", Icon: EventIcon, label: "Event" },
};

function timeAgo(timestamp: string): string {
  const diffMs = new Date().getTime() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function NotificationCard({ notification, onMarkRead, showScore, score, rank }: Props) {
  const config = typeConfig[notification.Type];
  const Icon = config.Icon;
  const isUnread = !notification.isRead;

  function handleMarkRead() {
    logger.info("NotificationCard", "User marked notification as read", { id: notification.ID });
    onMarkRead(notification.ID);
  }

  return (
    <Card
      sx={{
        mb: 1.5,
        background: isUnread
          ? `linear-gradient(135deg, ${config.bg} 0%, rgba(15,23,41,0.95) 60%)`
          : "rgba(15,23,41,0.7)",
        borderColor: isUnread ? `${config.color}30` : "rgba(100,116,139,0.1)",
        borderLeft: isUnread ? `3px solid ${config.color}` : "3px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: `${config.color}60`,
          transform: "translateX(2px)",
          boxShadow: `0 4px 24px ${config.color}15`,
        },
        position: "relative",
        overflow: "visible",
      }}
    >
      {rank && (
        <Box
          sx={{
            position: "absolute", top: -10, left: -10,
            width: 28, height: 28, borderRadius: "50%",
            background: `linear-gradient(135deg, ${config.color}, ${config.color}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 800, color: "#0A0F1E",
            boxShadow: `0 2px 8px ${config.color}40`, zIndex: 1,
          }}
        >
          #{rank}
        </Box>
      )}
      <CardContent sx={{ p: "14px 16px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2,
              background: config.bg, border: `1px solid ${config.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 18, color: config.color }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Chip
                label={config.label}
                size="small"
                sx={{
                  background: config.bg, color: config.color,
                  border: `1px solid ${config.color}30`, fontSize: "0.68rem", height: 20,
                }}
              />
              {isUnread && <FiberManualRecordIcon sx={{ fontSize: 8, color: config.color }} />}
              <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto", flexShrink: 0 }}>
                {timeAgo(notification.Timestamp)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: isUnread ? "text.primary" : "text.secondary",
                fontWeight: isUnread ? 500 : 400,
                lineHeight: 1.4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {notification.Message}
            </Typography>
            {showScore && score !== undefined && (
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                Priority score: {score.toFixed(0)}
              </Typography>
            )}
          </Box>
          {isUnread && (
            <Tooltip title="Mark as read">
              <IconButton
                size="small" onClick={handleMarkRead}
                sx={{ color: "text.secondary", "&:hover": { color: config.color } }}
              >
                <MarkEmailReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
