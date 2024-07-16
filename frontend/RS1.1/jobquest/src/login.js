import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './login.css';
import axios from 'axios';

class Login extends Component {
  state = {
    userId: '',
    email: '',
    password: '',
    role: 'user',
    isRegistering: false,
    name: '',
    phoneNumber: '',
    errorMessage: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleRegistering = () => {
    this.setState({ isRegistering: !this.state.isRegistering });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, phoneNumber, role } = this.state;
    try {
      const response = await axios.post('http://localhost:5000/register', { name, email, password, phoneNumber, role });
      if (response.status === 201) {
        const { token, user } = response.data; // Get user object from response
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({
          userId: user.id, // Store userId
          name: user.name,
          email: user.email,
          phoneNumber,
          role: user.role
        }));
        window.location.href = '/additional-info';
      } else {
        this.setState({ errorMessage: 'Registration failed: ' + (response.data.msg || 'Unknown error') });
      }
    } catch (error) {
      this.setState({ errorMessage: 'Registration failed: ' + (error.response ? error.response.data.msg : 'Unknown error') });
    }
  };
  

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = this.state;
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password, role });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        
        if (role === 'admin') {
          window.location.href = '/adminpage';
        } else {
          window.location.href = '/Uploader';
        }
      } else {
        this.setState({ errorMessage: 'Login failed: ' + (response.data.msg || 'Unknown error') });
      }
    } catch (error) {
      this.setState({ errorMessage: 'Login failed: ' + (error.response ? error.response.data.msg : 'Unknown error') });
    }
  };

  render() {
    const { email, password, role, name, phoneNumber, isRegistering, errorMessage } = this.state;

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
              {!isRegistering && (
                <select name="role" value={role} onChange={this.handleChange} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>

            <div className="toggle-auth">
              <button onClick={this.toggleRegistering}>
                {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
              </button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;