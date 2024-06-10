import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './Player.module.css';
import playIcon from '../../images/play.png';
import pauseIcon from '../../images/pause.png';
import volumeIcon from '../../images/volume.png';
import { PlayerContext } from '../../contexts/PlayerContext';



function Player () {

    const {track, errorMessage, isSignedIn} = useContext(PlayerContext);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    
    useEffect(() => {
        if(!isSignedIn){
            audioRef.current.pause();
            setCurrentTime(0);
            setIsPlaying(false);
            setIsVisible(false);
        }
    },[isSignedIn]);

    useEffect(() => {

        setIsVisible(!!track);
        const audio = audioRef.current;
        const handleCanPlayThrough = () => {
            setIsPlaying(true);
            audio.play();
        };
    
        if (track && audio) {
            audio.currentTime = 0;
            if (track.preview_url) {
                audio.src = track.preview_url;
                audio.addEventListener('canplaythrough', handleCanPlayThrough);
                setCurrentTime(0);
                setDuration(0);
            }
        }
    
        return () => {
            if (audio) {
                audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            }
        };
    }, [track]);
      
    
    

    useEffect(() => {

        const audio = audioRef.current;
        if (audio) {
          audio.volume = volume;
      
          const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
          };
      
          const handleLoadedMetadata = () => {
            setDuration(audio.duration);
          };
      
          audio.addEventListener('timeupdate', handleTimeUpdate);
          audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      
          return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          };
        }
      }, [volume]);
      

    const handleTogglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        }
    };

    const handleProgressChange = (e) => {

        const audio = audioRef.current;
        if (audio) {

            const newTime = e.target.value;

            audio.currentTime = newTime;
            setCurrentTime(newTime);

            if(isPlaying){
                audio.play();
            }
            else{
                handleTogglePlayPause();
            }

            

        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
          audioRef.current.volume = newVolume;
        }
    };

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

      

    return (
        <div className={`${styles.player} ${!isVisible && styles.hidden}`}>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {track && (
            <div className={styles.details}>
            <img src={track.album.images[0].url} alt={track.album.name} />
            <div>
                <h3>{track.name}</h3>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
            </div>
        )}
        <div className={styles.controls}>
            <button onClick={handleTogglePlayPause} className={styles.playPauseButton}>
            <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? 'Pause' : 'Play'} />
            </button>
            <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={handleProgressChange}
            className={styles.progressBar}
            />
            <div className={styles.volumeContainer}>
            <img src={volumeIcon} alt='Volume' onClick={toggleVolumeSlider} className={styles.volumeButton}/>
            {showVolumeSlider && (
                <input
                type="range"
                className={styles.volumeSlider}
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                orient="vertical"
                />
            )}
        </div>
        </div>
        <audio ref={audioRef}></audio>
        </div>
    );
};

export default Player;
