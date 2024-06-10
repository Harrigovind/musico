import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';
import SearchPage from './components/SearchPage/searchPage';
import Callback from './components/Callback/Callback';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { PlayerProvider } from './contexts/PlayerContext';
import Player from './components/Player/Player';


function App() {

  return (
    <Router>
      <div className="app">
        
        <ErrorBoundary>
          <PlayerProvider>
            <Player/>
              <Routes>

                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/callback" element={<Callback/>} />


              </Routes>
          </PlayerProvider>   
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
