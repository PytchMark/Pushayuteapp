
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RosterPage from './pages/RosterPage';
import TalentProfilePage from './pages/TalentProfilePage';
import BookingRequestPage from './pages/BookingRequestPage';
import AdminDashboard from './pages/AdminDashboard';
import TalentDashboard from './pages/TalentDashboard';
import LoginPage from './pages/LoginPage';
import PrivateRosterPage from './pages/PrivateRosterPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/roster" element={<RosterPage />} />
            <Route path="/talent/:slug" element={<TalentProfilePage />} />
            <Route path="/request/:talentId" element={<BookingRequestPage />} />
            <Route path="/r/:rosterSlug" element={<PrivateRosterPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/dashboard/*" element={<TalentDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
