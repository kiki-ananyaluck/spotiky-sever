import express from "express";
import dotenv from "dotenv"
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,        
  clientSecret: process.env.CLIENT_SECRET, 
  redirectUri: process.env.REDIRECT_URI, 
});

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);

router.get("/login", async (req, res) => {
  try {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
    ];
    const authUrl = spotifyApi.createAuthorizeURL(scopes, null, {
      redirectUri: encodeURIComponent(process.env.REDIRECT_URL),
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get("/callback", async (req, res) => {
  try {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    console.log('Callback query parameters:', req.query);

    if (error) {
      console.error('Error:', error);
      return res.send(`Error: ${error}`);
    }

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    res.send('Authorization successful! You can now use Spotify APIs.');

    setInterval(async () => {
      try {
        const refreshData = await spotifyApi.refreshAccessToken();
        const accessTokenRefreshed = refreshData.body['access_token'];
        spotifyApi.setAccessToken(accessTokenRefreshed);
        console.log('Access token refreshed');
      } catch (error) {
        console.error('Error refreshing access token:', error);
      }
    }, (expiresIn / 2) * 1000); 

  } catch (error) {
    console.error("Error in callback:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    spotifyApi.searchTracks(q).then(searchData => {
      const trackUri = searchData.body.tracks.items[0].url;
      res.send({ uri: trackUri });
    })
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/play", async (req, res) => {
  try {
    const { uri } = req.query;
    spotifyApi.play({ uris: [uri] }).then(() => {
      res.send('playback started');
    })
  } catch (error) {
    console.error("Error in playing:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
