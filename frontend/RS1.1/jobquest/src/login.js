import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './login.css';
import { auth, googleProvider } from './firebase';
import axios from 'axios';

class Login extends Component {
  handleGoogleSignIn = () => {
    auth.signInWithPopup(googleProvider)
      .then(async (result) => {
        // User is signed in
        const user = result.user;
        // Send the user's ID token to your Flask backend
        await this.sendUserDataToBackend(user);
      })
      .catch((error) => {
        // Handle sign-in error
        console.error(error);
      });
  };

  sendUserDataToBackend = async (user) => {
    try {
      const idToken = await user.getIdToken();
      const response = await axios.post('http://127.0.0.1:5000/signin', { idToken });
      if (response.status === 200) {
        // Redirect to the upload page
        window.location.href = '/Uploader';
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="login-container">
          <div className="login-message">
            <h1>Just one click away!</h1>
            <p>By logging in with your Gmail account, you're taking the first step towards personalized job recommendations tailored to your skills and experience. Let's find your dream job together!</p>

            <div className="login-button">
              <button onClick={this.handleGoogleSignIn}>Login via Google Account</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;