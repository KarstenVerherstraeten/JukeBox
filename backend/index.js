const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = "http://localhost:5001/callback"; // Adjust based on your actual redirect URI

// Step 1: Redirect user to Spotify's authorization page with correct scopes
app.get("/authorize", (req, res) => {
    const scope = "streaming user-read-playback-state user-modify-playback-state";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    res.redirect(authUrl);
});

// Step 2: Spotify redirects back here with authorization code
app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("Authorization code not found.");
    }

    try {
        // Exchange authorization code for access token
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const accessToken = response.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        console.error("Error during token exchange:", error);
        res.status(500).send(error.message);
    }
});

// Route to get playlist tracks
app.get("/get-tracks", async (req, res) => {
  const { client_id, client_secret } = process.env;

  try {
    // Step 1: Get access token
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // Step 2: Use access token to fetch playlist tracks
    const tracksResponse = await axios.get(
      "https://api.spotify.com/v1/playlists/0muZPQlMO0e0eCcFS3RJyF/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(tracksResponse.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post("get-token", async (req, res) => {
  const { client_id, client_secret } = process.env;

  try {
    // Step 1: Get access token
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));