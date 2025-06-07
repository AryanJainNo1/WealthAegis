import * as React from "react";
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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <WealthAegis>
            <NavBar />
            <Routes>
            <Route path="/holdings" element={<PrivateRoute><HoldingsPage /></PrivateRoute>} />
              <Route path="/resources" element={<PrivateRoute><ResourcesPage /></PrivateRoute>} />
              <Route path="/will" element={<PrivateRoute><WillPage /></PrivateRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/guest" element={<GuestPage />} />
              <Route path="/" element={<Navigate to="/holdings" />} />
              <Route path="/estate-planning-basics" element={<PrivateRoute><EstatePlanningBasicsPage /></PrivateRoute>} />
              <Route path="/understanding-wills" element={<PrivateRoute><UnderstandingWillsPage /></PrivateRoute>} />
              <Route path="/how-to-write-a-will" element={<PrivateRoute><HowToWriteAWillPage /></PrivateRoute>} />
              <Route path="/estate-planning-16-things" element={<PrivateRoute><EstatePlanning16ThingsPage /></PrivateRoute>} />
              </Routes>
          </WealthAegis>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}