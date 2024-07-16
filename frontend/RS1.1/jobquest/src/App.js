import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './home';
import Login from './login';
import Upload from './Uploader';
import Recommendations from './Recommendations';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import './App.css';

const getJobRecommendationsFromQueryParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const data = queryParams.get('data');

  if (data) {
    const jobRecommendations = JSON.parse(decodeURIComponent(data));
    return jobRecommendations;
  }

  return [];
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/Uploader" 
          element={<ProtectedRoute element={<Upload />} />}
        />
        <Route 
          path="/recommendations" 
          element={
            <ProtectedRoute 
              element={<Recommendations jobRecommendations={getJobRecommendationsFromQueryParams()} />} 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
