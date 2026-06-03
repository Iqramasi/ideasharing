import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {

  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {

      try {

        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

      } catch (e) {

        console.error(
          "Failed to parse user data",
          e
        );

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        navigate('/');

      }

    } else {

      navigate('/');

    }

  }, [navigate]);

  const toggleDropdown = () => {

    setDropdownOpen(
      !dropdownOpen
    );

  };

  const handleNavigation = (path) => {

    navigate(path);

    setDropdownOpen(false);

  };

  const goToForm = () => {

    navigate('/submit');

  };

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');

    navigate('/');

  };

  if (!user) {

    return (
      <div className="home-loading">
        Loading...
      </div>
    );

  }

  return (

    <div className="home-container">

      {/* MENU */}

      <div className="dropdown-menu-container">

        <div
          className="hamburger-icon"
          onClick={toggleDropdown}
        >

          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>

        </div>

        {dropdownOpen && (

          <div className="dropdown-content">

            <button
              onClick={() =>
                handleNavigation('/interest')
              }
            >
              Show Interest
            </button>

            <button
              onClick={() =>
                handleNavigation('/my-ideas')
              }
            >
              My Ideas
            </button>

            <button
              onClick={() =>
                handleNavigation('/submit')
              }
            >
              Submit Idea
            </button>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>

          </div>

        )}

      </div>

      {/* MAIN */}

      <div className="content">

        <h1 className="home-title">
          Share Your Idea
        </h1>

        <p className="welcome-message">
          Welcome, {user.name}!
        </p>

        <button
          className="home-button"
          onClick={goToForm}
        >
          Submit Your Idea
        </button>

      </div>

      {/* FOOTER CHARACTERS */}

      <footer className="bear-footer">

        <img
          src="/bears/bear6.png"
          alt="bear6"
          className="bear-img"
        />

        <img
          src="/bears/bear7.png"
          alt="bear7"
          className="bear-img"
        />

        <img
          src="/bears/bear8.png"
          alt="bear8"
          className="bear-img"
        />

        <img
          src="/bears/bear9.png"
          alt="bear9"
          className="bear-img"
        />

        <img
          src="/bears/bear10.png"
          alt="bear10"
          className="bear-img"
        />

        <img
          src="/bears/bear11.png"
          alt="bear11"
          className="bear-img"
        />

        <img
          src="/bears/bear12.png"
          alt="bear12"
          className="bear-img"
        />

      </footer>

    </div>

  );
};

export default Home;