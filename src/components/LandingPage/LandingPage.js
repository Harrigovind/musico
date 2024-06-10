import React from 'react';
import styles from './LandingPage.module.css';
import logo from '../../images/MusiCo.png';
import {getAuthUrl} from '../../services/spotify.js';


function LandingPage() {
  const handleLogin = () =>{
    const authUrl = getAuthUrl();
    window.location = authUrl;
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.logo}>
        <img src={logo} alt="Background"/>  
      </div>
      
      <div className={styles.buttonDiv}>
      <button onClick={handleLogin} className={styles.button}>Login with Spotify</button>
      </div>
    </div>
  );
}

export default LandingPage;
