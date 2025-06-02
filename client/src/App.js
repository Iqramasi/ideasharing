

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import SubmitIdea from './pages/SubmitIdea';
import ViewIdea from './pages/ViewIdea';
import Home from "./pages/Home"; // This is your HomePage.js
import IdeaList from './pages/IdeaList';
import AuthPage from './pages/AuthPage'; // Import the AuthPage

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check for token
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* AuthPage is the default route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Routes - only accessible if logged in */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <PrivateRoute>
              <SubmitIdea />
            </PrivateRoute>
          }
        />
        <Route
          path="/interest"
          element={
            <PrivateRoute>
              <IdeaList />
            </PrivateRoute>
          }
        />
        <Route
          path="/ideas/:id"
          element={
            <PrivateRoute>
              <ViewIdea />
            </PrivateRoute>
          }
        />

        {/* Fallback for any unmatched routes - redirects to AuthPage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;