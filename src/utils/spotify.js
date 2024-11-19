import axios from "axios";

const API_URL = "http://localhost:5001";

export const getToken = async () => {
  const response = await axios.post(`${API_URL}/get-token`);
  return response.data.access_token;
};

export const searchTracks = async (query, token) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/search`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: "track" },
    }
  );
  return response.data.tracks.items;
};  