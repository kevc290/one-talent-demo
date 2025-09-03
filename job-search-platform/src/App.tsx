import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { JobSearch } from './pages/JobSearch';
import { JobDetail } from './pages/JobDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/companies" element={
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-500">Companies page coming soon...</p>
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-500">About page coming soon...</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;