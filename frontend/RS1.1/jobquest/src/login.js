import React from 'react';

class login extends React.Component {
  render() {
    return (
      <div className="login-container">
        <div className="login-form">
          <input type="text" placeholder="Enter your username or email" />
        </div>
        <div className="login-button">
          <button>Login via Google Account</button>
        </div>
      </div>
    );
  }
}

export default login;
