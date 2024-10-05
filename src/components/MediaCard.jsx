import {useEffect, useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import "../mediacard.css";
import { timer } from "../utils/timer";

const MediaCard = ({ musicNumber, setMusicNumber, setOpen, songs, open }) => {
    const {
        audioRef,
        play,
        volume,
        setVolume,
        currentTime,
        duration,
        repeat,
        handlePlayingAudio,
        changeCurrentTime,
        handleNextPrev,
        handleRepeat
    } = useAudioPlayer(50, songs, musicNumber, setMusicNumber);

    const [showVolume, setShowVolume] = useState(false); 
    const [isMuted, setIsMuted] = useState(false);

    const toggleVolume = () => setShowVolume(prev => !prev);

    const handleTouchStart = (e) => {
        // Prevent default behavior on touch
        e.preventDefault(); 
    };

    const handleMute = () => {
        setIsMuted(prev => !prev);
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };


    useEffect(() => {
        const handleVolumeKeyPress = (e) => {
            if (e.key === 'ArrowUp') {
                // Increase volume on arrow up key press
                setVolume((prevVolume) => {
                    // Increment by 5, max 100
                    const newVolume = Math.min(prevVolume + 5, 100); 
                    if (audioRef.current) {
                        audioRef.current.volume = newVolume / 100;
                    }
                    return newVolume;
                });
            } else if (e.key === 'ArrowDown') {
                // Decrease volume on arrow down key press
                setVolume((prevVolume) => {
                    // Decrement by 5, min 0
                    const newVolume = Math.max(prevVolume - 5, 0); 
                    if (audioRef.current) {
                        audioRef.current.volume = newVolume / 100;
                    }
                    return newVolume;
                });
            }
        };
        window.addEventListener('keydown', handleVolumeKeyPress);
        return () => {
            window.removeEventListener('keydown', handleVolumeKeyPress);
        };
    }, [audioRef, setVolume]);

    // Define songs info
    const currentSong = songs[musicNumber] || {};
    const artistPortrait = currentSong.artist ? currentSong.artist.portrait : "";
    const songName = currentSong.name || "Unknown Title";
    const artistName = currentSong.artist ? currentSong.artist.name : "Unknown Artist"; 
    const songFilePath = currentSong.file_path || "";

    // Apply "blurred" class when SongsList is open in portrait mode
    const portraitClassName = `portrait ${open ? "blurred" : ""}`;
    const detailsClassName = `details ${open ? "blurred" : ""}`;
    const progressbarClassName = `progressbar ${open ? "blurred" : ""}`;
    const timerClassName = `timer ${open ? "blurred" : ""}`;
    const controlsClassName = `controls ${open ? "blurred" : ""}`;

    // Ensure "centered" class for MediaCard when SongsList is closed on landscape mode
    // Otherwise, when the list is open, shift the Card to the left
    const cardClassName = `card ${open ? "shift-left" : "centered"}`

    return (
        <div className={cardClassName}>
            <div className="nav">
                <div className="icon-container">
                    <i className="material-symbols-outlined"
                        onClick={() => setOpen(prev => !prev)}>queue_music
                    </i>
                    <span className="tooltip-text">Music List</span>
                </div>
                {songs.length > 0 ? (
                    <span>Now Playing {musicNumber + 1} / {songs.length}</span>
                ) : (
                    <span>Open Music List and Select a Genre</span>
                )
                }
            </div>

            <div className={portraitClassName}>
                <img src={artistPortrait} alt={`Portrait of ${artistName}`} />
            </div>
            
            <div className={detailsClassName}>
                <p className="title">{songName}</p>
                <p className="artist">{artistName}</p>
            </div>

            <div className={progressbarClassName}>
                <input type="range" min={0} max={duration} value={currentTime}
                    onChange={changeCurrentTime} />
            </div>

            <div className={timerClassName}>
                <span>{timer(currentTime)}</span>
                <span>{timer(duration)}</span>
            </div>

            <div className={controlsClassName}>
                <div className="icon-container">    
                    <i className="material-symbols-outlined" onClick={handleRepeat}>
                        {repeat === "autoplay" ? "autoplay" :
                            repeat === "repeat" ? "repeat" : "shuffle"}
                    </i>
                    <span className="tooltip-text">
                        {repeat === "autoplay" ? "Normal" :
                            repeat === "repeat" ? "Repeat" : "Shuffle"}
                    </span>
                </div>
                <i className="material-symbols-outlined" id="prev"
                    onClick={() => handleNextPrev(-1)}>skip_previous</i>
                <div className="play" onClick={handlePlayingAudio}>
                    <i className="material-symbols-outlined">
                        {play ? "pause" : "play_arrow"}
                    </i>
                </div>
                <i className="material-symbols-outlined" id="next"
                    onClick={() => handleNextPrev(1)}>skip_next
                </i>
                <i className="material-symbols-outlined"
                    onClick={toggleVolume}>volume_up
                </i>
                {showVolume && (
                    <div className="volume">
                        <i className="material-symbols-outlined" onClick={handleMute}>
                            {isMuted ? "volume_off" : "volume_up"}
                        </i>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={volume}
                            onChange={handleVolumeChange}
                            onTouchStart={handleTouchStart}
                        />
                        <span>{volume}</span>
                    </div>
                )}
            </div>

            <audio 
                src={songFilePath}
                ref={audioRef}
                onTimeUpdate={changeCurrentTime}
                muted={isMuted}
            />
        </div>
    );
};

export default MediaCard;