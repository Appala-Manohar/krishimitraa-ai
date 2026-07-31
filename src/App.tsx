import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { type ReactNode } from "react";

import Auth from "./routes/auth";
import Dashboard from "./routes/_authenticated/dashboard";
import Chat from "./routes/_authenticated/chat";
import DiseaseDetection from "./routes/_authenticated/disease-detection";
import FertilizerCalc from "./routes/_authenticated/fertilizer-calc";
import MarketPrices from "./routes/_authenticated/market-prices";
import Schemes from "./routes/_authenticated/schemes";

// Protected Route Guard checking localStorage farmer session
function ProtectedRoute({ children }: { children: ReactNode }) {
  const loggedUser = localStorage.getItem("krishimitra_logged_user");
  if (!loggedUser) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disease-detection"
          element={
            <ProtectedRoute>
              <DiseaseDetection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fertilizer-calc"
          element={
            <ProtectedRoute>
              <FertilizerCalc />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market-prices"
          element={
            <ProtectedRoute>
              <MarketPrices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schemes"
          element={
            <ProtectedRoute>
              <Schemes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}