// import React from 'react';
// import Navbar from './navbar';
// import Footer from './footer';
//
// const Recommendations = ({ jobRecommendations }) => {
//   return (
//     <div>
//       <Navbar />
//       {1 > 0 ? (
//         <div className="job-recommendations">
//           <h2>Job Recommendations</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Job Title</th>
//               </tr>
//             </thead>
//             <tbody>
//               {jobRecommendations.map((job, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{job}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div>No job recommendations available.</div>
//       )}
//       <Footer />
//     </div>
//   );
// };
//
// export default Recommendations;
// Recommendations.js
import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { useSearchParams } from 'react-router-dom';
import './Recommendations.css';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobRecommendations = JSON.parse(decodeURIComponent(searchParams.get('data') || '[]'));

  // Add LinkedIn URLs to each job recommendation
  const jobRecommendationsWithLinks = jobRecommendations.map((job, index) => ({
    title: job,
    url: `https://www.linkedin.com/jobs/view/${index + 1000000}` // Example LinkedIn job links
  }));

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      window.location.href = '/'; // Redirect to the home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const reloadResume = () => {
    navigate('/Uploader'); // Redirect to the uploader page
  };

  return (
    <div>
      <Navbar />
      <div className="recommendation-container">
        {jobRecommendationsWithLinks.length > 0 ? (
          <div className="recommendation-message">
            <p>
              Congratulations based on your resume the following jobs are suitable.These are ranked based on your skillset.
            </p>
            <div className="job-recommendations">
              <h2>Job Recommendations</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {jobRecommendationsWithLinks.map((job, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{job.title}</td>
                      <td>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">View Job</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="reload">
              <button onClick={handleSignOut}>Sign Out</button>
              <button onClick={reloadResume}>Reload Resume</button>
            </div>
          </div>
        ) : (
          <div>No job recommendations available.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;

