// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// import "assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/scss/argon-dashboard-react.scss";

// import AdminLayout from "layouts/Admin.js";
// import AuthLayout from "layouts/Auth.js";
// import UserLayout from "layouts/User";

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/admin/*" element={<AdminLayout />} />
//       <Route path="/auth/*" element={<AuthLayout />} />
//       <Route path="*" element={<Navigate to="/admin/index" replace />} />
//     </Routes>
//   </BrowserRouter>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/ProtectedRoute";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import UserLayout from "layouts/UserLayout.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/*" element={<AuthLayout />} />
        
        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        
        {/* Protected user routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);