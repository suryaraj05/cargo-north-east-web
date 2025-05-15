import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import routes from "routes.js";

const Auth = () => {
  const location = useLocation();

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#172b4d',
      flexDirection: 'column',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {/* Branding/logo */}
        <div style={{ fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: 2, marginBottom: 8 }}>
          CARGO NORTH EAST
        </div>
        {/* Welcome message */}
        <div style={{ color: '#bfc8e2', fontSize: 18 }}>
          Welcome! Please sign in or create an account to continue.
        </div>
      </div>
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/admin/minimal-signin" replace />} />
      </Routes>
    </div>
  );
};

export default Auth;
