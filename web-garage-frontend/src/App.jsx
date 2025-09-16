import { useState } from 'react'
import './index.css'
import LandingPage from './components/LandingPage/LandingPage.jsx'
import StudentSignUp from './components/StudentSignUp/StudentSignUp.jsx'; // Import the new student component
import SchoolSignUp from './components/SchoolSignUp/SchoolSignUp.jsx';   // Import the new school/teacher component
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
     <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* NEW, SEPARATE ROUTES */}
      <Route path="/student-signup" element={<StudentSignUp />} />
      <Route path="/school-signup" element={<SchoolSignUp />} />

      {/* Your other routes */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  )
}

export default App
