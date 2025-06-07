import * as React from "react";
import { useState } from "react";
import { Box, Container, Paper, Typography, IconButton, Avatar, Divider, Popover, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "./AuthContext";

const gradientBg = "linear-gradient(120deg,#e3eaf0 60%,#5C7C89 100%)";
const defaultUser = {
  name: "John Doe",
  email: "john@example.com",
  address: "123 Main St, Anytown, Country",
};

export default function WealthAegis({ children }: { children: React.ReactNode }) {
  const { logout, user: authUser } = useAuth();
  const [user] = useState(defaultUser);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const profilePopoverOpen = Boolean(profileAnchorEl);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#FFFFFF", background: gradientBg }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 8,
            bgcolor: "#011425",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 16px 48px 0 rgba(54,79,219,0.12)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MonetizationOnIcon style={{ fontSize: 48, color: "#1F4959" }} />
            <span
              style={{
                fontWeight: 900,
                fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
                fontSize: 54,
                lineHeight: 1.1,
                padding: "0 16px",
                borderRadius: "12px",
                userSelect: "none",
                background: "linear-gradient(180deg, #FFFFFF 0%, #5C7C89 50%, #1F4959 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                boxDecorationBreak: "clone",
                display: "inline-block",
                textShadow: `
                  0 2px 12px rgba(36,36,36,0.18),
                  0 1px 0 #fff,
                  0 4px 24px #1F4959,
                  0 1px 18px #fff,
                  0 8px 32px #011425
                `
              }}
            >
              Wealth Aegis
            </span>
          </div>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                borderRadius: 2,
                px: 1.2,
                py: 0.5,
                transition: "background 0.18s",
                "&:hover, &:focus": { background: "#1F4959" }
              }}
              onClick={e => setProfileAnchorEl(e.currentTarget)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setProfileAnchorEl(e.currentTarget as HTMLElement);
              }}
              aria-label="Show profile"
              role="button"
            >
              <Avatar sx={{ bgcolor: "#5C7C89", color: "#fff", fontWeight: 800, width: 44, height: 44, fontSize: 23 }}>
                {(authUser?.name || user.name)[0]?.toUpperCase()}
              </Avatar>
              <Typography fontWeight={700} fontSize={20} sx={{ color: "#5C7C89" }}>
                {authUser?.name || user.name}
              </Typography>
            </Box>
            <IconButton sx={{ color: "#5C7C89" }} onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Box>
          {/* Profile Popover */}
          <Popover
            open={profilePopoverOpen}
            anchorEl={profileAnchorEl}
            onClose={() => setProfileAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                background: "#FFFFFF",
                color: "#242424",
                borderRadius: 3,
                border: "1px solid #5C7C89"
              }
            }}
          >
            <Typography variant="h5" fontWeight={800} gutterBottom>
              <AccountCircleIcon sx={{ verticalAlign: "middle", mr: 1, color: "#1F4959" }} />
              Profile Information
            </Typography>
            <Divider sx={{ my: 2, borderColor: "#5C7C89" }} />
            <Typography fontSize={20} sx={{ mb: 1 }}>Name: <b>{user.name}</b></Typography>
            <Typography fontSize={20} sx={{ mb: 1 }}>Email: <b>{user.email}</b></Typography>
            <Typography fontSize={20} sx={{ mb: 1 }}>Address: <b>{user.address}</b></Typography>
          </Popover>
        </Paper>
        {/* NavBar + page content */}
        <Stack>
          {children}
        </Stack>
      </Container>
    </Box>
  );
}