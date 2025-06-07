import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function GuestPage() {
  const { loginAsGuest, user } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Navigate only once after guest login
    if (user && user.guest && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/holdings", { replace: true });
    }
  }, [user, navigate]);

  const handleGuest = () => {
    hasNavigated.current = false; // Reset navigation guard before login
    loginAsGuest();
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "linear-gradient(120deg,#f5f7fa 80%,#e9ecef 100%)"
    }}>
      <Paper elevation={6} sx={{
        maxWidth: 410,
        width: "100%",
        mx: "auto",
        p: { xs: 3, md: 5 },
        borderRadius: 5,
        boxShadow: "0 6px 40px 0 rgba(54,79,219,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#fff"
      }}>
        <Avatar sx={{
          bgcolor: "primary.main",
          width: 64,
          height: 64,
          mb: 2,
          boxShadow: "0 4px 14px 0 rgba(54,79,219,0.10)"
        }}>
          <PersonOutlineIcon sx={{ fontSize: 38 }} />
        </Avatar>
        <Typography variant="h5" fontWeight={900} mb={1} letterSpacing="-0.04em" color="primary.main">
          Continue as Guest
        </Typography>
        <Typography color="text.secondary" fontWeight={600} mb={3} sx={{ textAlign: "center" }}>
          Browse WealthAegis as a guest.<br />
          <span style={{ color: "#888", fontWeight: 400 }}>Some features may be restricted.</span>
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            fontWeight: 900,
            fontSize: 17,
            borderRadius: 3,
            py: 1.2,
            background: "linear-gradient(90deg,#3b5bdb 70%,#228be6 100%)"
          }}
          startIcon={<PersonOutlineIcon />}
          onClick={handleGuest}
        >
          Continue as Guest
        </Button>
        <Divider sx={{ my: 3, width: "100%" }}>Already have an account?</Divider>
        <Button
          onClick={() => navigate("/login")}
          fullWidth
          startIcon={<LoginIcon />}
          sx={{
            fontWeight: 700,
            color: "primary.main",
            borderRadius: 2,
            bgcolor: "#f5f7fa",
            boxShadow: "none",
            border: "1.5px solid #e9ecef",
            "&:hover": { bgcolor: "#edf2ff" }
          }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
}