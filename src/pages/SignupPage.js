import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, TextField, Typography, Alert, InputAdornment, Avatar, Paper, Divider } from "@mui/material";
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
    const handleSignup = async (e) => {
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
            const user = useAuth().user;
            setErr(user?.error || "Failed to create account");
            return;
        }
        setName("");
        setEmail("");
        setPassword("");
        setConf("");
        setSuccess(true);
        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1200);
    };
    const handleBackToLogin = () => {
        navigate("/login");
    };
    return (_jsx(Box, { sx: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "linear-gradient(120deg,#f5f7fa 80%,#e9ecef 100%)"
        }, children: _jsxs(Paper, { elevation: 6, sx: {
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
            }, children: [_jsx(Avatar, { sx: {
                        bgcolor: "primary.main",
                        width: 64,
                        height: 64,
                        mb: 2,
                        boxShadow: "0 4px 14px 0 rgba(54,79,219,0.10)"
                    }, children: _jsx(PersonAddAltIcon, { sx: { fontSize: 38 } }) }), _jsx(Typography, { variant: "h4", fontWeight: 900, mb: 1, letterSpacing: "-0.04em", color: "primary.main", children: "Create Account" }), _jsx(Typography, { color: "text.secondary", fontWeight: 600, mb: 3, sx: { textAlign: "center" }, children: "Welcome to WealthAegis! Create an account to get started." }), err && _jsx(Alert, { severity: "error", sx: { mb: 2, width: "100%" }, children: err }), success && _jsx(Alert, { severity: "success", sx: { mb: 2, width: "100%" }, children: "Account created! Redirecting to login..." }), _jsxs("form", { onSubmit: handleSignup, style: { width: "100%" }, children: [_jsx(TextField, { label: "Full Name", variant: "outlined", fullWidth: true, margin: "normal", autoComplete: "name", value: name, onChange: e => setName(e.target.value), InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonAddAltIcon, { color: "primary" }) })),
                            } }), _jsx(TextField, { label: "Email", variant: "outlined", fullWidth: true, margin: "normal", autoComplete: "email", value: email, onChange: e => setEmail(e.target.value), InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(EmailIcon, { color: "primary" }) })),
                            } }), _jsx(TextField, { label: "Password", type: "password", variant: "outlined", fullWidth: true, margin: "normal", autoComplete: "new-password", value: password, onChange: e => setPassword(e.target.value), InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockIcon, { color: "primary" }) })),
                            } }), _jsx(TextField, { label: "Confirm Password", type: "password", variant: "outlined", fullWidth: true, margin: "normal", autoComplete: "new-password", value: conf, onChange: e => setConf(e.target.value), InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockIcon, { color: "primary" }) })),
                            } }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", sx: {
                                mt: 3,
                                py: 1.2,
                                fontWeight: 900,
                                fontSize: 17,
                                borderRadius: 3,
                                background: "linear-gradient(90deg,#3b5bdb 70%,#228be6 100%)"
                            }, children: "Sign Up" })] }), _jsx(Divider, { sx: { my: 3, width: "100%" }, children: "Already have an account?" }), _jsx(Button, { onClick: handleBackToLogin, fullWidth: true, startIcon: _jsx(ArrowBackIcon, {}), sx: {
                        fontWeight: 700,
                        color: "primary.main",
                        borderRadius: 2,
                        bgcolor: "#f5f7fa",
                        boxShadow: "none",
                        border: "1.5px solid #e9ecef",
                        "&:hover": { bgcolor: "#edf2ff" }
                    }, children: "Back to Login" })] }) }));
}
