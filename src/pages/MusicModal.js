// src/components/MusicModal.jsx
import React from "react";
import "./styling/musicModal.css";

const MusicModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // don't render if closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h1>Listen on</h1>
        <ul className="music-links">
          <li><a href="https://open.spotify.com/artist/1Qc3omsMr3VZ80uClGFoBq?si=JKjOfydjREeX5q1365nqpg" target="_blank" rel="noreferrer">Spotify</a></li>
          <li><a href="https://music.apple.com/us/artist/bezus/1756526545" target="_blank" rel="noreferrer">Apple Music</a></li>
          <li><a href="https://soundcloud.com/bezzus" target="_blank" rel="noreferrer">SoundCloud</a></li>
        </ul>
      </div>
    </div>
  );
};

export default MusicModal;
