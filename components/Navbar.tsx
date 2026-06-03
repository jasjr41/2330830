"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props { unreadCount?: number; }

export default function Navbar({ unreadCount = 0 }: Props) {
  const pathname = usePathname();
  return (
    <AppBar position="sticky" elevation={0} sx={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(12px)" }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 2,
            background: "linear-gradient(135deg, #6EE7B7, #34D399)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <NotificationsIcon sx={{ fontSize: 18, color: "#0A0F1E" }} />
          </Box>
          <Typography variant="h6" sx={{
            fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: "1.1rem",
            background: "linear-gradient(135deg, #6EE7B7, #A7F3D0)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            CampusNotify
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link} href="/"
            startIcon={<Badge badgeContent={unreadCount} color="primary" max={99}><NotificationsIcon /></Badge>}
            size="small"
            sx={{
              bgcolor: pathname === "/" ? "primary.main" : "transparent",
              color: pathname === "/" ? "#0A0F1E" : "text.secondary",
              fontWeight: 600, textTransform: "none", borderRadius: 2,
              "&:hover": { bgcolor: pathname === "/" ? "primary.dark" : "rgba(110,231,183,0.1)" },
            }}
          >
            All Notifications
          </Button>
          <Button
            component={Link} href="/priority"
            startIcon={<StarIcon />}
            size="small"
            sx={{
              bgcolor: pathname === "/priority" ? "primary.main" : "transparent",
              color: pathname === "/priority" ? "#0A0F1E" : "text.secondary",
              fontWeight: 600, textTransform: "none", borderRadius: 2,
              "&:hover": { bgcolor: pathname === "/priority" ? "primary.dark" : "rgba(110,231,183,0.1)" },
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
