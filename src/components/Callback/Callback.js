import React, { useEffect ,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchToken} from '../../services/spotify.js';

function Callback() {
    const navigate = useNavigate();
    const [tokenFetched, setTockenFetched] = useState(false);

    useEffect(() =>{
        const fetchSpotifyToken = async (code) => {
            try{
                await fetchToken(code);
                setTockenFetched(true);
                navigate('/home');
            } catch(error){
                console.log('Error fetching the token', error);
                setTockenFetched(false);
            }
        };

        const code = new URLSearchParams(window.location.search).get('code');
        if (code && !tokenFetched){
            fetchSpotifyToken(code);
        }else {
            navigate('#/home');
        }

    }, [navigate,tokenFetched]
    );
    return <div>Loading ....</div>

}

export default Callback;