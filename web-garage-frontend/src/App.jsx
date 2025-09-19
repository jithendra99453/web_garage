import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import ProfilePage from './components/Profile/Profile.jsx'; // 1. Import the new Profile component
import LandingPage from './components/LandingPage/LandingPage.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import StudentSignUp from './components/StudentSignUp/StudentSignUp.jsx';
import SchoolSignUp from './components/SchoolSignUp/SchoolSignUp.jsx';
import StudentDashboard from './components/StudentDashboard/StudentDashboard.jsx'; // Your new dashboard
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard.jsx'; // Example for another dashboard
import ProtectedRoute from './components/ProtectedRoute.jsx'; // The guard
import QuizPage from './components/QuizPage/QuizPage.jsx';
import EcoPuzzle from './components/EcoPuzzle/EcoPuzzle.jsx';
import EcoMemoryGame from './components/EcoMemoryGame/EcoMemoryGame.jsx';
import EcoTrivia from './components/EcoTrivia/EcoTrivia.jsx';
import EcoWordSearch from './components/EcoWordSearch/EcoWordSearch.jsx';
import EcoMatchingGame from './components/EcoMatchingGame/EcoMatchingGame.jsx';
import EcoSortingGame from './components/EcoSortingGame/EcoSortingGame.jsx';
import EcoBingo from './components/EcoBingo/EcoBingo.jsx';
import CarbonFootprintCalculator from './components/CarbonFootprintCalculator/CarbonFootprintCalculator.jsx';
import EcoRecycleSort from './components/EcoRecycleSort/EcoRecycleSort.jsx';
import EcoWaterSaver from './components/EcoWaterSaver/EcoWaterSaver.jsx';
import EcoEnergyQuiz from './components/EcoEnergyQuiz/EcoEnergyQuiz.jsx';
import EcoWildlifeMatch from './components/EcoWildlifeMatch/EcoWildlifeMatch.jsx';
import EcoClimateChallenge from './components/EcoClimateChallenge/EcoClimateChallenge.jsx';
import EcoGardenPlanner from './components/EcoGardenPlanner/EcoGardenPlanner.jsx';
import EcoWasteAudit from './components/EcoWasteAudit/EcoWasteAudit.jsx';
import EcoSustainabilityTrivia from './components/EcoSustainabilityTrivia/EcoSustainabilityTrivia.jsx';
import EcoFoodWasteGame from './components/EcoFoodWasteGame/EcoFoodWasteGame.jsx';
import EcoPollutionPuzzle from './components/EcoPollutionPuzzle/EcoPollutionPuzzle.jsx';
import EcoSolarSimulator from './components/EcoSolarSimulator/EcoSolarSimulator.jsx';
import EcoBikeRace from './components/EcoBikeRace/EcoBikeRace.jsx';
import EcoOceanCleanup from './components/EcoOceanCleanup/EcoOceanCleanup.jsx';
import EcoGreenBuilding from './components/EcoGreenBuilding/EcoGreenBuilding.jsx';
import EcoRenewableEnergy from './components/EcoRenewableEnergy/EcoRenewableEnergy.jsx';
import EcoBiodiversityQuiz from './components/EcoBiodiversityQuiz/EcoBiodiversityQuiz.jsx';
import EcoEcoFriendlyShopping from './components/EcoEcoFriendlyShopping/EcoEcoFriendlyShopping.jsx';
import EcoSustainableLiving from './components/EcoSustainableLiving/EcoSustainableLiving.jsx';

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/student/quiz" element={<QuizPage />} />
        <Route path="/student/puzzle" element={<EcoPuzzle />} />
        <Route path="/student/memory" element={<EcoMemoryGame />} />
        <Route path="/student/trivia" element={<EcoTrivia />} />
        <Route path="/student/wordsearch" element={<EcoWordSearch />} />
        <Route path="/student/matching" element={<EcoMatchingGame />} />
        <Route path="/student/sorting" element={<EcoSortingGame />} />
        <Route path="/student/bingo" element={<EcoBingo />} />
        <Route path="/student/carbon" element={<CarbonFootprintCalculator />} />
        <Route path="/student/recycle" element={<EcoRecycleSort />} />
        <Route path="/student/water" element={<EcoWaterSaver />} />
        <Route path="/student/energy" element={<EcoEnergyQuiz />} />
        <Route path="/student/wildlife" element={<EcoWildlifeMatch />} />
        <Route path="/student/climate" element={<EcoClimateChallenge />} />
        <Route path="/student/garden" element={<EcoGardenPlanner />} />
        <Route path="/student/waste" element={<EcoWasteAudit />} />
        <Route path="/student/sustainability" element={<EcoSustainabilityTrivia />} />
        <Route path="/student/foodwaste" element={<EcoFoodWasteGame />} />
        <Route path="/student/pollution" element={<EcoPollutionPuzzle />} />
        <Route path="/student/solar" element={<EcoSolarSimulator />} />
        <Route path="/student/bikerace" element={<EcoBikeRace />} />
        <Route path="/student/oceancleanup" element={<EcoOceanCleanup />} />
        <Route path="/student/greenbuilding" element={<EcoGreenBuilding />} />
        <Route path="/student/renewableenergy" element={<EcoRenewableEnergy />} />
        <Route path="/student/biodiversityquiz" element={<EcoBiodiversityQuiz />} />
        <Route path="/student/ecoshopping" element={<EcoEcoFriendlyShopping />} />
        <Route path="/student/sustainableliving" element={<EcoSustainableLiving />} />
        {/* You can add more protected routes here, e.g., for the school dashboard */} 
        {/* <Route path="/school-dashboard" element={<SchoolDashboard />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
