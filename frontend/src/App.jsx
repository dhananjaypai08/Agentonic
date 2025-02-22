import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Agents from './components/Agents';
import Settings from './components/Settings';
import Query from './components/Query';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Toaster position="top-right" />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Agents />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/query" element={<Query />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;