import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './login.css'
class login extends React.Component {
  render() {
    return (
     <div>
     <Navbar/>
      <div className="login-container">
      <div className="login-message">
        <h1>Just one click away!</h1>
        <p>By logging in with your Gmail account, you're taking the first step towards personalized job recommendations tailored to your skills and experience. Let's find your dream job together!</p>

        <div className="login-button">
          <button>Login via Google Account</button>
        </div>
      </div>
      </div>
      <Footer/>
      </div>
    );
  }
}

export default login;
