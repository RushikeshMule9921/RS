import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './home'; // Renamed home to Home
import Login from './login'; // Renamed login to Login
import Upload from './Uploadpage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/Uploadpage" element={<Upload/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
