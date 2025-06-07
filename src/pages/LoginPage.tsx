import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const ok = await login(email, password);
    if (!ok) setErr("Invalid credentials");
    else navigate("/holdings");
  };

  const handleGuest = () => {
    navigate("/guest");
  };

  const handleSignup = () => {
    navigate("/signup");
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
        maxWidth: 420,
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
          <LoginIcon sx={{ fontSize: 38 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={900} mb={1} letterSpacing="-0.04em" color="primary.main">
          Welcome
        </Typography>
        <Typography color="text.secondary" fontWeight={600} mb={3} sx={{ textAlign: "center" }}>
          Log in to your Wealth Aegis account.
        </Typography>
        {err && <Alert severity="error" sx={{ mb: 2, width: "100%" }}>{err}</Alert>}
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 900,
              fontSize: 17,
              borderRadius: 3,
              background: "linear-gradient(90deg,#3b5bdb 70%,#228be6 100%)"
            }}
          >
            Login
          </Button>
        </form>
        <Divider sx={{ my: 3, width: "100%" }}>No account?</Divider>
        <Button
          onClick={handleSignup}
          fullWidth
          startIcon={<PersonAddAltIcon />}
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
          Sign Up
        </Button>
        <Button
          onClick={handleGuest}
          fullWidth
          startIcon={<PersonOutlineIcon />}
          sx={{
            mt: 2,
            fontWeight: 700,
            color: "#555",
            borderRadius: 2,
            bgcolor: "#f7f8fa",
            border: "1.5px solid #e9ecef",
            "&:hover": { bgcolor: "#e9ecef" }
          }}
        >
          Continue as Guest
        </Button>
      </Paper>
    </Box>
  );
}