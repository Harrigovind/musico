import axios from 'axios';

const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirect_uri = 'https://harrigovind.github.io/#/callback';
const scope = process.env.REACT_APP_SPOTIFY_CLIENT_SCOPE;
const url = 'https://accounts.spotify.com/authorize';
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const getAuthUrl = () => {
    const params = {
        'client_id':client_id,
        'response_type':'code',
        'scope': scope,
        'redirect_uri': redirect_uri,
        'show_dialog': true,
      }
      var authUrl = new URL(url);
      Object.keys(params).forEach(key => authUrl.searchParams.append(key, params[key]));
      authUrl = authUrl.toString();
      return authUrl;
};

// Fetch the access token using the authorization code
const fetchToken = async (code) => {
  try {
    const params = new URLSearchParams();
    params.append('code',code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri',redirect_uri);
    params.append('client_id', client_id);
    params.append('client_secret',client_secret);
    

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      
    });

    const { access_token, refresh_token, expires_in } = response.data;
    localStorage.setItem('spotify_access_token', access_token);
    localStorage.setItem('spotify_refresh_token', refresh_token);
    localStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
    return access_token;
  } catch (error) {
    console.error('Error fetching the token', error);
    throw error;
  }
};

// Refresh the access token using the refresh token
const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('spotify_refresh_token');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
      },
    });

    const { access_token, expires_in } = response.data;
    localStorage.setItem('spotify_access_token', access_token);
    localStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);

    return access_token;
  } catch (error) {
    console.error('Error refreshing the token', error);
    throw error;
  }
};

// Get the access token, refresh if expired
const getAccessToken = async () => {
  const token_expiry = localStorage.getItem('spotify_token_expiry');

  if (Date.now() > token_expiry) {
    return await refreshToken();
  }

  return localStorage.getItem('spotify_access_token');
};

// Get user profile
const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userProfile = response.data;
    const profilePicUrl = userProfile.images?.[0]?.url;
    console.log(userProfile);
    return {userProfile , profilePicUrl};

  } catch (error) {
      console.error('Error fetching user profile', error);
      throw error;
  }
};

//Get top tracks
const fetchTopTracks = async (token) =>{
  const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

//Search tracks
const searchTracks = async (token, searchQuery) => {
  const response = await axios.get(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });

  return response;
}

// Handle Sign Out
const signOut = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expiry');
}

export { getAuthUrl, fetchToken, getAccessToken, fetchUserProfile, fetchTopTracks, searchTracks, signOut};
