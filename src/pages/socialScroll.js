// src/components/SocialScroll.jsx

import React, { useState, useEffect } from "react";
import { socialLinks } from "../data/sLinks.js";
import MusicModal from "./MusicModal";
import "./styling/items.css";

const SocialScroll = () => {
  const [rotationValue, setRotationValue] = useState(0);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      setRotationValue((prev) => prev + e.deltaY * 0.01);
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const minDim = Math.min(dimensions.width, dimensions.height);
  const baseRadius = minDim * 0.35; // circle radius relative to screen size
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <div className="social-scroll-wrapper">
      <div className="social-circle">
        {socialLinks.map((link, index) => {
          const angleStep = (2 * Math.PI) / socialLinks.length;
          const baseAngle = index * angleStep;

          const direction = index % 2 === 0 ? 1 : -1;
          const angle = baseAngle + rotationValue * direction;

          const x = centerX + baseRadius * Math.cos(angle);
          const y = centerY + baseRadius * Math.sin(angle);

          const distanceToCenter = Math.abs(y - centerY);
          const normalized = Math.min(distanceToCenter / baseRadius, 1);

          const baseSize = minDim * 0.08; // ~8% of viewport
          const scale = 1 + (1 - Math.pow(normalized, 1.5)) * 1.0;
          const opacity = 0.3 + (1 - normalized) * 0.9;
          const size = baseSize * scale;

          const isMusic = link.name === "Music";

          return (
            <div
              key={index}
              className="social-link"
              style={{
                transform: `translate(${x - size / 2}px, ${y - size / 2}px) scale(${scale})`,
                opacity,
              }}
            >
              {isMusic ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMusicModal(true);
                  }}
                  className="social-btn"
                >
                  <img src={link.image} alt={link.name} style={{ width: `${size}px`, height: "auto" }} />
                  <span>{link.name}</span>
                </button>
              ) : (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-anchor"
                >
                  <img src={link.image} alt={link.name} style={{ width: `${size}px`, height: "auto" }} />
                  <span>{link.name}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>

      <MusicModal isOpen={showMusicModal} onClose={() => setShowMusicModal(false)} />
    </div>
  );
};

export default SocialScroll;
