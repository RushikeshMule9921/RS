import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './login.css';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    isRegistering: false
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleRegistering = () => {
    this.setState({ isRegistering: !this.state.isRegistering });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, phoneNumber } = this.state;
    console.log('Attempting registration with:', { name, email, password: '********', phoneNumber });
    try {
      const response = await axios.post('http://localhost:5000/register', { name, email, password, phoneNumber });
      console.log('Registration response:', response);
      if (response.status === 201) {
        console.log('Registration successful');
        alert('Registration successful');
        this.setState({ isRegistering: false });
      } else {
        console.log('Registration failed with status:', response.status);
        alert('Registration failed: ' + (response.data.msg || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      alert('Registration failed: ' + (error.response ? error.response.data.msg : 'Unknown error'));
    }
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    //console.log('Attempting login with:', { email, password: '********' });
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      console.log('Login response:', response);
      if (response.status === 200) {
        console.log('Login successful');
        localStorage.setItem('token', response.data.token);
        window.location.href = '/Uploader';
      } else {
        console.log('Login failed with status:', response.status);
        alert('Login failed: ' + (response.data.msg || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Login failed: ' + (error.response ? error.response.data.msg : 'Unknown error'));
    }
  };

  render() {
    const { email, password, name, phoneNumber, isRegistering } = this.state;

    return (
      <div>
        <Navbar />
        <div className="login-container">
          <div className="login-message">
            <h1>{isRegistering ? 'Register' : 'Login'} to Your Account</h1>
            <p>{isRegistering ? 'Create a new account' : 'Log in to your account'}</p>

            <form onSubmit={isRegistering ? this.handleRegister : this.handleLogin}>
              {isRegistering && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={this.handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={this.handleChange}
                    required
                  />
                </>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                required
              />
              <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>

            <div className="toggle-auth">
              <button onClick={this.toggleRegistering}>
                {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;