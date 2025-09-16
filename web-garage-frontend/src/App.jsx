import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';

// Import your components
import LandingPage from './components/LandingPage/LandingPage.jsx';
import Login from './components/LoginForm/LoginForm.jsx'; // Assuming this is your Login component
import StudentSignUp from './components/StudentSignUp/StudentSignUp.jsx';
import SchoolSignUp from './components/SchoolSignUp/SchoolSignUp.jsx';

function App() {
  return (
    <Routes>
      {/* Route for your main landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Route for the login form */}
      <Route path="/login" element={<Login />} />

      {/* Routes for the sign-up forms that match our components */}
      <Route path="/signup/student" element={<StudentSignUp />} />
      <Route path="/signup/school" element={<SchoolSignUp />} />

    </Routes>
  );
}

export default App;
