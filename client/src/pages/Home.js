

import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom";
import './Home.css'; // Assuming you have existing Home.css

const Home = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [user, setUser] = useState(null); // State to store user data

  // Load user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem('user'); // Clear corrupted data
        localStorage.removeItem('token'); // Clear corrupted token
        navigate('/'); // Redirect to login
      }
    } else {
        // If no user data, navigate to login page
        navigate('/');
    }
  }, [navigate]);

  const goToForm = () => {
    navigate("/submit");
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to handle navigation from dropdown
  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false); // Close dropdown after navigation
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user');  // Remove user data
    setUser(null); // Clear user state
    navigate('/'); // Redirect to AuthPage (login/signup)
  };

  if (!user) {
    // Optionally render a loading state or nothing while redirecting
    return <div className="home-loading">Redirecting to login...</div>;
  }

  return (
    <div className="home-container">
      {/* Dropdown Menu - Added Here */}
      <div className="dropdown-menu-container">
        <div className="hamburger-icon" onClick={toggleDropdown}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        {dropdownOpen && (
          <div className="dropdown-content">
            <button onClick={() => handleNavigation("/interest")}>Show Interest</button>
            <button onClick={() => handleNavigation("/submit")}>Submit Idea</button>
            {/* <button onClick={() => handleNavigation("/contact")}>Contact Us</button> */}
            <button onClick={handleLogout} className="logout-button">Logout</button> {/* Added Logout Button */}
          </div>
        )}
      </div>
      {/* End Dropdown Menu */}

      <div className="content">
        <h1 className="home-title">Share Your Idea</h1>
        {/* Display user name */}
        {user && <p className="welcome-message">Welcome, {user.name}!</p>}
        <button className="home-button" onClick={goToForm}>Submit Your Idea</button>
      </div>

      <footer className="bear-footer">
        <img src="/bears/bear6.png" alt="bear11" className="bear-img" />
        <img src="/bears/bear7.png" alt="bear12" className="bear-img" />
        <img src="/bears/bear8.png" alt="bear9" className="bear-img" />
        <img src="/bears/bear9.png" alt="bear7" className="bear-img" />
        <img src="/bears/bear10.png" alt="bear8" className="bear-img" />
        <img src="/bears/bear11.png" alt="bear6" className="bear-img" />
        <img src="/bears/bear12.png" alt="bear10" className="bear-img" />
        <img src="/bears/bear11.png" alt="bear9" className="bear-img" />
      </footer>
    </div>
  );
};

export default Home;