import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import './AdminPage.css';

class AdminPage extends Component {
  state = {
    students: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);  // Debugging statement
      const response = await axios.get('http://localhost:5000/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Response data:', response.data);  // Debugging statement
      this.setState({ students: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching students:', error);
      this.setState({ error: 'Failed to fetch student data', loading: false });
    }
  };

  render() {
    const { students, loading, error } = this.state;

    return (
      <div>
        <Navbar />
        <div className="admin-page-container">
          <h1>Admin Dashboard</h1>
          {loading ? (
            <p>Loading student data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="student-list">
              <h2>Student List</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>CGPA</th>
                    <th>Branch</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.rollNumber}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber}</td>
                      <td>{student.cgpa || 'N/A'}</td>
                      <td>{student.branch || 'N/A'}</td>
                      <td>{student.semester || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default AdminPage;
