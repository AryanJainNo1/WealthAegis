import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import WealthAegis from "./WealthAegis";
import NavBar from "./components/NavBar";
import HoldingsPage from "./pages/HoldingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import WillPage from "./pages/WillPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GuestPage from "./pages/GuestPage";
import theme from "./theme";
import EstatePlanningBasicsPage from "./pages/EstatePlanningBasicsPage";
import UnderstandingWillsPage from "./pages/UnderstandingWillsPage";
import HowToWriteAWillPage from "./pages/HowToWriteAWillPage";
import EstatePlanning16ThingsPage from "./pages/EstatePlanning16ThingsPage";
function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
}
export default function App() {
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(WealthAegis, { children: [_jsx(NavBar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/holdings", element: _jsx(PrivateRoute, { children: _jsx(HoldingsPage, {}) }) }), _jsx(Route, { path: "/resources", element: _jsx(PrivateRoute, { children: _jsx(ResourcesPage, {}) }) }), _jsx(Route, { path: "/will", element: _jsx(PrivateRoute, { children: _jsx(WillPage, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/guest", element: _jsx(GuestPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login" }) }), _jsx(Route, { path: "/estate-planning-basics", element: _jsx(PrivateRoute, { children: _jsx(EstatePlanningBasicsPage, {}) }) }), _jsx(Route, { path: "/understanding-wills", element: _jsx(PrivateRoute, { children: _jsx(UnderstandingWillsPage, {}) }) }), _jsx(Route, { path: "/how-to-write-a-will", element: _jsx(PrivateRoute, { children: _jsx(HowToWriteAWillPage, {}) }) }), _jsx(Route, { path: "/estate-planning-16-things", element: _jsx(PrivateRoute, { children: _jsx(EstatePlanning16ThingsPage, {}) }) })] })] }) }) })] }));
}
