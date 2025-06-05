// DESTINATION: vite-project/src/App.jsx
// REPLACE YOUR EXISTING App.jsx WITH THIS

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import TierSelection from './pages/TierSelection';
import StorageSelection from './pages/StorageSelection';
import DataUpload from './pages/DataSelection';
import VendorMap from './pages/VendorMap';
import DigitalTwin from './pages/DigitalTwin';
import ClassificationAgent from './pages/ClassificationAgent';
import AskImageQuestion from './pages/AskImageQuestion';
import ProcessingSteps from './pages/ProcessingSteps';
import './index.css';
import './App.css';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import WellMap from './pages/WellMap';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CloudSiloSetup from './pages/CloudSiloSetup';
import WorkflowStepper from './components/WorkflowStepper';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <WorkflowStepper />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tiers" element={<TierSelection />} />
            <Route path="/storage" element={<StorageSelection />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/vendor" element={<VendorMap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/well-map" element={<WellMap />} />
            <Route path="/processing-steps" element={<ProcessingSteps />} />
            <Route path="/classification-agent" element={<ClassificationAgent />} />
            <Route path="/ask-image" element={<AskImageQuestion />} />  {/* ✅ new route */}
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cloud-setup" element={<CloudSiloSetup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;