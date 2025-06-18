import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Box, Button, Typography, Paper, Avatar, Divider, } from "@mui/material";
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
    return (_jsx(Box, { sx: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "linear-gradient(120deg,#f5f7fa 80%,#e9ecef 100%)"
        }, children: _jsxs(Paper, { elevation: 6, sx: {
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
            }, children: [_jsx(Avatar, { sx: {
                        bgcolor: "primary.main",
                        width: 64,
                        height: 64,
                        mb: 2,
                        boxShadow: "0 4px 14px 0 rgba(54,79,219,0.10)"
                    }, children: _jsx(PersonOutlineIcon, { sx: { fontSize: 38 } }) }), _jsx(Typography, { variant: "h5", fontWeight: 900, mb: 1, letterSpacing: "-0.04em", color: "primary.main", children: "Continue as Guest" }), _jsxs(Typography, { color: "text.secondary", fontWeight: 600, mb: 3, sx: { textAlign: "center" }, children: ["Browse WealthAegis as a guest.", _jsx("br", {}), _jsx("span", { style: { color: "#888", fontWeight: 400 }, children: "Some features may be restricted." })] }), _jsx(Button, { variant: "contained", fullWidth: true, size: "large", sx: {
                        fontWeight: 900,
                        fontSize: 17,
                        borderRadius: 3,
                        py: 1.2,
                        background: "linear-gradient(90deg,#3b5bdb 70%,#228be6 100%)"
                    }, startIcon: _jsx(PersonOutlineIcon, {}), onClick: handleGuest, children: "Continue as Guest" }), _jsx(Divider, { sx: { my: 3, width: "100%" }, children: "Already have an account?" }), _jsx(Button, { onClick: () => navigate("/login"), fullWidth: true, startIcon: _jsx(LoginIcon, {}), sx: {
                        fontWeight: 700,
                        color: "primary.main",
                        borderRadius: 2,
                        bgcolor: "#f5f7fa",
                        boxShadow: "none",
                        border: "1.5px solid #e9ecef",
                        "&:hover": { bgcolor: "#edf2ff" }
                    }, children: "Back to Login" })] }) }));
}
