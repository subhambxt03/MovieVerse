import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">MovieVerse</h3>
          <p className="footer-description">
            Discover, explore, and enjoy amazing movies from around the world.
            Your ultimate movie companion.
          </p>
          <div className="footer-social">
            <a href="mailto:shubhambxt25@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <FaEnvelope />
            </a>
            <a href="https://linkedin.com/in/shubhambxt2503/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/subham_bxt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/9639502481" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="https://github.com/subhambxt03" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} MovieVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;