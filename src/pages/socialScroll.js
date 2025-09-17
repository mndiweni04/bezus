// src/pages/SocialScroll.jsx
import React, { useState, useEffect, useRef } from "react";
import { socialLinks } from "../data/sLinks.js";
import MusicModal from "./MusicModal";
import "./styling/items.css";

const SocialScroll = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showMusicModal, setShowMusicModal] = useState(false);

  // animation state
  const rotationRef = useRef(0);
  const velocityRef = useRef(0); // smooth easing
  const lastInteraction = useRef(Date.now());
  const rafRef = useRef(null);

  // dragging
  const dragging = useRef(false);
  const lastY = useRef(0);

  // update window resize
  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // main animation loop
  useEffect(() => {
    const animate = () => {
      // drift if idle
      const idleTime = Date.now() - lastInteraction.current;
      if (idleTime > 3000) {
        velocityRef.current += 0.0005; // very slow drift
      }

      rotationRef.current += velocityRef.current;
      velocityRef.current *= 0.95; // friction

      draw();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  },);

  const handleWheel = (e) => {
    velocityRef.current += e.deltaY * 0.0008;
    lastInteraction.current = Date.now();
  };

  // drag start
  const handlePointerDown = (e) => {
    dragging.current = true;
    lastY.current = e.clientY;
    lastInteraction.current = Date.now();
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const dy = e.clientY - lastY.current;
    velocityRef.current += dy * 0.002; // sensitivity
    lastY.current = e.clientY;
    lastInteraction.current = Date.now();
  };

  const handlePointerUp = () => {
    dragging.current = false;
    // snap to nearest angle (optional polish)
    const step = (2 * Math.PI) / socialLinks.length;
    const snapped = Math.round(rotationRef.current / step) * step;
    const diff = snapped - rotationRef.current;
    velocityRef.current += diff * 0.08; // ease into snap
  };

  // compute and render icons
  const draw = () => {
    const container = document.querySelector(".social-circle");
    if (!container) return;

    const minDim = Math.min(dimensions.width, dimensions.height);
    const radius = minDim * 0.35;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const items = container.querySelectorAll(".social-link");

    items.forEach((item, index) => {
      const angleStep = (2 * Math.PI) / socialLinks.length;
      const angle = index * angleStep + rotationRef.current;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // depth weighting (top vs bottom)
      const depth = (Math.sin(angle) + 1) / 2; // 0..1
      const scale = 0.6 + depth * 0.8; // min 0.6, max 1.4
      const opacity = 0.3 + depth * 0.7;

      item.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = Math.floor(depth * 100); // top icons above
    });
  };

  return (
    <div
      className="social-scroll-wrapper"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="social-circle">
        {socialLinks.map((link, index) => {
          const isMusic = link.name === "Music";
          return (
            <div key={index} className="social-link">
              {isMusic ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMusicModal(true);
                  }}
                  className="social-btn"
                >
                  <img src={link.image} alt={link.name} />
                  <span>{link.name}</span>
                </button>
              ) : (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-anchor"
                >
                  <img src={link.image} alt={link.name} />
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
