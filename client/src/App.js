import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import SubmitIdea from './pages/SubmitIdea';
import ViewIdea from './pages/ViewIdea';
import Home from './pages/Home';
import IdeaList from './pages/IdeaList';
import MyIdeas from './pages/MyIdeas';
import AuthPage from './pages/AuthPage';
import VerifyOtp from './pages/VerifyOtp';

const PrivateRoute = ({ children }) => {

  const isAuthenticated =
    localStorage.getItem('token');

  return isAuthenticated
    ? children
    : <Navigate to="/" replace />;
};

function App() {

  return (

    <Router>

      <Routes>

        {/* AUTH */}

        <Route
          path="/"
          element={<AuthPage />}
        />

        {/* OTP */}

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        {/* HOME */}

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* SUBMIT IDEA */}

        <Route
          path="/submit"
          element={
            <PrivateRoute>
              <SubmitIdea />
            </PrivateRoute>
          }
        />

        {/* SHOW INTEREST */}

        <Route
          path="/interest"
          element={
            <PrivateRoute>
              <IdeaList />
            </PrivateRoute>
          }
        />

        {/* MY IDEAS */}

        <Route
          path="/my-ideas"
          element={
            <PrivateRoute>
              <MyIdeas />
            </PrivateRoute>
          }
        />

        {/* VIEW IDEA */}

        <Route
          path="/ideas/:id"
          element={
            <PrivateRoute>
              <ViewIdea />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </Router>

  );
}

export default App;