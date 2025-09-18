import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import LandingPage from './components/LandingPage/LandingPage.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import StudentSignUp from './components/StudentSignUp/StudentSignUp.jsx';
import SchoolSignUp from './components/SchoolSignUp/SchoolSignUp.jsx';
import StudentDashboard from './components/StudentDashboard/StudentDashboard.jsx'; // Your new dashboard
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard.jsx'; // Example for another dashboard
import ProtectedRoute from './components/ProtectedRoute.jsx'; // The guard
import QuizPage from './components/QuizPage/QuizPage.jsx';

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup/student" element={<StudentSignUp />} />
      <Route path="/signup/school" element={<SchoolSignUp />} />

      {/* --- Protected Routes --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        {/* You can add more protected routes here, e.g., for the school dashboard */}
        {/* <Route path="/school-dashboard" element={<SchoolDashboard />} /> */}
      </Route>
      <Route path="/student/quiz" element={<QuizPage />} />
    </Routes>
  );
}

export default App;
