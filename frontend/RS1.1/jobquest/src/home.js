import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import the CSS file
import Navbar from './navbar';
import Footer from './footer';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="home-container">
          <div className="welcome-message">
            <h1>Welcome to JobQuest!</h1>
            <p>Welcome to JobQuest! Our advanced ML algorithms match your resume with relevant job openings, streamlining your search for the perfect career opportunity. Discover your next career move with JobQuest!</p>
            <div className="get-started-button">
              <Link to="/login">
                <button>Get Started</button>
              </Link>
            </div>
          </div>
        </div>
        <Footer /> {/* Render the Footer component */}
      </div>
    );
  }
}

export default Home;
