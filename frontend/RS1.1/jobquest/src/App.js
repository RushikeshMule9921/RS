import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './home';
import Login from './login';
import Upload from './Uploader';
import Recommendations from './Recommendations';
import AdditionalInfo from './additionalinfo'; // Import AdditionalInfo component
import AdminPage from './AdminPage'; // Import AdminPage component
import ProtectedRoute from './ProtectedRoute';
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
          path="/additional-info" 
          element={<ProtectedRoute element={<AdditionalInfo />} />}
        />
        <Route 
          path="/Uploader" 
          element={<ProtectedRoute element={<Upload />} allowedRoles={['user', 'admin']} />}
        />
        <Route 
          path="/recommendations" 
          element={
            <ProtectedRoute 
              element={<Recommendations jobRecommendations={getJobRecommendationsFromQueryParams()} />} 
              allowedRoles={['user', 'admin']} 
            />
          } 
        />
        <Route 
          path="/adminpage" 
          element={<ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
