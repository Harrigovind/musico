import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Navbar/navbar';
import styles from './HomePage.module.css';
import { getAccessToken, fetchTopTracks } from '../../services/spotify.js';
import { PlayerContext } from '../../contexts/PlayerContext.js';

function HomePage() {
  
  const [tracks, setTracks] = useState([]);
  const {setTrack, setErrorMessage, setIsSignedIn} = useContext(PlayerContext);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          setIsSignedIn(true);
          console.log('Fetching tracks...');
          const response = await fetchTopTracks(token);
          setTracks(response.data.items);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching tracks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const playTrack = (track) => {
    if (track.preview_url) {
      setTrack(track);
      setErrorMessage("");
    } else {
      setErrorMessage("No preview available for this track.");
    }
  };


  return (
    <div className={styles.homePage}>
      <Navbar />
      <h1>MusiCo home here!</h1>
      <p>Discover and enjoy your favorite music.</p>

      

      <div className={styles.trackList}>
        {tracks.map((track, index) => (
          <div key={index} className={styles.track} onClick={() => playTrack(track)}>
            <img src={track.album.images[0].url} alt={track.album.name} />
            <h3>{track.name}</h3>
            <p>Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
            <p>Album: {track.album.name}</p>
          </div>
        ))}
      </div>
      
      
    </div>
  );
}

export default HomePage;
