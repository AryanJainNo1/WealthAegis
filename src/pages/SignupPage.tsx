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
  Divider
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conf, setConf] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSuccess(false);
    if (!name || !email || !password) {
      setErr("Please fill in all fields.");
      return;
    }
    if (password !== conf) {
      setErr("Passwords do not match.");
      return;
    }
    const ok = await signup(name, email, password);
    if (!ok) {
      setErr("Account already exists.");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  const handleBackToLogin = () => {
    navigate("/login");
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
        maxWidth: 438,
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
          <PersonAddAltIcon sx={{ fontSize: 38 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={900} mb={1} letterSpacing="-0.04em" color="primary.main">
          Create Account
        </Typography>
        <Typography color="text.secondary" fontWeight={600} mb={3} sx={{ textAlign: "center" }}>
          Welcome to WealthAegis! Create an account to get started.
        </Typography>
        {err && <Alert severity="error" sx={{ mb: 2, width: "100%" }}>{err}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: "100%" }}>Account created! Redirecting to login...</Alert>}
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddAltIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
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
            autoComplete="new-password"
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            value={conf}
            onChange={e => setConf(e.target.value)}
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
            Sign Up
          </Button>
        </form>
        <Divider sx={{ my: 3, width: "100%" }}>Already have an account?</Divider>
        <Button
          onClick={handleBackToLogin}
          fullWidth
          startIcon={<ArrowBackIcon />}
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