import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const Recommendations = ({ jobRecommendations }) => {
  return (
    <div>
      <Navbar />
      {jobRecommendations.length > 0 ? (
        <div className="job-recommendations">
          <h2>Job Recommendations</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Job Title</th>
              </tr>
            </thead>
            <tbody>
              {jobRecommendations.map((job, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No job recommendations available.</div>
      )}
      <Footer />
    </div>
  );
};

export default Recommendations;