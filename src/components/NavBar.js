import { jsx as _jsx } from "react/jsx-runtime";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
const navItems = [
    { label: "Holdings", path: "/holdings" },
    { label: "Resources", path: "/resources" },
    { label: "Will", path: "/will" }
];
export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    return (_jsx(AppBar, { position: "static", color: "default", elevation: 2, sx: { mb: 4 }, children: _jsx(Toolbar, { children: _jsx(Box, { sx: { flexGrow: 1 }, children: navItems.map(item => (_jsx(Button, { onClick: () => navigate(item.path), sx: {
                        fontWeight: 700,
                        mr: 2,
                        color: location.pathname === item.path
                            ? "#63C5DA" // Selected tab color
                            : "#f5f7fa", // Unselected tab color
                        backgroundColor: location.pathname === item.path
                            ? "rgba(99, 197, 218, 0.12)"
                            : "transparent",
                        borderRadius: 2,
                        transition: "background 0.2s",
                        "&:hover": {
                            backgroundColor: "rgba(99, 197, 218, 0.18)",
                            color: "#63C5DA"
                        }
                    }, children: item.label }, item.path))) }) }) }));
}
