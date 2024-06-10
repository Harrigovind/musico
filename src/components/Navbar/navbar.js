import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './navbar.module.css';
import { fetchUserProfile, getAccessToken, signOut } from '../../services/spotify';
import { PlayerContext } from '../../contexts/PlayerContext';

function Navbar() {
  
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const {setIsSignedIn} = useContext(PlayerContext);
  const handleSignOut = () => {
    signOut();
    setIsSignedIn(false);
    navigate('/');
  }

  const handleNavigate = ( location) => {
    navigate(`/${location}`);
  }

  const fetchToken = async () => {
    try{
      const token = await getAccessToken();
      if(token){
        setToken(token);
      }
    }catch(error){
      console.error('Error fetching token',error);
    }
  }

  useEffect(() => {
    fetchToken();
  },[]);

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        if(token) {
          const {userProfile, profilePicUrl} = await fetchUserProfile(token);
          setProfileData({userProfile,profilePicUrl});
        }
      } catch(error){
        console.error('Error fetching profile', error);
      }
    };

    fetchProfile();
  },[token]);
  

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <button onClick={() => handleNavigate('home')}>Home</button>
        </li>
        <li className={styles.navbarItem}>
        <button onClick={() => handleNavigate('search')}>Search</button>
        </li>
        <li className={styles.navbarItem}>
          <div className={styles.navbarRight}>
            {profileData && (
              <div className={styles.profileInfo} onClick={ () => setShowDropdown(!showDropdown)}>
                <img src={profileData.profilePicUrl} alt="Profile" className={styles.profilePic}/>
              </div>
            )}

            
          </div>
        </li>
      </ul>
      {showDropdown && (
                <div className={styles.dropdown}>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            )}
    </nav>
    
  );
}

export default Navbar;
