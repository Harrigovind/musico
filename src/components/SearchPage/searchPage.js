import React, { useContext, useState } from "react";
import styles from './searchPage.module.css';
import searchIcon from '../../images/search.jpg';
import Navbar from '../Navbar/navbar';
import logo from '../../images/logo-bg.png';
import { getAccessToken, searchTracks } from '../../services/spotify';
import { PlayerContext } from "../../contexts/PlayerContext.js";

function SearchPage() {

    const {setTrack, setErrorMessage} = useContext(PlayerContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const token = await getAccessToken();
            if(token){
                const response = await searchTracks(token, searchQuery);
                setSearchResults(response.data.tracks.items);
            } else {
                console.log('No token found!');
            }
        } catch (error) {
            console.error('Error searching for tracks:', error);
        }
    };

    const playTrack = (track) => {
        if (track.preview_url) {
            setTrack(track);
            setErrorMessage("");
        } else {
            setErrorMessage("No preview available for this track.");
        }
    };

    return (
        <div className={styles.searchPage}>
            <Navbar />
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Enter the song to search..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <img
                    src={searchIcon}
                    className={styles.searchIcon}
                    alt="Search"
                    onClick={handleSearch}
                />
            </div>
            <div className={styles.container}>
                
                <div className={styles.trackList}>
                    {searchResults.map((track, index) => (
                    <div key={index} className={styles.track} onClick={() => playTrack(track)}>
                        <img src={track.album.images[0].url} alt={track.album.name} />
                        <h3>{track.name}</h3>
                        <p>Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Album: {track.album.name}</p>
                    </div>
                    ))}
                </div>
                {searchResults.length === 0 && <img src={logo} className={styles.logo} alt="Logo" />}
            </div>
            

            
        </div>
    );
}

export default SearchPage;
