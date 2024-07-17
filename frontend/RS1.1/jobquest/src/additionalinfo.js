import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdditionalInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setName(userInfo.name);
        setEmail(userInfo.email);
        setPhoneNumber(userInfo.phoneNumber);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/additional-info',
        { cgpa, branch, semester },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.msg);
      navigate('/Uploader');
    } catch (error) {
      setMessage('Error submitting additional information: ' + (error.response ? error.response.data.msg : 'Unknown error'));
    }
  };

  return (
    <div>
      <h1>Additional Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          CGPA:
          <input
            type="number"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            required
          />
        </label>
        <label>
          Branch:
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          />
        </label>
        <label>
          Semester:
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdditionalInfo;