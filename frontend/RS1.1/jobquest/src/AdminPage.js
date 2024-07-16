// src/components/AdminPage.js
import React, { Component } from 'react';
import Navbar from './navbar'; // Ensure this matches the exact file name and case
import Footer from './footer'; // Ensure this matches the exact file name and case
//import './AdminPage.css'; // Optional: add styling specific to AdminPage

class AdminPage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="admin-page-container">
          <h1>Admin Dashboard</h1>
          <p>Welcome to the Admin Dashboard. Here you can manage users, view reports, and perform administrative tasks.</p>
          {/* Add more admin-specific content here */}
        </div>
        <Footer />
      </div>
    );
  }
}

export default AdminPage;
