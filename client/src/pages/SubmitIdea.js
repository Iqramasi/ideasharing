
// // src/pages/SubmitIdea.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { QRCodeCanvas } from 'qrcode.react'; // Correctly imported
// import './SubmitIdea.css'; // Import the new CSS file

// function SubmitIdea() {
//   const [form, setForm] = useState({ title: '', description: '', submittedBy: '' });
//   const [ideaId, setIdeaId] = useState(''); // Stores the ID of the newly submitted idea
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null); // To display success message

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null); // Clear previous messages
//     setIdeaId(''); // Clear previous idea ID and QR code

//     try {
//       const res = await axios.post('http://localhost:5000/api/ideas/submit', form);
      
//       // Backend should return { ideaId: newIdea._id, message: '...' }
//       setIdeaId(res.data.ideaId); // Set the ID received from the backend
//       setSuccessMessage(res.data.message || 'Idea submitted successfully!');

//       // Optionally clear the form after successful submission
//       setForm({ title: '', description: '', submittedBy: '' });

//     } catch (err) {
//       console.error("Error submitting idea:", err.response?.data?.message || err.message);
//       setError(err.response?.data?.message || "Failed to submit idea. Please try again.");
//       setIdeaId(''); // Ensure QR is not shown on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Construct the URL for the QR code based on the frontend route
//   const qrCodeValue = ideaId ? `http://localhost:3000/ideas/${ideaId}` : ''; // Corrected plural "ideas"

//   return (
//     <div className="submit-idea-container">
//       {/* Character remains on the very right corner */}
//       <div className="pixel-character"></div>

//       <div className="submit-content-wrapper">
//         <div className="nameplate-header">
//           <h2>SUBMIT YOUR IDEA</h2>
//         </div>

//         <div className="main-content-box">
//           <h3 className="box-title">IDEA DETAILS</h3>

//           <div className="form-field-group">
//             <input
//               name="title"
//               placeholder="Title"
//               onChange={handleChange}
//               value={form.title}
//               disabled={loading}
//               required // Added HTML5 required attribute
//             />
//           </div>
//           <div className="form-field-group">
//             <textarea
//               name="description"
//               placeholder="Description"
//               onChange={handleChange}
//               value={form.description}
//               disabled={loading}
//               rows="4"
//               required // Added HTML5 required attribute
//             ></textarea>
//           </div>
//           <div className="form-field-group">
//             <input
//               name="submittedBy"
//               placeholder="Your Name"
//               onChange={handleChange}
//               value={form.submittedBy}
//               disabled={loading}
//               required // Added HTML5 required attribute
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="generate-qr-button"
//             disabled={loading || !form.title || !form.description || !form.submittedBy}
//           >
//             {loading ? 'GENERATING...' : 'GENERATE QR'}
//           </button>

//           {/* Display messages */}
//           {successMessage && <p className="success-message">{successMessage}</p>}
//           {error && <p className="error-message">{error}</p>}

//           {/* QR Code Section - now inside main-content-box, after form fields */}
//           {ideaId && ( // Only show if ideaId is available
//             <div className="qr-code-section">
//               <h3 className="qr-box-title">QR GENERATED, SCAN IT</h3>
//               <QRCodeCanvas
//                 value={qrCodeValue} // Use the derived qrCodeValue
//                 size={180}
//                 level="H"
//               />
//               <p>
//                 Scan this QR code and  click here: {' '}
//                 <a href={qrCodeValue} target="_blank" rel="noopener noreferrer">View Idea</a>
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubmitIdea;



// src/pages/SubmitIdea.js
import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Correctly imported
import './SubmitIdea.css'; // Import the new CSS file

// --- CRITICAL CHANGE: Use environment variables for API and Frontend Base URLs ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Fallback for local dev
const FRONTEND_BASE_URL = process.env.REACT_APP_FRONTEND_BASE_URL || 'http://localhost:3000'; // Fallback for local dev
// --- END CRITICAL CHANGE ---

function SubmitIdea() {
  const [form, setForm] = useState({ title: '', description: '', submittedBy: '' });
  const [ideaId, setIdeaId] = useState(''); // Stores the ID of the newly submitted idea
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // To display success message

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear previous messages
    setIdeaId(''); // Clear previous idea ID and QR code

    try {
      // --- CRITICAL CHANGE: Use API_BASE_URL for the backend call ---
      const res = await axios.post(`${API_BASE_URL}/api/ideas/submit`, form);
      // --- END CRITICAL CHANGE ---

      // Backend should return { ideaId: newIdea._id, message: '...' }
      setIdeaId(res.data.ideaId); // Set the ID received from the backend
      setSuccessMessage(res.data.message || 'Idea submitted successfully!');

      // Optionally clear the form after successful submission
      setForm({ title: '', description: '', submittedBy: '' });

    } catch (err) {
      console.error("Error submitting idea:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to submit idea. Please try again.");
      setIdeaId(''); // Ensure QR is not shown on error
    } finally {
      setLoading(false);
    }
  };

  // --- CRITICAL CHANGE: Construct the QR code URL using FRONTEND_BASE_URL ---
  const qrCodeValue = ideaId ? `${FRONTEND_BASE_URL}/ideas/${ideaId}` : '';
  // --- END CRITICAL CHANGE ---

  return (
    <div className="submit-idea-container">
      {/* Character remains on the very right corner */}
      <div className="pixel-character"></div>

      <div className="submit-content-wrapper">
        <div className="nameplate-header">
          <h2>SUBMIT YOUR IDEA</h2>
        </div>

        <div className="main-content-box">
          <h3 className="box-title">IDEA DETAILS</h3>

          <div className="form-field-group">
            <input
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={form.title}
              disabled={loading}
              required // Added HTML5 required attribute
            />
          </div>
          <div className="form-field-group">
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={form.description}
              disabled={loading}
              rows="4"
              required // Added HTML5 required attribute
            ></textarea>
          </div>
          <div className="form-field-group">
            <input
              name="submittedBy"
              placeholder="Your Name"
              onChange={handleChange}
              value={form.submittedBy}
              disabled={loading}
              required // Added HTML5 required attribute
            />
          </div>

          <button
            onClick={handleSubmit}
            className="generate-qr-button"
            disabled={loading || !form.title || !form.description || !form.submittedBy}
          >
            {loading ? 'GENERATING...' : 'GENERATE QR'}
          </button>

          {/* Display messages */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}

          {/* QR Code Section - now inside main-content-box, after form fields */}
          {ideaId && ( // Only show if ideaId is available
            <div className="qr-code-section">
              <h3 className="qr-box-title">QR GENERATED, SCAN IT</h3>
              <QRCodeCanvas
                value={qrCodeValue} // Use the derived qrCodeValue
                size={180}
                level="H"
              />
              <p>
                Scan this QR code and click here: {' '}
                <a href={qrCodeValue} target="_blank" rel="noopener noreferrer">View Idea</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmitIdea;