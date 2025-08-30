import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
// Import other pages as you create them
// import Dashboard from './pages/Dashboard';
// import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Add more routes as you build them */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/upload" element={<Upload />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
