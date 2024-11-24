import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { ConfirmationProvider } from './Context/ConfirmationContext';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <ConfirmationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </ConfirmationProvider>
      </div>
    </Router>
  );
};

export default App;
