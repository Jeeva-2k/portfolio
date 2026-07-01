import { useState, useEffect } from 'react';
import './App.css';
import profileImg from './assets/profile.png';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Audio playing utility
  const playSound = (frequency = 400, type = 'sine', duration = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log("Audio not supported or blocked by browser policy");
    }
  };

  // Hover and Click Sound helper functions
  const playHoverSound = () => playSound(320, 'triangle', 0.03);
  const playClickSound = () => playSound(550, 'sine', 0.08);

  // Force landing page scroll behavior on mount
  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Sync scroll positions with active navigation links
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 280)) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown menu when clicking anywhere else
  useEffect(() => {
    const handleCloseDropdown = () => setDropdownOpen(false);
    document.addEventListener('click', handleCloseDropdown);
    return () => document.removeEventListener('click', handleCloseDropdown);
  }, []);

  // Track mouse coordinates for spotlight grid effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll reveal animation observer
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        } else {
          entry.target.classList.remove('reveal-active');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Figma Hover Frame and Elastic Drag Interaction
  useEffect(() => {
    const targetSelector = '.hero-name, .hero-title, .hero-tagline, .hero-section .btn, .hero-chip, .inline-photo-card';
    
    const frame = document.getElementById('figma-frame');
    const badge = document.getElementById('figma-badge');
    const chip = document.getElementById('figma-chip');

    if (!frame || !badge || !chip) return;

    let hoveredEl = null;
    let dragEl = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let originalTransform = '';
    let warningText = '';

    const warningPhrases = [
      "Don't move me! 🛑",
      "Pixel perfection is locked! 🔒",
      "Auto Layout says NO! 😤",
      "Ouch! Designing is hard! ✏️",
      "Draft mode only! 🛠️",
      "Please don't break the design! 🥺"
    ];

    const getBadgeLabel = (el) => {
      if (el.classList.contains('btn') || el.classList.contains('launch-btn')) return 'Button';
      if (el.classList.contains('hero-name')) return 'Text (Name)';
      if (el.classList.contains('hero-title')) return 'Text (Title)';
      if (el.classList.contains('hero-tagline')) return 'Text (Subtitle)';
      if (el.classList.contains('section-title')) return 'Heading 2';
      if (el.classList.contains('section-tag')) return 'Badge';
      if (el.classList.contains('project-card')) return 'Component (Project Card)';
      if (el.classList.contains('hero-chip')) return 'Chip';
      if (el.classList.contains('about-highlight-card')) return 'Card Highlight';
      if (el.classList.contains('skill-card-new')) return 'Skill Card';
      if (el.classList.contains('timeline-content')) return 'Timeline Node';
      if (el.classList.contains('impact-card-new')) return 'Impact Stat';
      if (el.classList.contains('contact-card-link')) return 'Contact Pill';
      if (el.classList.contains('contact-form-container')) return 'Form Instance';
      if (el.classList.contains('inline-photo-card')) return 'Frame (Photo)';
      return `Frame (${el.tagName.toLowerCase()})`;
    };

    const updateFramePosition = (el) => {
      const rect = el.getBoundingClientRect();
      frame.style.top = `${rect.top}px`;
      frame.style.left = `${rect.left}px`;
      frame.style.width = `${rect.width}px`;
      frame.style.height = `${rect.height}px`;
    };

    const handleMouseOver = (e) => {
      if (isDragging) return;
      const target = e.target.closest(targetSelector);
      if (target) {
        if (target.classList.contains('inline-photo-card')) {
          frame.classList.remove('active');
          hoveredEl = null;
          return;
        }
        hoveredEl = target;
        updateFramePosition(target);
        badge.innerText = getBadgeLabel(target);
        frame.classList.add('active');
      }
    };

    const handleMouseOut = (e) => {
      if (isDragging) return;
      const target = e.target.closest(targetSelector);
      if (target && hoveredEl === target) {
        frame.classList.remove('active');
        hoveredEl = null;
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('.figma-handle')) return;
      const target = e.target.closest(targetSelector);
      if (target) {
        e.preventDefault();
        dragEl = target;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        originalTransform = target.style.transform || '';
        target.classList.remove('figma-spring-back');
        warningText = warningPhrases[Math.floor(Math.random() * warningPhrases.length)];
      }
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !dragEl) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDrag = 60;

      let finalDx = dx;
      let finalDy = dy;
      if (dist > maxDrag) {
        finalDx = (dx / dist) * maxDrag;
        finalDy = (dy / dist) * maxDrag;
      }

      dragEl.style.transform = `translate(${finalDx}px, ${finalDy}px) rotate(${finalDx * 0.08}deg)`;
      if (!dragEl.classList.contains('inline-photo-card')) {
        updateFramePosition(dragEl);
      }

      chip.style.top = `${e.clientY - 45}px`;
      chip.style.left = `${e.clientX + 15}px`;
      
      const shakingEmojis = ["🫨", "🙅‍♂️", "🤦‍♂️", "🤯", "🫣"];
      const randomEmoji = shakingEmojis[Math.floor(Math.abs(dx + dy) % shakingEmojis.length)];
      chip.innerHTML = `<span class="emoji-shake">${randomEmoji}</span> ${warningText}`;
      chip.classList.add('active');
    };

    const handlePointerUp = () => {
      if (!isDragging || !dragEl) return;

      dragEl.classList.add('figma-spring-back');
      dragEl.style.transform = originalTransform || 'translate(0px, 0px) rotate(0deg)';
      chip.classList.remove('active');

      const elToClean = dragEl;
      const springBackStartTime = performance.now();
      const duration = 500;

      const syncFrameOnSpringBack = (time) => {
        const elapsed = time - springBackStartTime;
        if (elToClean && !elToClean.classList.contains('inline-photo-card')) {
          updateFramePosition(elToClean);
        }
        if (elapsed < duration) {
          requestAnimationFrame(syncFrameOnSpringBack);
        } else {
          elToClean.classList.remove('figma-spring-back');
          if (!originalTransform) {
            elToClean.style.transform = '';
          }
          if (!hoveredEl) {
            frame.classList.remove('active');
          } else {
            updateFramePosition(hoveredEl);
          }
        }
      };
      requestAnimationFrame(syncFrameOnSpringBack);

      isDragging = false;
      dragEl = null;
    };

    const handleSync = () => {
      if (hoveredEl) {
        updateFramePosition(hoveredEl);
      }
    };

    const handleDocumentClick = (e) => {
      const target = e.target.closest(targetSelector);
      if (!target && !e.target.closest('#figma-frame') && !e.target.closest('#figma-chip')) {
        frame.classList.remove('active');
        hoveredEl = null;
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('scroll', handleSync);
    window.addEventListener('resize', handleSync);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('scroll', handleSync);
      window.removeEventListener('resize', handleSync);
    };
  }, []);

  // Built-in Resizable Photo Frame logic
  useEffect(() => {
    const card = document.querySelector('.inline-photo-card');
    if (!card) return;

    const handleTL = card.querySelector('.handle-tl');
    const handleTR = card.querySelector('.handle-tr');
    const handleBL = card.querySelector('.handle-bl');
    const handleBR = card.querySelector('.handle-br');

    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let resizeStartWidth = 0;
    let resizeStartHeight = 0;
    let direction = '';

    const startResize = (e, dir) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      direction = dir;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      const rect = card.getBoundingClientRect();
      resizeStartWidth = rect.width;
      resizeStartHeight = rect.height;
      card.classList.add('resizing');
    };

    const handlePointerMove = (e) => {
      if (!isResizing) return;
      const dx = e.clientX - resizeStartX;
      const dy = e.clientY - resizeStartY;
      
      let newWidth = resizeStartWidth;
      let newHeight = resizeStartHeight;
      
      if (direction === 'br') {
        newWidth = resizeStartWidth + dx;
        newHeight = resizeStartHeight + dy;
      } else if (direction === 'bl') {
        newWidth = resizeStartWidth - dx;
        newHeight = resizeStartHeight + dy;
      } else if (direction === 'tr') {
        newWidth = resizeStartWidth + dx;
        newHeight = resizeStartHeight - dy;
      } else if (direction === 'tl') {
        newWidth = resizeStartWidth - dx;
        newHeight = resizeStartHeight - dy;
      }
      
      newWidth = Math.max(45, Math.min(250, newWidth));
      newHeight = Math.max(30, Math.min(180, newHeight));
      
      card.style.width = `${newWidth}px`;
      card.style.height = `${newHeight}px`;
    };

    const handlePointerUp = () => {
      if (isResizing) {
        isResizing = false;
        card.classList.remove('resizing');
      }
    };

    const onTLDown = (e) => startResize(e, 'tl');
    const onTRDown = (e) => startResize(e, 'tr');
    const onBLDown = (e) => startResize(e, 'bl');
    const onBRDown = (e) => startResize(e, 'br');

    if (handleTL) handleTL.addEventListener('pointerdown', onTLDown);
    if (handleTR) handleTR.addEventListener('pointerdown', onTRDown);
    if (handleBL) handleBL.addEventListener('pointerdown', onBLDown);
    if (handleBR) handleBR.addEventListener('pointerdown', onBRDown);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      if (handleTL) handleTL.removeEventListener('pointerdown', onTLDown);
      if (handleTR) handleTR.removeEventListener('pointerdown', onTRDown);
      if (handleBL) handleBL.removeEventListener('pointerdown', onBLDown);
      if (handleBR) handleBR.removeEventListener('pointerdown', onBRDown);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Section Header Underline Scroll Progress Hook
  useEffect(() => {
    const handleScrollProgress = () => {
      const headers = document.querySelectorAll('.section-header');
      headers.forEach(header => {
        const rect = header.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        let progress = 0;
        if (rect.top < viewportHeight) {
          progress = (viewportHeight - rect.top) / viewportHeight;
        }
        
        // Clamp to a safe max of 1.8 to prevent overflow, allowing continuous growth
        progress = Math.max(0, Math.min(1.8, progress));
        header.style.setProperty('--scroll-progress', progress);
      });
    };

    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    handleScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScrollProgress);
    };
  }, []);


  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
    playSound(450, 'triangle', 0.04);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    playSound(800, 'sine', 0.15);
    setTimeout(() => {
      playSound(1000, 'sine', 0.2);
    }, 100);

    alert("Thank you! Your message has been sent successfully.");
    e.target.reset();
  };

  return (
    <>
      {/* Interactive spotlight glow and grid */}
      <div className="mouse-spotlight-glow"></div>
      <div className="mouse-spotlight-grid"></div>

      {/* Ambient background glows */}
      <div className="glow-container">
        <div className="ambient-glow glow-green"></div>
        <div className="ambient-glow glow-orange"></div>
        <div className="ambient-glow glow-blue"></div>
      </div>

      {/* Main App Container */}
      <div className="app-wrapper">

        {/* Header / Floating Navigation Bar */}
        <header className="navbar-container">
          <div className="floating-nav">
            <a href="#hero" className="nav-logo" onMouseEnter={playHoverSound} onClick={playClickSound}>
              <div className="logo-box">
                <img src={profileImg} alt="Logo" className="nav-logo-img" />
              </div>
            </a>

            <nav className="nav-links">
              <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onMouseEnter={playHoverSound} onClick={playClickSound}>About</a>
              <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onMouseEnter={playHoverSound} onClick={playClickSound}>Projects</a>
              <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onMouseEnter={playHoverSound} onClick={playClickSound}>Skills</a>
              <a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`} onMouseEnter={playHoverSound} onClick={playClickSound}>Experience</a>
              <a href="#impact" className={`nav-link ${activeSection === 'impact' ? 'active' : ''}`} onMouseEnter={playHoverSound} onClick={playClickSound}>Impact</a>
              <span className="nav-divider">|</span>
              <div className="nav-dropdown" onClick={handleDropdownToggle} onMouseEnter={playHoverSound}>
                Socials
                <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onClick={playClickSound}>LinkedIn</a>
                  <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onClick={playClickSound}>Behance</a>
                  <a href="mailto:jeevanantham2002nkl@gmail.com" onMouseEnter={playHoverSound} onClick={playClickSound}>Email</a>
                </div>
              </div>
            </nav>
          </div>

          <a href="#contact" className="launch-btn" onMouseEnter={playHoverSound} onClick={playClickSound}>Get In Touch</a>
        </header>

        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="logo-box">
            <img src={profileImg} alt="Logo" className="nav-logo-img" />
          </div>
          <button className="mobile-menu-btn" aria-label="Toggle Menu" onMouseEnter={playHoverSound} onClick={() => { playSound(350, 'sine', 0.06); setMobileMenuOpen(!mobileMenuOpen); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>

        {/* Mobile Dropdown Navigation */}
        <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#about" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>About</a>
          <a href="#projects" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Projects</a>
          <a href="#skills" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Skills</a>
          <a href="#experience" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Experience</a>
          <a href="#impact" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Impact</a>
          <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>LinkedIn</a>
          <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Behance</a>
          <a href="#contact" className="mobile-cta" onMouseEnter={playHoverSound} onClick={() => { playClickSound(); setMobileMenuOpen(false); }}>Get In Touch</a>
        </div>

        {/* 1️⃣ Landing / Hero Section */}
        <section className="hero-section" id="hero">
          <div className="hero-container">
            <h1 className="hero-name" onMouseEnter={playHoverSound}>
              Hi, I'm <span className="inline-photo-card">
                <span className="photo-wrapper">
                  <img src={profileImg} alt="Jeevanantham" className="inline-profile-img" />
                </span>
                <div className="photo-figma-frame">
                  <span className="photo-figma-badge">Photo</span>
                  <div className="figma-handle handle-tl"></div>
                  <div className="figma-handle handle-tr"></div>
                  <div className="figma-handle handle-bl"></div>
                  <div className="figma-handle handle-br"></div>
                </div>
              </span> Jeevanantham
            </h1>
            <h2 className="hero-title" onMouseEnter={playHoverSound}>UI/UX & Visual Designer</h2>
            <p className="hero-tagline" onMouseEnter={playHoverSound}>Designing clarity from complexity — crafting high-impact enterprise SaaS platforms & scalable design systems.</p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <span>View My Work</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#contact" className="btn btn-secondary" onMouseEnter={playHoverSound} onClick={playClickSound}>Get In Touch</a>
            </div>

            <div className="hero-chips">
              <div className="hero-chip" onMouseEnter={playHoverSound}>
                <span className="chip-highlight">18+</span> Projects
              </div>
              <div className="hero-chip" onMouseEnter={playHoverSound}>
                <span className="chip-highlight">3+ Yrs</span> Exp.
              </div>
              <div className="hero-chip" onMouseEnter={playHoverSound}>
                <span className="pulse-dot"></span> Active Deloitte Contractor
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Trust / Marquee Strip */}
        <div className="marquee-strip">
          <div className="marquee-content">
            <span className="marquee-item"><span className="bullet">•</span> Figma</span>
            <span className="marquee-item"><span className="bullet">•</span> UI/UX Design</span>
            <span className="marquee-item"><span className="bullet">•</span> Design Systems</span>
            <span className="marquee-item"><span className="bullet">•</span> SaaS Dashboards</span>
            <span className="marquee-item"><span className="bullet">•</span> Brand Identity</span>
            <span className="marquee-item"><span className="bullet">•</span> Interaction Design</span>
            <span className="marquee-item"><span className="bullet">•</span> Wireframing</span>
            <span className="marquee-item"><span className="bullet">•</span> Prototyping</span>

            {/* Duplicate for seamless looping */}
            <span className="marquee-item"><span className="bullet">•</span> Figma</span>
            <span className="marquee-item"><span className="bullet">•</span> UI/UX Design</span>
            <span className="marquee-item"><span className="bullet">•</span> Design Systems</span>
            <span className="marquee-item"><span className="bullet">•</span> SaaS Dashboards</span>
            <span className="marquee-item"><span className="bullet">•</span> Brand Identity</span>
            <span className="marquee-item"><span className="bullet">•</span> Interaction Design</span>
            <span className="marquee-item"><span className="bullet">•</span> Wireframing</span>
            <span className="marquee-item"><span className="bullet">•</span> Prototyping</span>
          </div>
        </div>

        {/* 3️⃣ About Me Section */}
        <section className="about-section" id="about">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Design with Purpose</h2>
          </div>

          <div className="about-grid">
            {/* Left Card: Profile Passport */}
            <div className="about-profile-card reveal reveal-slide-right" onMouseEnter={playHoverSound}>
              <div className="profile-badge-active">
                <span className="pulse-dot"></span>
                <span>Active Deloitte Contractor</span>
              </div>
              
              <div className="profile-image-container">
                <div className="profile-image-ring"></div>
                <img src={profileImg} alt="Jeevanantham Jayaraj" className="profile-avatar" />
              </div>

              <div className="profile-meta">
                <h3>Jeevanantham Jayaraj</h3>
                <p className="profile-role">UI/UX & Visual Designer</p>
                <div className="profile-info-pill-container">
                  <span className="profile-pill">📍 Namakkal, India</span>
                  <span className="profile-pill">💼 3+ Years Exp</span>
                </div>
              </div>

              <div className="profile-skills-box">
                <h4>Primary Stack</h4>
                <div className="skill-tags-group">
                  <span className="skill-tag-badge figma" title="Figma">
                    <svg className="tech-logo" viewBox="0 0 12 18" width="12" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <path d="M3 0C1.35 0 0 1.35 0 3C0 4.65 1.35 6 3 6H6V0H3Z" fill="#F24E1E"/>
                      <path d="M3 6C1.35 6 0 7.35 0 9C0 10.65 1.35 12 3 12H6V6H3Z" fill="#A259FF"/>
                      <path d="M3 12C1.35 12 0 13.35 0 15C0 16.65 1.35 18 3 18C4.65 18 6 16.65 6 15V12H3Z" fill="#1ABC9C"/>
                      <path d="M9 6C10.65 6 12 7.35 12 9C12 10.65 10.65 12 9 12C7.35 12 6 10.65 6 9C6 7.35 7.35 6 9 6Z" fill="#0ACF83"/>
                      <path d="M9 0C10.65 0 12 1.35 12 3C12 4.65 10.65 6 9 6H6V0H9Z" fill="#FF7262"/>
                    </svg>
                    Figma
                  </span>
                  
                  <span className="skill-tag-badge adobe-xd" title="Adobe XD">
                    <svg className="tech-logo" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <rect width="24" height="24" rx="4" fill="#2E001F"/>
                      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#FF2BC2" strokeWidth="1.5"/>
                      <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fontFamily="-apple-system, sans-serif" fill="#FF61D5" textAnchor="middle">Xd</text>
                    </svg>
                    Adobe XD
                  </span>
                  
                  <span className="skill-tag-badge illustrator" title="Illustrator">
                    <svg className="tech-logo" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <rect width="24" height="24" rx="4" fill="#261300"/>
                      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#FF9A00" strokeWidth="1.5"/>
                      <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fontFamily="-apple-system, sans-serif" fill="#FFB033" textAnchor="middle">Ai</text>
                    </svg>
                    Illustrator
                  </span>
                  
                  <span className="skill-tag-badge photoshop" title="Photoshop">
                    <svg className="tech-logo" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <rect width="24" height="24" rx="4" fill="#001C2B"/>
                      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#31A8FF" strokeWidth="1.5"/>
                      <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fontFamily="-apple-system, sans-serif" fill="#70C5FF" textAnchor="middle">Ps</text>
                    </svg>
                    Photoshop
                  </span>

                  <span className="skill-tag-badge premiere-pro" title="Premiere Pro">
                    <svg className="tech-logo" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <rect width="24" height="24" rx="4" fill="#14002B"/>
                      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#EA77FF" strokeWidth="1.5"/>
                      <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fontFamily="-apple-system, sans-serif" fill="#F3B3FF" textAnchor="middle">Pr</text>
                    </svg>
                    Premiere Pro
                  </span>

                  <span className="skill-tag-badge indesign" title="InDesign">
                    <svg className="tech-logo" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '2px'}}>
                      <rect width="24" height="24" rx="4" fill="#2B0018"/>
                      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#FF1A8B" strokeWidth="1.5"/>
                      <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fontFamily="-apple-system, sans-serif" fill="#FF70B5" textAnchor="middle">Id</text>
                    </svg>
                    InDesign
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Bio and Core Pillars */}
            <div className="about-content-card reveal reveal-slide-left">
              <div className="about-bio-card">
                <p className="about-lead-text">
                  I am a UI/UX Designer with a <strong>Computer Science Engineering</strong> background, specializing in translating complex enterprise workflows into elegant, functional SaaS dashboards.
                </p>
                <p className="about-body-text">
                  Through my engagement as a Deloitte contractor under The Cloud Company, I have designed and delivered 18+ high-impact digital products. I combine user-centric visual design with a technical engineering mindset, using design tokens and modular systems to bridge design and clean front-end execution.
                </p>
              </div>

              <h4 className="about-subheading">Core Pillars & Value</h4>
              <div className="pillars-container reveal-stagger-container">
                <div className="pillar-item reveal reveal-scale" onMouseEnter={playHoverSound}>
                  <div className="pillar-num">01</div>
                  <div className="pillar-details">
                    <h5>Deloitte Engagement</h5>
                    <p>Designed and scaled 18+ enterprise dashboard projects, delivering solutions that streamline complex data and operational workflows.</p>
                  </div>
                </div>
                
                <div className="pillar-item reveal reveal-scale" onMouseEnter={playHoverSound}>
                  <div className="pillar-num">02</div>
                  <div className="pillar-details">
                    <h5>Scalable Design Systems</h5>
                    <p>Architecting multi-brand design tokens and modular component libraries that ensure consistency and speed up dev cycles.</p>
                  </div>
                </div>

                <div className="pillar-item reveal reveal-scale" onMouseEnter={playHoverSound}>
                  <div className="pillar-num">03</div>
                  <div className="pillar-details">
                    <h5>Interaction & UX Design</h5>
                    <p>Crafting high-fidelity interactive prototypes, user journey flows, and responsive layouts that optimize task efficiency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Design Philosophy block (within the About section) */}
          <div className="about-philosophy-container reveal reveal-slide-up" onMouseEnter={playHoverSound}>
            <div className="philosophy-header">
              <h3 className="philosophy-title">My Design Philosophy</h3>
              <p className="philosophy-subtitle">A structured, engineering-friendly workflow from user discovery to production handoff.</p>
            </div>
            
            <div className="workflow-steps-full">
              <div className="workflow-step-new">
                <div className="step-num-badge">01</div>
                <div className="step-content">
                  <h4>Discover & Frame</h4>
                  <p>Analyzing technical documentation, business objectives, and user workflows to map constraints and scope details.</p>
                </div>
              </div>

              <div className="workflow-step-new">
                <div className="step-num-badge">02</div>
                <div className="step-content">
                  <h4>Wireframe & Map</h4>
                  <p>Constructing interactive user flows and low-fidelity prototypes to test key application layout structures early.</p>
                </div>
              </div>

              <div className="workflow-step-new">
                <div className="step-num-badge">03</div>
                <div className="step-content">
                  <h4>Design & Tokenize</h4>
                  <p>Building cohesive layout frames in Figma integrated with Design Tokens for multi-brand consistency and integrity.</p>
                </div>
              </div>

              <div className="workflow-step-new">
                <div className="step-num-badge">04</div>
                <div className="step-content">
                  <h4>Verify & Handoff</h4>
                  <p>Providing interactive prototype specs, design guidelines, and token maps to guarantee developer alignment.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Selected Work / Projects Section */}
        <section className="projects-section" id="projects">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Projects that made an impact</h2>
          </div>

          <div className="projects-container">
            {/* Featured Project (Big Card) */}
            <div className="project-card featured-project reveal reveal-slide-up" onMouseEnter={playHoverSound} onClick={playClickSound}>
              <div className="project-image-wrapper">
                <div className="project-mockup-bg featured-gradient">
                  <div className="mockup-ui">
                    <div className="mockup-header">
                      <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                      <div className="mockup-search">deloitte-saas-dashboard.internal</div>
                    </div>
                    <div className="mockup-body">
                      <div className="sidebar-mock"></div>
                      <div className="content-mock">
                        <div className="card-row">
                          <div className="card-mock"></div>
                          <div className="card-mock"></div>
                          <div className="card-mock"></div>
                        </div>
                        <div className="chart-mock"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-info">
                <span className="project-tag">Enterprise SaaS / UI/UX Design</span>
                <h3 className="project-title">Deloitte Operations & Data Intelligence Dashboard</h3>
                <p className="project-desc">A unified analytics dashboard that aggregates telemetry, workload allocation, and real-time alerts. Re-architected user flows to reduce task-completion time by 40% and improve developer handoff accuracy.</p>
                <div className="project-tools">
                  <span className="tool-tag">Figma</span>
                  <span className="tool-tag">Design Tokens</span>
                  <span className="tool-tag">Enterprise SaaS</span>
                  <span className="tool-tag">Usability Testing</span>
                </div>
              </div>
            </div>

            {/* Grid of Smaller Projects */}
            <div className="projects-grid reveal-stagger-container">
              {/* Project 1 */}
              <div className="project-card grid-project reveal reveal-slide-up" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="project-image-wrapper">
                  <div className="project-mockup-bg proj-orange-grad">
                    <div className="mockup-circle"></div>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-tag">AI/UX / Interaction Design</span>
                  <h3 className="project-title">AeroSpace AI Copilot</h3>
                  <p className="project-desc">Interactive conversational assistant for technicians to retrieve manuals and telemetry data using Natural Language processing.</p>
                  <div className="project-tools">
                    <span className="tool-tag">Figma</span>
                    <span className="tool-tag">Micro-interactions</span>
                    <span className="tool-tag">AI Interfaces</span>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="project-card grid-project reveal reveal-slide-up" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="project-image-wrapper">
                  <div className="project-mockup-bg proj-blue-grad">
                    <div className="mockup-card-ui"></div>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-tag">Mobile App / Branding</span>
                  <h3 className="project-title">Apex Neobank Mobile App</h3>
                  <p className="project-desc">Complete end-to-end design system, mobile UI/UX, and visual brand identity for a modern consumer neobanking service.</p>
                  <div className="project-tools">
                    <span className="tool-tag">Figma</span>
                    <span className="tool-tag">Illustrator</span>
                    <span className="tool-tag">Mobile UI</span>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="project-card grid-project reveal reveal-slide-up" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="project-image-wrapper">
                  <div className="project-mockup-bg proj-purple-grad">
                    <div className="mockup-lines"></div>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-tag">Design Systems</span>
                  <h3 className="project-title">OmniSystem Library</h3>
                  <p className="project-desc">Scaling multi-brand enterprise platforms with a unified design system of over 200+ reusable Figma components and token architectures.</p>
                  <div className="project-tools">
                    <span className="tool-tag">Figma</span>
                    <span className="tool-tag">Tokens Studio</span>
                    <span className="tool-tag">React Handoff</span>
                  </div>
                </div>
              </div>

              {/* Project 4 */}
              <div className="project-card grid-project reveal reveal-slide-up" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="project-image-wrapper">
                  <div className="project-mockup-bg proj-yellow-grad">
                    <div className="mockup-chart-ui"></div>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-tag">Web Portal / SaaS</span>
                  <h3 className="project-title">HealthTech Patient Portal</h3>
                  <p className="project-desc">A responsive health tracking portal designed with an emphasis on WCAG 2.1 accessibility standards and patient data privacy.</p>
                  <div className="project-tools">
                    <span className="tool-tag">Figma</span>
                    <span className="tool-tag">WCAG 2.1</span>
                    <span className="tool-tag">Responsive Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Skills & Tools Section */}
        <section className="skills-section" id="skills">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">What I bring to your team</h2>
          </div>

          <div className="skills-grid-new reveal-stagger-container">
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">⚡</div>
              <h3>UI/UX Design</h3>
              <p>Creating intuitive user journeys, interactive wireframes, and pixel-perfect high-fidelity interface layouts.</p>
            </div>
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">📐</div>
              <h3>Design Systems</h3>
              <p>Developing scalable design libraries, token frameworks, and comprehensive guidelines for multi-brand platforms.</p>
            </div>
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🎨</div>
              <h3>Visual & Brand Design</h3>
              <p>Establishing unique brand identities, custom vector assets, typography systems, and modern visual guides.</p>
            </div>
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🔧</div>
              <h3>Tools & Software</h3>
              <p>Expert proficiency in Figma, Adobe XD, Photoshop, Illustrator, InDesign, and CSS integration.</p>
            </div>
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">💻</div>
              <h3>Product Types</h3>
              <p>Tailoring designs for responsive Web apps, enterprise SaaS dashboards, mobile interfaces, and patient portals.</p>
            </div>
            <div className="skill-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Bridge developer-designer communication with component specs, Agile coordination, and design-token systems.</p>
            </div>
          </div>
        </section>

        {/* 6️⃣ Experience Section */}
        <section className="experience-section" id="experience">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Career Journey</span>
            <h2 className="section-title">Work & Education Timeline</h2>
          </div>

          <div className="timeline">
            {/* Experience Item */}
            <div className="timeline-item reveal reveal-slide-up">
              <div className="timeline-dot"></div>
              <div className="timeline-date">Jul 2023 - Present</div>
              <div className="timeline-content" onMouseEnter={playHoverSound}>
                <div className="timeline-header">
                  <h3>UI/UX Designer (Deloitte Contractor)</h3>
                  <span className="company-badge">The Cloud Company</span>
                </div>
                <p className="timeline-desc">Leading end-to-end design for complex enterprise SaaS dashboards, platforms, and AI-driven internal software tools.</p>
                <ul className="timeline-bullets">
                  <li>Led UI/UX design for enterprise SaaS platforms, dashboards, and AI-driven applications.</li>
                  <li>Delivered 18+ design projects through Deloitte engagement across multiple product teams.</li>
                  <li>Converted complex requirements into clear user flows, wireframes, and high-fidelity UI.</li>
                  <li>Built design systems and reusable components for consistency and faster development.</li>
                  <li>Collaborated with developers for pixel-perfect implementation and smooth handoff.</li>
                  <li>Used modern tools (including AI where relevant) to speed up design iterations.</li>
                </ul>
              </div>
            </div>

            {/* Education Item */}
            <div className="timeline-item reveal reveal-slide-up">
              <div className="timeline-dot"></div>
              <div className="timeline-date">Graduated 2024</div>
              <div className="timeline-content" onMouseEnter={playHoverSound}>
                <div className="timeline-header">
                  <h3>B.E. Computer Science Engineering</h3>
                  <span className="company-badge">Kongu Engineering College</span>
                </div>
                <p className="timeline-desc">Engineering studies providing a solid technical foundation, helping bridge the gap between design concepts and front-end development implementation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ Key Impact / Highlights Section */}
        <section className="impact-section" id="impact">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Impact</span>
            <h2 className="section-title">Key Impact & Value</h2>
          </div>

          <div className="impact-grid-new reveal-stagger-container">
            <div className="impact-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">18+</span>
              <span className="impact-stat-label">Projects Delivered</span>
              <p>Deploying SaaS platforms and dashboards successfully under tight enterprise requirements.</p>
            </div>
            <div className="impact-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">200+</span>
              <span className="impact-stat-label">Components Built</span>
              <p>Standardizing UI components inside Figma to boost workflow scaling and developer velocity.</p>
            </div>
            <div className="impact-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">40%</span>
              <span className="impact-stat-label">Workflows Simplified</span>
              <p>Reducing user task flow complexities, resulting in shorter product onboarding times.</p>
            </div>
            <div className="impact-card-new reveal reveal-scale" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">5+</span>
              <span className="impact-stat-label">AI Tools Integrated</span>
              <p>Leveraging generative tools and prompt engineering to accelerate design iterations.</p>
            </div>
          </div>
        </section>

        {/* 8️⃣ Contact Section */}
        <section className="contact-section" id="contact">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Let's build something great</h2>
          </div>

          <div className="contact-grid">
            {/* Contact Cards Side */}
            <div className="contact-cards-container reveal reveal-slide-right">
              <a href="mailto:jeevanantham2002nkl@gmail.com" className="contact-card-link" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="contact-card-icon">✉</div>
                <div className="contact-card-text">
                  <span className="contact-card-label">Email</span>
                  <span className="contact-card-value">jeevanantham2002nkl@gmail.com</span>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="contact-card-link" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="contact-card-icon">in</div>
                <div className="contact-card-text">
                  <span className="contact-card-label">LinkedIn</span>
                  <span className="contact-card-value">linkedin.com/in/jeeva-j1426</span>
                </div>
              </a>

              <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="contact-card-link" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="contact-card-icon">Bē</div>
                <div className="contact-card-text">
                  <span className="contact-card-label">Behance</span>
                  <span className="contact-card-value">behance.net/jeevananthamj</span>
                </div>
              </a>

              <a href="tel:+917339042578" className="contact-card-link" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <div className="contact-card-icon">📞</div>
                <div className="contact-card-text">
                  <span className="contact-card-label">Phone</span>
                  <span className="contact-card-value">+91 73390 42578</span>
                </div>
              </a>
            </div>

            {/* Contact Form Side */}
            <div className="contact-form-container reveal reveal-slide-left" onMouseEnter={playHoverSound}>
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="form-name">Name</label>
                  <input type="text" id="form-name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="form-email">Email</label>
                  <input type="email" id="form-email" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="form-message">Message</label>
                  <textarea id="form-message" rows="5" placeholder="Tell me about your project..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary form-submit-btn" onClick={playClickSound}>Send Message</button>
              </form>
            </div>
          </div>
        </section>

        {/* 9️⃣ Footer */}
        <footer className="footer-section">
          <div className="footer-bottom">
            <p>&copy; 2026 Jeevanantham Jayaraj. Namakkal, Tamilnadu, India. All rights reserved.</p>
            <div className="footer-links">
              <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onClick={playClickSound}>Behance</a>
              <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onClick={playClickSound}>LinkedIn</a>
              <a href="mailto:jeevanantham2002nkl@gmail.com" onMouseEnter={playHoverSound} onClick={playClickSound}>Email</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Figma Selection Overlay */}
      <div className="figma-selection-frame" id="figma-frame">
        <span className="figma-badge" id="figma-badge">Frame</span>
        <div className="figma-handle handle-tl"></div>
        <div className="figma-handle handle-tr"></div>
        <div className="figma-handle handle-bl"></div>
        <div className="figma-handle handle-br"></div>
      </div>

      {/* Figma Draggable Floating Chip */}
      <div className="figma-drag-chip" id="figma-chip">Don't move me! 🛑</div>
    </>
  );
}

export default App;
