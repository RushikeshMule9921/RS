// import React, { useState } from 'react';
// import Navbar from './navbar';
// import Footer from './footer';
// import './Uploader.css';
// import { useNavigate } from 'react-router-dom';
// import { auth } from './firebase'; // Import your Firebase authentication module
// import axios from 'axios';
//
// const Uploader = () => {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//
//   const onFileChange = (event) => {
//     setResumeFile(event.target.files[0]);
//   };
//   const sendResumeToBackend = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('resume', resumeFile);
//
//       const response = await axios.post('http://127.0.0.1:5000/api/process-resume', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//
//       setMessage(response.data.message);
//       // setJobRecommendations(response.data.jobRecommendations);
//       navigate(`/recommendations?data=${encodeURIComponent(JSON.stringify(response.data.jobRecommendations))}`);
//     } catch (error) {
//       console.error('Error sending resume to backend:', error);
//     }
//   };
//   const handleSignOut = async () => {
//     try {
//       await auth.signOut(); // Sign out the user
//       // Redirect to the home page after sign out
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };
//
//   return (
//     <div>
//       <Navbar />
//       <div className="resume-container">
//         <div className="resume-message">
//           <h1>Upload your Resume!</h1>
//           <p>
//             Ready to showcase your skills and experience? Upload your resume now to unlock personalized job recommendations tailored just for you. Let's take the next step towards finding your dream job together
//           </p>
//           <div className="Upload">
//             <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} />
//             <button onClick={sendResumeToBackend}>Upload</button>
//             <button onClick={handleSignOut}>Sign Out</button> {/* Add the sign-out button */}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };
//
// export default Uploader;
// Uploader.js
import React, { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './Uploader.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import your Firebase authentication module
import axios from 'axios';

const Uploader = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const sendResumeToBackend = async () => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);

    const response = await axios.post('http://127.0.0.1:5000/api/process-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setMessage(response.data.message);

    if (response.data.jobRecommendations !== undefined) {
      navigate(`/recommendations?data=${encodeURIComponent(JSON.stringify(response.data.jobRecommendations))}`);
    } else {
      // Handle case where job recommendations are undefined
      console.log('No job recommendations available');
    }
  } catch (error) {
    console.error('Error sending resume to backend:', error);
  }
};

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      window.location.href = '/'; // Redirect to the home page after sign out
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
            <button onClick={sendResumeToBackend}>Upload</button>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Uploader;