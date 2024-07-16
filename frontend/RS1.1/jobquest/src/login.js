import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './login.css';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
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
    try {
      const response = await axios.post('http://localhost:5000/register', { name, email, password, phoneNumber });
      if (response.status === 201) {
        alert('Registration successful');
        this.setState({ isRegistering: false });
      } else {
        alert('Registration failed: ' + (response.data.msg || 'Unknown error'));
      }
    } catch (error) {
      alert('Registration failed: ' + (error.response ? error.response.data.msg : 'Unknown error'));
    }
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/Uploader';
      } else {
        alert('Login failed: ' + (response.data.msg || 'Unknown error'));
      }
    } catch (error) {
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
