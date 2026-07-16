import { useState, useEffect, useRef } from 'react';
import './App.css';
import profileImg from './assets/profile.png';

// Paste your Google Apps Script Web App URL below to log every visit directly to a Google Sheet (Excel-compatible)
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz7SPLYZVRHRvK_KZwz9HrgCxGrx1jVzVd6DRzEuiqeJzygNsoeeN5XfqVfDUfD7tnCBQ/exec";



const skillsList = [
  {
    fileName: 'UIUX.json',
    tag: 'Design Core',
    title: 'UI/UX Design',
    desc: 'Crafting intuitive user journeys, wireframes, and pixel-perfect high-fidelity layouts.',
    chips: ['Figma', 'Wireframing', 'User Flows'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="9" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="15" x2="21" y2="15"></line>
      </svg>
    ),
    theme: 'theme-blue'
  },
  {
    fileName: 'System.tokens',
    tag: 'Design Operations',
    title: 'Design Systems',
    desc: 'Developing scalable UI libraries, token frameworks, and multi-brand component standards.',
    chips: ['Tokens Studio', 'Documentation', 'Variables'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    theme: 'theme-lime'
  },
  {
    fileName: 'Brand.svg',
    tag: 'Visual Language',
    title: 'Visual & Brand',
    desc: 'Establishing unique brand identities, custom vector assets, and consistent guidelines.',
    chips: ['Illustrator', 'Branding', 'Vector Art'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="10" r="3"></circle>
        <circle cx="8" cy="14" r="2"></circle>
        <circle cx="16" cy="14" r="2"></circle>
      </svg>
    ),
    theme: 'theme-purple'
  },
  {
    fileName: 'Tools.conf',
    tag: 'Stack & Tools',
    title: 'Tools & Software',
    desc: 'Expert-level proficiency across industry-standard design tools and software packages.',
    chips: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    theme: 'theme-orange'
  },
  {
    fileName: 'Products.tsx',
    tag: 'Target Formats',
    title: 'Product Types',
    desc: 'Designing responsive interfaces for web applications, enterprise SaaS platforms, and mobile apps.',
    chips: ['Web Apps', 'SaaS Dashboards', 'iOS & Android'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    theme: 'theme-cyan'
  },
  {
    fileName: 'Handoff.yaml',
    tag: 'Handoff & Ops',
    title: 'Collaboration',
    desc: 'Bridging developer-designer communication with complete specs and design-token mapping.',
    chips: ['Specs Ready', 'Agile Handoff', 'Tokens Map'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    theme: 'theme-green'
  }
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [formMessage, setFormMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(null);
  const [visitorGeo, setVisitorGeo] = useState('');
  const skillsWrapperRef = useRef(null);

  // Calculate experience duration dynamically from July 2023
  const calculateExperience = () => {
    const startDate = new Date(2023, 6); // July is index 6 (0-indexed)
    const today = new Date();
    
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} mo${months > 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} yr${years > 1 ? 's' : ''}`;
    } else {
      return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
    }
  };


  // Timezone Live Clock
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Visitor Logging & Counting
  useEffect(() => {
    const recordVisit = async () => {
      try {
        // Increment visitor count using the free CounterAPI (scoped specifically to this project)
        const counterRes = await fetch("https://api.counterapi.dev/v1/jeevanantham-portfolio/visits/up");
        if (counterRes.ok) {
          const counterData = await counterRes.json();
          if (counterData && typeof counterData.value === 'number') {
            setVisitorCount(counterData.value);
          }
        }
      } catch (err) {
        console.warn("Counter API failed, skipping count increment:", err);
      }

      let city = "Unknown";
      let country = "Unknown";

      try {
        // Fetch approximate location info (city and country) securely and anonymously
        const geoRes = await fetch("https://ipapi.co/json/");
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          city = geoData.city || "Unknown";
          country = geoData.country_name || "Unknown";
          if (geoData.city && geoData.country_name) {
            setVisitorGeo(`${geoData.city}, ${geoData.country_name}`);
          } else if (geoData.country_name) {
            setVisitorGeo(geoData.country_name);
          }
        }
      } catch (err) {
        console.warn("Geo IP API failed, skipping geolocation lookup:", err);
      }

      // If Google Sheet Web App URL is provided, log the visit details
      if (GOOGLE_SHEET_WEBAPP_URL) {
        try {
          const payload = {
            logType: "visit",
            timestamp: new Date().toISOString(),
            month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            city: city,
            country: country,
            referrer: document.referrer || "Direct",
            device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            userAgent: navigator.userAgent
          };

          await fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors", // Required to bypass CORS restriction of Google Script redirects
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn("Failed to log visit to Google Sheet:", err);
        }
      }
    };

    // Avoid logging on local development to preserve accuracy
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      recordVisit();
    } else {
      // Mock data for local testing
      setVisitorCount(1234);
      setVisitorGeo("Namakkal, India");
    }
  }, []);


  // Scroll-driven active index transition for pinned Skills section
  useEffect(() => {
    const handleSkillsScroll = () => {
      if (!skillsWrapperRef.current) return;
      const rect = skillsWrapperRef.current.getBoundingClientRect();
      const wrapperHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the wrapper
      const start = window.scrollY + rect.top;
      const end = start + wrapperHeight - viewportHeight;
      const currentScroll = window.scrollY;

      if (currentScroll < start) {
        setActiveSkillIndex(0);
      } else if (currentScroll > end) {
        setActiveSkillIndex(skillsList.length - 1);
      } else {
        const progress = (currentScroll - start) / (end - start);
        // Map progress [0, 1] to index [0, skillsList.length - 1]
        const rawIndex = Math.floor(progress * skillsList.length);
        const index = Math.max(0, Math.min(rawIndex, skillsList.length - 1));
        
        setActiveSkillIndex((prevIndex) => {
          // Play click sound only when index changes
          if (prevIndex !== index) {
          }
          return index;
        });
      }
    };

    window.addEventListener('scroll', handleSkillsScroll);
    return () => window.removeEventListener('scroll', handleSkillsScroll);
  }, []);


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
        document.documentElement.classList.add('figma-dragging-active');
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
      document.documentElement.classList.remove('figma-dragging-active');
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
      document.documentElement.classList.add('figma-dragging-active');
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
        document.documentElement.classList.remove('figma-dragging-active');
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

  // 3D Stacking Cards Scroll / Carousel effect
  useEffect(() => {
    const cards = document.querySelectorAll('.skill-card-stack');
    if (!cards.length) return;

    const handleStackScroll = () => {
      const stickyTop = 150; 
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        
        if (rect.top <= stickyTop) {
          const offset = stickyTop - rect.top;
          const cardHeight = rect.height || 380;
          const progress = Math.min(Math.max(offset / cardHeight, 0), 1);
          
          const scale = 1 - progress * 0.06;
          const brightness = 1 - progress * 0.45;
          const translateY = -progress * 20;
          
          card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          card.style.opacity = `${1 - progress * 0.1}`;
          card.style.filter = `brightness(${brightness})`;
        } else {
          card.style.transform = 'scale(1) translateY(0px)';
          card.style.opacity = '1';
          card.style.filter = 'brightness(1)';
        }
      });
    };

    window.addEventListener('scroll', handleStackScroll, { passive: true });
    handleStackScroll();
    
    return () => {
      window.removeEventListener('scroll', handleStackScroll);
    };
  }, []);

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleFormFocus = () => {
    if (formStatus !== 'sending') {
      setFormStatus('idle');
      setFormMessage('');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
    }, 100);

    const form = e.target;
    const name = form.elements['name']?.value?.trim() || "";
    const phone = form.elements['phone']?.value?.trim() || "";
    const email = form.elements['email']?.value?.trim() || "";
    const message = form.elements['message']?.value?.trim() || "";

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormStatus('error');
      setFormMessage('Please enter a valid email address.');
      return;
    }

    setFormStatus('sending');
    setFormMessage('');

    try {
      const response = await fetch("https://formsubmit.co/ajax/jeevanantham2002nkl@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          message: message,
          _subject: "New Message from Portfolio Website",
          _captcha: "false"
        })
      });

      const result = await response.json();

      if (response.ok && result.success === "true") {
        setFormStatus('success');
        setFormMessage('Thank you! Your message has been sent successfully.');
        form.reset();

        // Also log contact submission to Google Sheets
        if (GOOGLE_SHEET_WEBAPP_URL) {
          try {
            await fetch(GOOGLE_SHEET_WEBAPP_URL, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                logType: "contact",
                timestamp: new Date().toISOString(),
                month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                name: name,
                email: email,
                phone: phone,
                message: message
              })
            });
          } catch (sheetErr) {
            console.warn("Failed to log contact form to Google Sheets:", sheetErr);
          }
        }
      } else {
        setFormStatus('error');
        setFormMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setFormStatus('error');
      setFormMessage('Failed to connect to the server. Please try again.');
    }
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
            <a href="#hero" className="nav-logo">
              <div className="logo-box">
                <img src={profileImg} alt="Logo" className="nav-logo-img" />
              </div>
            </a>

            <nav className="nav-links">
              <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>About</a>
              <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>Projects</a>
              <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}>Skills</a>
              <span className="nav-divider">|</span>
              <div className="nav-dropdown" onClick={handleDropdownToggle}>
                Socials
                <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer">Behance</a>
                  <a href="mailto:jeevanantham2002nkl@gmail.com">Email</a>
                </div>
              </div>
            </nav>
          </div>

          <a href="#contact" className="launch-btn">Get In Touch</a>
        </header>

        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="logo-box">
            <img src={profileImg} alt="Logo" className="nav-logo-img" />
          </div>
          <button className="mobile-menu-btn" aria-label="Toggle Menu" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>

        {/* Mobile Dropdown Navigation */}
        <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#about" className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); }}>About</a>
          <a href="#projects" className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); }}>Projects</a>
          <a href="#skills" className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); }}>Skills</a>
          <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); }}>LinkedIn</a>
          <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); }}>Behance</a>
          <a href="#contact" className="mobile-cta" onClick={() => { setMobileMenuOpen(false); }}>Get In Touch</a>
        </div>

        {/* 1️⃣ Landing / Hero Section */}
        <section className="hero-section" id="hero">
          <div className="hero-container">
            <h1 className="hero-name">
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
            <h2 className="hero-title">UI/UX & Visual Designer</h2>
            <p className="hero-tagline">Designing clarity from complexity — crafting high-impact enterprise SaaS platforms & scalable design systems.</p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                <span>View My Work</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>

            <div className="hero-chips">
              <div className="hero-chip">
                <span className="chip-highlight">18+</span> Projects
              </div>
              <div className="hero-chip">
                <span className="chip-highlight">3+ Yrs</span> Exp.
              </div>
              <div className="hero-chip">
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
            <div className="about-profile-card reveal reveal-slide-right">
              <div className="profile-image-container">
                <div className="profile-image-ring"></div>
                <img src={profileImg} alt="Jeevanantham Jayaraj" className="profile-avatar" />
              </div>

              <div className="profile-meta">
                <h3>Jeevanantham Jayaraj</h3>
                <p className="profile-role">UI/UX & Visual Designer</p>
                <div className="profile-info-pill-container">
                  <span className="profile-pill">
                    <svg className="profile-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Namakkal, India
                  </span>
                  <span className="profile-pill">
                    <svg className="profile-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    {calculateExperience()} Exp
                  </span>
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

              <h4 className="about-subheading">Current Engagement</h4>
              <div className="current-work-card">
                <div className="work-card-header">
                  <div className="work-meta">
                    <span className="work-badge-active">Active Engagement</span>
                    <h5 className="work-title">UI/UX Designer (Deloitte Contractor)</h5>
                    <span className="work-company">The Cloud Company / Deloitte</span>
                  </div>
                  <span className="work-duration">Jul 2023 - Present ({calculateExperience()})</span>
                </div>
                <p className="work-desc">
                  Designing complex enterprise SaaS platforms, telemetry dashboards, and internal software utilities. Directly collaborating with engineering teams and stakeholders to build design-to-code pipelines using Design Tokens.
                </p>
                <div className="work-highlights">
                  <div className="highlight-item">
                    <span className="highlight-bullet">✦</span>
                    <span>Delivered 18+ high-impact enterprise dashboard interfaces</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-bullet">✦</span>
                    <span>Standardized design-to-code handoff using cohesive design token models</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-bullet">✦</span>
                    <span>Simplified complex administrative telemetry data flows, reducing user task completion times</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="impact-grid-new reveal reveal-slide-up" style={{marginTop: '3.5rem', transitionDelay: '0.1s'}}>
            <div className="impact-card-new">
              <span className="impact-stat-number">18+</span>
              <span className="impact-stat-label">Projects Delivered</span>
              <p>Deploying SaaS platforms and dashboards successfully under tight enterprise requirements.</p>
            </div>
            <div className="impact-card-new">
              <span className="impact-stat-number">200+</span>
              <span className="impact-stat-label">Components Built</span>
              <p>Standardizing UI components inside Figma to boost workflow scaling and developer velocity.</p>
            </div>
            <div className="impact-card-new">
              <span className="impact-stat-number">40%</span>
              <span className="impact-stat-label">Workflows Simplified</span>
              <p>Reducing user task flow complexities, resulting in shorter product onboarding times.</p>
            </div>
            <div className="impact-card-new">
              <span className="impact-stat-number">5+</span>
              <span className="impact-stat-label">AI Tools Integrated</span>
              <p>Leveraging generative tools and prompt engineering to accelerate design iterations.</p>
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
            <div className="project-card featured-project reveal reveal-slide-up">
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
              <div className="project-card grid-project reveal reveal-slide-up">
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
              <div className="project-card grid-project reveal reveal-slide-up">
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
              <div className="project-card grid-project reveal reveal-slide-up">
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
              <div className="project-card grid-project reveal reveal-slide-up">
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
        <div className="skills-scroll-wrapper" ref={skillsWrapperRef}>
          <section className="skills-section" id="skills">
            <div className="section-header">
              <span className="section-tag">Expertise</span>
              <h2 className="section-title">What I bring to your team</h2>
            </div>

            <div className="simple-canvas-container">
              {/* Animated Figma Multiplayer Cursors */}
              <div className="figma-cursor cursor-blue">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3v15.2l3.8-3.7 3.3 7.8 2.8-1.2-3.3-7.8h5.1z"/></svg>
                <span className="cursor-label">Jeeva</span>
              </div>

              {/* Selected Figma Frame Card */}
              <div className={`figma-frame-card-simple ${skillsList[activeSkillIndex].theme}`}>
                {/* Figma Selection Handles on active frame corners */}
                <span className="corner-handle tl"></span>
                <span className="corner-handle tr"></span>
                <span className="corner-handle bl"></span>
                <span className="corner-handle br"></span>
                
                {/* Floating blue Figma label */}
                <div className="figma-frame-badge">
                  Frame: {skillsList[activeSkillIndex].title}
                </div>

                <div className="frame-card-content">
                  <div className="frame-card-left">
                    <div className="frame-card-icon-badge">
                      {skillsList[activeSkillIndex].icon}
                    </div>
                    <div className="frame-card-tag">{skillsList[activeSkillIndex].tag}</div>
                    <h3 className="frame-card-title">{skillsList[activeSkillIndex].title}</h3>
                  </div>
                  
                  <div className="frame-card-right">
                    <p className="frame-card-desc">{skillsList[activeSkillIndex].desc}</p>
                    <div className="frame-card-chips-group">
                      {skillsList[activeSkillIndex].chips.map((chip, idx) => (
                        <span key={idx} className="frame-chip">{chip}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple slide navigation */}
              <div className="figma-carousel-controls">
                <button 
                  className="figma-nav-btn prev-btn" 
                  onClick={() => {
                    setActiveSkillIndex((prev) => (prev === 0 ? skillsList.length - 1 : prev - 1));
                  }}
                  aria-label="Previous Skill"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                
                <div className="figma-dots-indicator">
                  {skillsList.map((_, index) => (
                    <span
                      key={index}
                      className={`skills-carousel-dot ${activeSkillIndex === index ? 'active' : ''}`}
                      onClick={() => { setActiveSkillIndex(index); }}
                    />
                  ))}
                </div>

                <button 
                  className="figma-nav-btn next-btn" 
                  onClick={() => {
                    setActiveSkillIndex((prev) => (prev === skillsList.length - 1 ? 0 : prev + 1));
                  }}
                  aria-label="Next Skill"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>





        {/* 8️⃣ Contact Section */}
        <section className="contact-section" id="contact">
          <div className="section-header reveal reveal-slide-up">
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Let's build something great</h2>
          </div>

          <div className="contact-grid">
            {/* LEFT COLUMN: Links (4 folder cards + 1 banner) */}
            <div className="contact-links-column reveal reveal-slide-right">
              <div className="links-folder-grid">
                {/* Email Card */}
                <a href="mailto:jeevanantham2002nkl@gmail.com" className="folder-card link-folder-card">
                  <svg className="folder-svg-bg" viewBox="0 0 605 103" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M605 59.8681C605 38.115 587.366 20.4807 565.613 20.4807L84.4537 20.4805C73.3433 20.4805 64.3365 29.4873 64.3365 40.5977C64.3365 51.7082 55.3297 60.7149 44.2192 60.7149H39.076C27.5248 60.7149 18.2138 70.1789 18.402 81.7285C18.5859 93.0151 27.7879 102.068 39.076 102.068H565.613C587.366 102.068 605 84.4341 605 62.681V59.8681Z" fill="currentColor"/>
                    <circle cx="27.5" cy="27.5" r="27.5" transform="matrix(-1 0 0 1 55 0)" fill="currentColor"/>
                  </svg>
                  <div className="folder-icon-circle">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="folder-icon-svg">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="folder-body">
                    <span className="folder-card-label">Email</span>
                    <span className="folder-card-value">jeevanantham2002nkl@gmail.com</span>
                  </div>
                </a>

                {/* LinkedIn Card */}
                <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="folder-card link-folder-card">
                  <svg className="folder-svg-bg" viewBox="0 0 605 103" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M605 59.8681C605 38.115 587.366 20.4807 565.613 20.4807L84.4537 20.4805C73.3433 20.4805 64.3365 29.4873 64.3365 40.5977C64.3365 51.7082 55.3297 60.7149 44.2192 60.7149H39.076C27.5248 60.7149 18.2138 70.1789 18.402 81.7285C18.5859 93.0151 27.7879 102.068 39.076 102.068H565.613C587.366 102.068 605 84.4341 605 62.681V59.8681Z" fill="currentColor"/>
                    <circle cx="27.5" cy="27.5" r="27.5" transform="matrix(-1 0 0 1 55 0)" fill="currentColor"/>
                  </svg>
                  <div className="folder-icon-circle">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="folder-icon-svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div className="folder-body">
                    <span className="folder-card-label">LinkedIn</span>
                    <span className="folder-card-value">jeeva-j1426</span>
                  </div>
                </a>

                {/* Behance Card */}
                <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="folder-card link-folder-card">
                  <svg className="folder-svg-bg" viewBox="0 0 605 103" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M605 59.8681C605 38.115 587.366 20.4807 565.613 20.4807L84.4537 20.4805C73.3433 20.4805 64.3365 29.4873 64.3365 40.5977C64.3365 51.7082 55.3297 60.7149 44.2192 60.7149H39.076C27.5248 60.7149 18.2138 70.1789 18.402 81.7285C18.5859 93.0151 27.7879 102.068 39.076 102.068H565.613C587.366 102.068 605 84.4341 605 62.681V59.8681Z" fill="currentColor"/>
                    <circle cx="27.5" cy="27.5" r="27.5" transform="matrix(-1 0 0 1 55 0)" fill="currentColor"/>
                  </svg>
                  <div className="folder-icon-circle">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="folder-icon-svg">
                      <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"/>
                    </svg>
                  </div>
                  <div className="folder-body">
                    <span className="folder-card-label">Behance</span>
                    <span className="folder-card-value">jeevananthamj</span>
                  </div>
                </a>

                {/* Phone Card */}
                <a href="tel:+917339042578" className="folder-card link-folder-card">
                  <svg className="folder-svg-bg" viewBox="0 0 605 103" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M605 59.8681C605 38.115 587.366 20.4807 565.613 20.4807L84.4537 20.4805C73.3433 20.4805 64.3365 29.4873 64.3365 40.5977C64.3365 51.7082 55.3297 60.7149 44.2192 60.7149H39.076C27.5248 60.7149 18.2138 70.1789 18.402 81.7285C18.5859 93.0151 27.7879 102.068 39.076 102.068H565.613C587.366 102.068 605 84.4341 605 62.681V59.8681Z" fill="currentColor"/>
                    <circle cx="27.5" cy="27.5" r="27.5" transform="matrix(-1 0 0 1 55 0)" fill="currentColor"/>
                  </svg>
                  <div className="folder-icon-circle">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="folder-icon-svg">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="folder-body">
                    <span className="folder-card-label">Phone</span>
                    <span className="folder-card-value">+91 73390 42578</span>
                  </div>
                </a>
              </div>

              {/* Bottom Large Banner Card */}
              <div className="contact-banner-card reveal reveal-slide-up">
                <div className="banner-main-content">
                  <span className="banner-emoji">🚀</span>
                  <span className="banner-text">Let's design and code the future together</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Mail Card (Form) */}
            <div className="contact-form-column reveal reveal-slide-left">
              <div className="folder-card form-folder-card">
                <svg className="folder-svg-bg" viewBox="0 0 566 847" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 75C0 46.2812 23.2812 23 52 23H353.581C380.237 23 402.576 43.1564 405.307 69.672L408.013 95.9379C410.606 121.111 430.944 140.762 456.191 142.489L517.409 146.676C544.744 148.546 565.939 171.305 565.86 198.704L564.149 795.149C564.067 823.81 540.81 847 512.149 847H52C23.2812 847 0 823.719 0 795V75Z" fill="currentColor"/>
                </svg>
                
                <div className="folder-body">
                  <h3 className="form-folder-title">Send a Message</h3>

                  <form className="folder-contact-form" onSubmit={handleContactSubmit}>
                    {formMessage && (
                      <div className={`form-feedback ${formStatus === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                        {formMessage}
                      </div>
                    )}

                    <div className="form-row-dual">
                      <div className="folder-input-wrapper">
                        <input type="text" id="form-name" name="name" placeholder="Name" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                      </div>
                      <div className="folder-input-wrapper">
                        <input type="text" id="form-phone" name="phone" placeholder="Phone" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                      </div>
                    </div>

                    <div className="folder-input-wrapper">
                      <input type="email" id="form-email" name="email" placeholder="Email" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                    </div>

                    <div className="folder-input-wrapper textarea-wrapper">
                      <textarea id="form-message" name="message" rows="3" placeholder="Your Message..." required disabled={formStatus === 'sending'} onFocus={handleFormFocus}></textarea>
                    </div>

                    <button type="submit" className="folder-submit-btn" disabled={formStatus === 'sending'}>
                      {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9️⃣ Footer */}
        <footer className="footer-section">
          <div className="footer-decor-text">JEEVANANTHAM</div>

          <div className="footer-container">
            <div className="footer-main">
              {/* Brand & Bio block */}
              <div className="footer-brand-block">
                <div className="footer-logo">
                  <span>J</span>EEVANANTHAM
                </div>
                <p className="footer-bio">
                  Designing clarity from complexity — crafting high-impact enterprise SaaS platforms & scalable design systems.
                </p>
                <div className="footer-status-badge">
                  <span className="status-dot pulsing"></span>
                  <span>Available for freelance opportunities</span>
                </div>
                {visitorCount !== null && (
                  <div className="footer-visitor-badge">
                    <span className="visitor-dot pulsing"></span>
                    <span>
                      Visitor #{visitorCount.toLocaleString()}
                      {visitorGeo && ` • Connected from ${visitorGeo}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Nav columns */}
              <div className="footer-nav-group">
                <div className="footer-nav-col">
                  <h4 className="footer-col-title">Navigation</h4>
                  <ul className="footer-nav-links">
                    <li><a href="#hero">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#contact">Contact</a></li>
                  </ul>
                </div>

                <div className="footer-nav-col">
                  <h4 className="footer-col-title">Socials</h4>
                  <ul className="footer-nav-links">
                    <li><a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    <li><a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer">Behance</a></li>
                    <li><a href="mailto:jeevanantham2002nkl@gmail.com">Email</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-bar">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} Jeevanantham Jayaraj. All rights reserved.
              </p>
              <button className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
                <span>Back to Top</span>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
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
