import React, { createContext, useState} from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [track, setTrack] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  return (
    <PlayerContext.Provider value={{ track, setTrack, errorMessage, setErrorMessage, isSignedIn, setIsSignedIn }}>
      {children}
    </PlayerContext.Provider>
  );
};

