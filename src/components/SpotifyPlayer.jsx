import React, { useEffect, useState } from "react";

const SpotifyPlayer = ({ token, uri }) => {
    const [player, setPlayer] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false); // Track if the player is ready

    useEffect(() => {
        console.log("Spotify Token:", token); // Debugging the token
        if (!token) return; // Skip initialization if token is missing

        // Check if the SDK is loaded
        const script = document.getElementById("spotify-player");
        if (!script) {
            console.log("Spotify SDK script not found!");
            return;
        }

        console.log("Initializing Spotify Player...");

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("Spotify SDK loaded!");

            const playerInstance = new window.Spotify.Player({
                name: "Web Playback SDK Jukebox",
                getOAuthToken: (cb) => cb(token), // Pass the token here
                volume: 0.5,
            });

            playerInstance.addListener("ready", ({ device_id }) => {
                console.log("Player ready with Device ID:", device_id);
                setPlayer(playerInstance);
                setIsPlayerReady(true);
                transferPlaybackHere(token, device_id); // Transfer playback
            });

            playerInstance.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            playerInstance.connect();
        };
    }, [token]);

    const transferPlaybackHere = async (token, deviceId) => {
        try {
            console.log("Transferring playback to device:", deviceId);
            await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: true,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error transferring playback:", error);
        }
    };

    const playTrack = () => {
        if (player) {
            console.log("Resuming playback...");
            player.resume(); // Resume playback if the player is ready
        } else {
            console.log("Player is not ready yet.");
        }
    };

    return (
        <div>
            <button onClick={playTrack} disabled={!isPlayerReady}>
                Play
            </button>
            {!isPlayerReady && <p>Loading Spotify Player...</p>}
        </div>
    );
};

export default SpotifyPlayer;