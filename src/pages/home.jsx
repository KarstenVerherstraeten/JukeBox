import React, { useState, useEffect } from "react";
import style from "../modules/home.module.css";
import Footer from "../components/Footer";
import SpotifyPlayer from "../components/SpotifyPlayer";

const Home = () => {
	const [tracks, setTracks] = useState([]); // State for all tracks
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // State for the currently displayed track
	const [token, setToken] = useState(""); // Spotify access token

	useEffect(() => {
		// Fetch Spotify token
		const fetchToken = async () => {
			try {
				const response = await fetch("http://localhost:5001/get-token", {
					method: "POST",
				});
				if (!response.ok) throw new Error("Failed to fetch token");
				const data = await response.json();
				setToken(data.access_token);
			} catch (error) {
				console.error("Error fetching token:", error);
			}
		};

		fetchToken();
	}, []);

	useEffect(() => {
		// Fetch tracks
		const fetchTracks = async () => {
			try {
				const response = await fetch("http://localhost:5001/get-tracks");
				if (!response.ok) throw new Error("Failed to fetch tracks");
				const data = await response.json();

				const trackInfo = data.items.map((item) => ({
					name: item.track.name,
					artist: item.track.artists[0]?.name || "Unknown Artist",
					year: item.track.album.release_date?.split("-")[0] || "Unknown Year",
					image: item.track.album.images[0]?.url || "",
				}));

				setTracks(trackInfo);
			} catch (error) {
				console.error("Error fetching tracks:", error);
			}
		};

		fetchTracks();
	}, []);

	const nextTrack = () => {
		setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
	};

	const prevTrack = () => {
		setCurrentTrackIndex(
			(prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length
		);
	};

	return (
		<>
			<div className={style.header}>
				<h1 className={style.title}>Welcome to the Jukebox</h1>
			</div>

			<div className={style.jukebox}>
				{tracks.length > 0 ? (
					<div className={style.song}>
						<div className={style.vinylWrapper}>
							<div className={style.vinyl}>
								<img
									src={tracks[currentTrackIndex]?.image}
									alt={`${tracks[currentTrackIndex]?.name} Album`}
									className={style.albumCover}
								/>
							</div>
						</div>
						<h2>{tracks[currentTrackIndex]?.name}</h2>
						<p>Artist: {tracks[currentTrackIndex]?.artist}</p>
						<p>Year: {tracks[currentTrackIndex]?.year}</p>
					</div>
				) : (
					<p>Loading songs...</p>
				)}

				<div className={style.controls}>
                    <button onClick={prevTrack}>Previous</button>
					{/* Render SpotifyPlayer only if token is available */}
					{token ? (
						<SpotifyPlayer token={token} />
					) : (
						<p>Loading Spotify Player...</p>
					)}
                    <button onClick={nextTrack}>Next</button>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Home;
