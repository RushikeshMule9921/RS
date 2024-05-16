import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './home'; // Renamed home to Home
import Login from './login'; // Renamed login to Login
import Upload from './Uploader'
import Recommendations from './Recommendations'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/Uploader" element={<Upload/>}/>
        <Route path="/recommendations" element={<Recommendations jobRecommendations={getJobRecommendationsFromQueryParams()} />} />
      </Routes>
    </BrowserRouter>
  );
}
const getJobRecommendationsFromQueryParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const data = queryParams.get('data');

  if (data) {
    const jobRecommendations = JSON.parse(decodeURIComponent(data));
    return jobRecommendations;
  }

  return [];
};

export default App;
