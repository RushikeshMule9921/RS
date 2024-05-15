import React, { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './Uploader.css';
import { auth } from './firebase'; // Import your Firebase authentication module

const Uploader = () => {
  const [resumeFile, setResumeFile] = useState(null);

  const onFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      // Redirect to the home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="resume-container">
        <div className="resume-message">
          <h1>Upload your Resume!</h1>
          <p>
            Ready to showcase your skills and experience? Upload your resume now to unlock personalized job recommendations tailored just for you. Let's take the next step towards finding your dream job together
          </p>
          <div className="Upload">
            <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} />
            <button>Upload</button>
            <button onClick={handleSignOut}>Sign Out</button> {/* Add the sign-out button */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Uploader;