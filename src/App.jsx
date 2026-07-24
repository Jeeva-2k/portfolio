import { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaBehance, FaInstagram } from 'react-icons/fa6';
import { FiArrowUpRight, FiMail, FiArrowUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  TbBrandFigma,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeXd,
  TbBrandAdobeIndesign
} from 'react-icons/tb';
import './App.css';
import profileImg from './assets/profile.png';
import heroProfileImg from './assets/hero-profile.png';
import beyondTravelImg from './assets/beyond-travel.png';
import beyondStreetImg from './assets/beyond-street.png';
import beyondWorkspaceImg from './assets/beyond-workspace.png';
import beyondArtImg from './assets/beyond-art.png';

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

const DraggableSkillCard = ({ skill }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    // Rubber band damping
    setPosition({ x: newX * 0.6, y: newY * 0.6 });
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    setPosition({ x: newX * 0.6, y: newY * 0.6 });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className={`draggable-skill-card ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="card-drag-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="9" cy="9" r="1.5"></circle>
          <circle cx="9" cy="15" r="1.5"></circle>
          <circle cx="15" cy="9" r="1.5"></circle>
          <circle cx="15" cy="15" r="1.5"></circle>
        </svg>
      </div>
      <div className="skill-card-top">
        <div className="skill-card-icon-badge">
          {skill.icon}
        </div>
        <span className="skill-card-tag">{skill.tag}</span>
      </div>
      <h3 className="skill-card-title">{skill.title}</h3>
      <p className="skill-card-desc">{skill.desc}</p>
      <div className="skill-card-chips">
        {skill.chips.map((chip, idx) => (
          <span key={idx} className="skill-chip">{chip}</span>
        ))}
      </div>
    </div>
  );
};

function ParallaxCardsCarousel() {
  const scrollerRef = useRef(null);
  const [cardStates, setCardStates] = useState([]);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDraggingMove = useRef(false);

  const carouselData = [
    {
      id: 'travel',
      title: 'Exploration',
      image: beyondTravelImg,
    },
    {
      id: 'street',
      title: 'Photography',
      image: beyondStreetImg,
    },
    {
      id: 'workspace',
      title: 'Deep Work',
      image: beyondWorkspaceImg,
    },
    {
      id: 'art',
      title: 'Creative Lab',
      image: beyondArtImg,
    },
  ];

  const updateParallax = () => {
    if (!scrollerRef.current) return;
    const scroller = scrollerRef.current;
    const scrollerRect = scroller.getBoundingClientRect();
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;

    const cards = scroller.querySelectorAll('.parallax-carousel-card');
    const newStates = [];

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = cardCenter - scrollerCenter;
      
      // Normalized distance (-1 to +1)
      const normalizedDist = Math.min(Math.max(distanceFromCenter / (scrollerRect.width * 0.38), -1.5), 1.5);
      const absDist = Math.abs(normalizedDist);

      // Outer card scale (Center = 1.10x, Sides = 0.88x)
      const scale = 1.10 - Math.min(absDist, 1) * 0.22;

      // Inner image zoom effect (Center card zooms in to 1.35x, Sides stay 1.06x)
      const imgScale = 1.06 + (1 - Math.min(absDist, 1)) * 0.28;

      // Inner image parallax shift (-48px to +48px)
      const parallaxX = -normalizedDist * 48;

      // Opacity fade for non-centered cards
      const opacity = 1 - Math.min(absDist, 1) * 0.30;

      newStates.push({
        scale: scale.toFixed(3),
        imgScale: imgScale.toFixed(3),
        opacity: opacity.toFixed(3),
        parallaxX: parallaxX.toFixed(1),
        isCenter: absDist < 0.35,
      });
    });

    setCardStates(newStates);
  };

  useEffect(() => {
    updateParallax();
    const scroller = scrollerRef.current;
    if (scroller) {
      // Center initial card
      const firstCard = scroller.children[0];
      if (firstCard) {
        const offset = firstCard.offsetLeft - (scroller.clientWidth / 2) + (firstCard.clientWidth / 2);
        scroller.scrollLeft = Math.max(0, offset);
      }
    }
    window.addEventListener('resize', updateParallax);
    return () => window.removeEventListener('resize', updateParallax);
  }, []);

  const handleScroll = () => {
    updateParallax();
  };

  const scrollBy = (offset) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToCard = (index) => {
    if (!scrollerRef.current || isDraggingMove.current) return;
    const cards = scrollerRef.current.querySelectorAll('.parallax-carousel-card');
    const targetCard = cards[index];
    if (targetCard) {
      const scroller = scrollerRef.current;
      const offset = targetCard.offsetLeft - (scroller.clientWidth / 2) + (targetCard.clientWidth / 2);
      scroller.scrollTo({ left: offset, behavior: 'smooth' });
    }
  };

  // Desktop Click & Drag to Scroll
  const handleMouseDown = (e) => {
    if (!scrollerRef.current) return;
    isMouseDown.current = true;
    isDraggingMove.current = false;
    startX.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeftStart.current = scrollerRef.current.scrollLeft;
    scrollerRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseLeaveOrUp = () => {
    isMouseDown.current = false;
    if (scrollerRef.current) {
      scrollerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current || !scrollerRef.current) return;
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDraggingMove.current = true;
    }
    scrollerRef.current.scrollLeft = scrollLeftStart.current - walk;
    updateParallax();
  };

  return (
    <div className="parallax-carousel-container">
      <button 
        className="carousel-arrow-btn prev-btn" 
        onClick={() => scrollBy(-360)}
        aria-label="Previous Slide"
      >
        <FiChevronLeft />
      </button>

      <div 
        className="parallax-carousel-track" 
        ref={scrollerRef} 
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {carouselData.map((item, index) => {
          const state = cardStates[index] || { scale: 0.90, imgScale: 1.06, opacity: 0.7, parallaxX: 0, isCenter: false };
          return (
            <div
              key={item.id}
              className={`parallax-carousel-card ${state.isCenter ? 'active-center' : ''}`}
              style={{
                transform: `scale(${state.scale})`,
                opacity: state.opacity,
              }}
              onClick={() => scrollToCard(index)}
            >
              <div className="parallax-card-media-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="parallax-card-img"
                  style={{
                    transform: `translateX(${state.parallaxX}px) scale(${state.imgScale})`
                  }}
                />
                <div className="parallax-card-gradient-overlay" />
              </div>

              <div className="parallax-card-content">
                <h3 className="parallax-card-title">{item.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="carousel-arrow-btn next-btn" 
        onClick={() => scrollBy(360)}
        aria-label="Next Slide"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

const FooterRotatingWord = () => {
  const words = ["WORK", "BUILD", "DESIGN", "CREATE"];
  const [index, setIndex] = useState(0);
  const [animationState, setAnimationState] = useState('idle');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationState('exiting');
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimationState('entering');
        setTimeout(() => {
          setAnimationState('idle');
        }, 40);
      }, 350);
    }, 2200);

    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="footer-word-slider">
      <span className={`footer-rotating-word ${animationState}`}>
        {words[index]}
      </span>
    </span>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [formMessage, setFormMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(null);
  const [visitorGeo, setVisitorGeo] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
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
            mode: "no-cors",
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

    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      recordVisit();
    } else {
      setVisitorCount(1234);
      setVisitorGeo("Namakkal, India");
    }
  }, []);

  // Sync scroll positions with active navigation links
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 350)) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Figma Hover Frame and Elastic Drag Interaction
  useEffect(() => {
    const targetSelector = '.text-name-styled, .text-yellow-styled, .text-condensed-styled, .text-purple-styled, .text-outline-styled, .header-resume-btn, .header-chat-btn, .dock-item, .brotype-project-card, .inline-photo-card';

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
      if (el.classList.contains('header-resume-btn') || el.classList.contains('header-chat-btn')) return 'Header Button';
      if (el.classList.contains('text-name-styled')) return 'Text (Name)';
      if (el.classList.contains('text-yellow-styled')) return 'Text (Highlight)';
      if (el.classList.contains('text-condensed-styled')) return 'Text (Tag)';
      if (el.classList.contains('text-purple-styled')) return 'Text (Display)';
      if (el.classList.contains('text-outline-styled')) return 'Text (Outline)';
      if (el.classList.contains('dock-item')) return 'Dock Button';
      if (el.classList.contains('brotype-project-card')) return 'Project Card';
      if (el.classList.contains('inline-photo-card')) return 'Resizable Photo';
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
        if (target.classList.contains('inline-photo-card') && e.target.closest('.figma-handle')) {
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
      const maxDrag = 70;

      let finalDx = dx;
      let finalDy = dy;
      if (dist > maxDrag) {
        finalDx = (dx / dist) * maxDrag;
        finalDy = (dy / dist) * maxDrag;
      }

      dragEl.style.transform = `translate(${finalDx}px, ${finalDy}px) rotate(${finalDx * 0.06}deg)`;
      updateFramePosition(dragEl);

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
        if (elToClean) {
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

  // Resizable Photo Frame (About/Hero)
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

      newWidth = Math.max(80, Math.min(300, newWidth));
      newHeight = Math.max(60, Math.min(220, newHeight));

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

  const handleFormFocus = () => {
    if (formStatus !== 'sending') {
      setFormStatus('idle');
      setFormMessage('');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements['name']?.value?.trim() || "";
    const phone = form.elements['phone']?.value?.trim() || "";
    const email = form.elements['email']?.value?.trim() || "";
    const message = form.elements['message']?.value?.trim() || "";

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
      {/* Viewport Glowing Frame */}
      <div className="viewport-border"></div>
      <div className="viewport-border-glow"></div>

      {/* Background grid */}
      <div className="brotype-grid-bg"></div>

      {/* Floating Spotlight Glows */}
      <div className="mouse-spotlight-glow"></div>
      <div className="glow-container">
        <div className="ambient-glow glow-purple-main"></div>
        <div className="ambient-glow glow-blue-second"></div>
      </div>

      <div className="app-wrapper">

        {/* Sticky Header */}
        <header className={`brotype-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-left-placeholder"></div>

          <nav className="header-nav">
            <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>Work</a>
            <a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>Skills</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a>
          </nav>

          <div className="header-actions">
            <a href="#contact" className="header-touch-btn">Get in Touch</a>
          </div>
        </header>

        {/* Floating Bottom Nav Dock */}
        <div className="floating-dock">
          <a href="#about" className={`dock-item ${activeSection === 'about' ? 'active' : ''}`} title="About">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>
          <a href="#projects" className={`dock-item ${activeSection === 'projects' ? 'active' : ''}`} title="Work">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </a>
          <a href="#skills" className={`dock-item ${activeSection === 'skills' ? 'active' : ''}`} title="Skills">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </a>
          <a href="#contact" className={`dock-item ${activeSection === 'contact' ? 'active' : ''}`} title="Contact">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
        </div>

        {/* 1️⃣ Hero Section */}
        <section className="hero-section" id="hero">
          <div className="hero-content">
            <h1 className="expressive-tagline-title">
              <div className="hero-title-row row-1">
                <span className="text-normal im-wrapper">
                  I'm
                  <div className="hero-tag-badge">
                    Hi... <span className="shaking-hand">👋</span>
                  </div>
                </span>
                <span className="inline-photo-card">
                  <span className="photo-wrapper">
                    <img src={heroProfileImg} alt="Jeevanantham" className="inline-profile-img" />
                  </span>
                  <div className="photo-figma-frame">
                    <span className="photo-figma-badge">Photo</span>
                    <div className="figma-handle handle-tl"></div>
                    <div className="figma-handle handle-tr"></div>
                    <div className="figma-handle handle-bl"></div>
                    <div className="figma-handle handle-br"></div>
                  </div>
                </span>
                <span className="text-name-styled">Jeevanantham</span>
              </div>
              <div className="hero-title-row row-2">
                <span className="text-yellow-styled">UI/UX</span>
                <span className="text-purple-styled">
                  Des
                  <span className="dotless-i-wrapper">
                    <span className="i-dot-circle-glow"></span>
                    ı
                  </span>
                  gner
                </span>
              </div>
            </h1>

            <div className="hero-bio-brotype">
              <p className="hero-tagline">
                Designing clarity from complexity — crafting high-impact enterprise SaaS platforms & scalable design systems.
              </p>
              <div className="hero-status-pills">
                <div className="status-pill-item">
                  <span className="status-dot pulsing"></span>
                  <span>Active Deloitte Contractor</span>
                </div>
                <div className="status-pill-item">
                  <span>Namakkal, India</span>
                </div>
                <div className="status-pill-item">
                  <span>{calculateExperience()} Exp</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Marquee Strip */}
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

            {/* Seamless Loop Duplicate */}
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

        {/* 3️⃣ About Section */}
        <section className="about-section" id="about">
          <div className="recent-works-header-container">
            <span className="recent-works-circle circle-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <h2 className="recent-works-title">ABOUT ME</h2>
            <span className="recent-works-circle circle-right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </span>
          </div>

          <div className="about-modern-container">
            {/* Left Column: Cutout Portrait + Organic Blob Backdrop + Social Links */}
            <div className="about-modern-left">
              <div className="about-photo-card">
                <img src={profileImg} alt="Jeevanantham Jayaraj" className="about-cutout-photo" />
              </div>

              <div className="about-left-socials-row">
                <a href="https://www.instagram.com/jeeva.log/" target="_blank" rel="noopener noreferrer" className="about-social-icon-item" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="about-social-icon-item" aria-label="Behance">
                  <FaBehance />
                </a>
                <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="about-social-icon-item" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="mailto:jeevanantham2002nkl@gmail.com" className="about-social-email-item">
                  <FiMail />
                  <span>jeevanantham2002nkl@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Right Column: Title, Subtitle, Tech Categorized List, Big Stats */}
            <div className="about-modern-right">
              <h1 className="about-title-name">Hi, I'm Jeevanantham Jayaraj</h1>
              <p className="about-subtitle-role">
                UI/UX &amp; Visual Designer based in Namakkal, India. Deloitte Contractor at The Cloud Company.
              </p>

              <div className="about-modern-stats">
                <div className="modern-stat-item">
                  <span className="modern-stat-num">+18</span>
                  <span className="modern-stat-lbl">Projects Completed</span>
                </div>
                <div className="modern-stat-item">
                  <span className="modern-stat-num">3+</span>
                  <span className="modern-stat-lbl">Years Experience</span>
                </div>
                <div className="modern-stat-item">
                  <span className="modern-stat-num">+200</span>
                  <span className="modern-stat-lbl">Components Built</span>
                </div>
              </div>

              <div className="about-tools-bar">
                <span className="tools-bar-label">Design Stack</span>
                <div className="tools-icons-row">
                  <div className="tool-icon-chip" title="Figma">
                    <TbBrandFigma className="tool-package-icon figma" />
                    <span>Figma</span>
                  </div>
                  <div className="tool-icon-chip" title="Photoshop">
                    <TbBrandAdobePhotoshop className="tool-package-icon ps" />
                    <span>Photoshop</span>
                  </div>
                  <div className="tool-icon-chip" title="Illustrator">
                    <TbBrandAdobeIllustrator className="tool-package-icon ai" />
                    <span>Illustrator</span>
                  </div>
                  <div className="tool-icon-chip" title="Premiere Pro">
                    <TbBrandAdobePremiere className="tool-package-icon pr" />
                    <span>Premiere Pro</span>
                  </div>
                  <div className="tool-icon-chip" title="Adobe XD">
                    <TbBrandAdobeXd className="tool-package-icon xd" />
                    <span>Adobe XD</span>
                  </div>
                  <div className="tool-icon-chip" title="InDesign">
                    <TbBrandAdobeIndesign className="tool-package-icon id" />
                    <span>InDesign</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Projects Section */}
        <section className="projects-section-brotype" id="projects">
          <div className="recent-works-header-container">
            <span className="recent-works-circle circle-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            <h2 className="recent-works-title">MY WORKS</h2>
            <span className="recent-works-circle circle-right">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </span>
          </div>

          <div className="projects-container-brotype">

            {/* Project 1: Deloitte Dashboard */}
            <div className="brotype-project-card card-deloitte">
              <div className="project-card-left">
                <h3 className="project-card-title">Deloitte</h3>
                <p className="project-card-desc">A unified analytics dashboard that aggregates telemetry, workload allocation, and real-time alerts. Re-architected user flows to reduce task-completion time by 40% and improve developer handoff accuracy.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Design Tokens</div>
                  <div className="meta-col">Enterprise SaaS</div>
                  <div className="meta-col">Usability Testing</div>
                </div>
                <div className="project-arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div className="project-card-right">
                <div className="mockup-ui">
                  <div className="mockup-header">
                    <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                    <div className="mockup-search">deloitte.saas.dashboard</div>
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

            {/* Project 2: Apex Neobank */}
            <div className="brotype-project-card card-neobank">
              <div className="project-card-left">
                <h3 className="project-card-title">Apex Neobank</h3>
                <p className="project-card-desc">Complete end-to-end design system, mobile UI/UX, and visual brand identity for a modern consumer neobanking service.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Illustrator</div>
                  <div className="meta-col">Mobile UI</div>
                </div>
                <div className="project-arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div className="project-card-right">
                <div className="mockup-phone-wrapper">
                  <div className="mockup-phone">
                    <div className="phone-screen">
                      <div className="phone-header">
                        <span className="phone-logo">APEX</span>
                        <span className="phone-battery">94%</span>
                      </div>
                      <div className="phone-balance-card">
                        <span className="balance-label">Balance</span>
                        <span className="balance-amount">$5,234.00</span>
                      </div>
                      <div className="phone-actions-row">
                        <span className="phone-action-btn">Send</span>
                        <span className="phone-action-btn">Request</span>
                        <span className="phone-action-btn">Top Up</span>
                      </div>
                      <div className="phone-chart-area"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 3: AeroSpace AI Copilot */}
            <div className="brotype-project-card card-aerospace">
              <div className="project-card-left">
                <h3 className="project-card-title">AeroSpace AI</h3>
                <p className="project-card-desc">Interactive conversational assistant for technicians to retrieve manuals and telemetry data using Natural Language processing.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Micro-interactions</div>
                  <div className="meta-col">AI Interfaces</div>
                </div>
                <div className="project-arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div className="project-card-right">
                <div className="mockup-phone-wrapper">
                  <div className="mockup-phone dark-theme">
                    <div className="phone-screen">
                      <div className="phone-header">
                        <span className="phone-logo">AeroAI</span>
                        <span className="phone-status">Online</span>
                      </div>
                      <div className="chat-bubble bot">Checking turbine telemetry data...</div>
                      <div className="chat-bubble user">Status on Fan Blade 4?</div>
                      <div className="chat-bubble bot highlighted">All sensors normal. Rotation speed: 2,400 RPM. Temp: 85°C.</div>
                      <div className="chat-input-mock">Send query...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 4: OmniSystem Library */}
            <div className="brotype-project-card card-omnisystem">
              <div className="project-card-left">
                <h3 className="project-card-title">OmniSystem</h3>
                <p className="project-card-desc">Scaling multi-brand enterprise platforms with a unified design system of over 200+ reusable Figma components and token architectures.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Tokens Studio</div>
                  <div className="meta-col">React Handoff</div>
                </div>
                <div className="project-arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div className="project-card-right">
                <div className="mockup-ui tokens-mockup">
                  <div className="tokens-grid">
                    <div className="token-card-ui"><span className="color-preview blue"></span><code>--color-blue: #3b82..</code></div>
                    <div className="token-card-ui"><span className="color-preview teal"></span><code>--color-teal: #1abc..</code></div>
                    <div className="token-card-ui"><span className="color-preview yellow"></span><code>--color-yellow: #ffd0..</code></div>
                    <div className="token-card-ui"><code>--spacing-md: 16px</code></div>
                    <div className="token-card-ui"><code>--border-radius: 12px</code></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 5: HealthTech Patient Portal */}
            <div className="brotype-project-card card-healthtech">
              <div className="project-card-left">
                <h3 className="project-card-title">HealthTech</h3>
                <p className="project-card-desc">A responsive health tracking portal designed with an emphasis on WCAG 2.1 accessibility standards and patient data privacy.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">WCAG 2.1</div>
                  <div className="meta-col">Responsive Design</div>
                </div>
                <div className="project-arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div className="project-card-right">
                <div className="mockup-ui">
                  <div className="mockup-header">
                    <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                    <div className="mockup-search">healthtech.portal.internal</div>
                  </div>
                  <div className="health-content-grid">
                    <div className="health-sidebar-mock"></div>
                    <div className="health-body-mock">
                      <div className="health-stat-pill">Heart Rate: 72 bpm</div>
                      <div className="health-chart-mock"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5️⃣ Interactive Skills Section */}
        <div className="skills-scroll-wrapper" ref={skillsWrapperRef}>
          <section className="skills-section-brotype" id="skills">
            <div className="recent-works-header-container">
              <span className="recent-works-circle circle-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </span>
              <h2 className="recent-works-title">EXPERTISE</h2>
              <span className="recent-works-circle circle-right">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                </svg>
              </span>
            </div>

            <div className="skills-grid-container">
              {skillsList.map((skill, index) => (
                <DraggableSkillCard key={index} skill={skill} />
              ))}
            </div>
          </section>
        </div>

        {/* 6️⃣ Beyond Design / Personal Explorations Section */}
        <section className="offscreen-section" id="stories">
          <div className="recent-works-header-container">
            <span className="recent-works-circle circle-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </span>
            <h2 className="recent-works-title">BEYOND DESIGN</h2>
            <span className="recent-works-circle circle-right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </span>
          </div>

          <ParallaxCardsCarousel />
        </section>

        {/* 7️⃣ Contact Section */}
        <section className="contact-section-brotype" id="contact">
          <div className="recent-works-header-container">
            <span className="recent-works-circle circle-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <h2 className="recent-works-title">CONTACT</h2>
            <span className="recent-works-circle circle-right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
          </div>
          <div className="contact-grid-brotype">
            {/* Left side: Info */}
            <div className="contact-info-column">
              <h2 className="contact-info-title">Get in Touch</h2>
              <div className="info-details-box">
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <a href="mailto:jeevanantham2002nkl@gmail.com" className="detail-value">jeevanantham2002nkl@gmail.com</a>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Social Profiles</span>
                  <div className="contact-social-icons-row">
                    <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="contact-social-icon-btn" aria-label="LinkedIn">
                      <FaLinkedin />
                    </a>
                    <a href="https://www.instagram.com/jeeva.log/" target="_blank" rel="noopener noreferrer" className="contact-social-icon-btn" aria-label="Instagram">
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Message form */}
            <div className="contact-form-column">
              <h2 className="contact-form-title">Send a Message</h2>
              <form className="contact-form-widget" onSubmit={handleContactSubmit}>
                {formMessage && (
                  <div className={`form-feedback ${formStatus === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                    {formMessage}
                  </div>
                )}
                <div className="form-row">
                  <input type="text" name="name" placeholder="Name" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                  <input type="text" name="phone" placeholder="Phone" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                </div>
                <input type="email" name="email" placeholder="Email" required disabled={formStatus === 'sending'} onFocus={handleFormFocus} />
                <textarea name="message" rows="4" placeholder="Your Message..." required disabled={formStatus === 'sending'} onFocus={handleFormFocus}></textarea>
                <button type="submit" className="contact-submit-btn" disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 8️⃣ Footer */}
        <footer className="footer-section-brotype">
          <div className="footer-inner-container">
            <div className="footer-main-grid">
              <div className="footer-left-col">
                <h2 className="footer-big-title">
                  LET'S<br />
                  <FooterRotatingWord /><br />
                  TOGETHER
                </h2>

                <div className="footer-email-row">
                  <FiArrowUpRight className="footer-arrow-icon" />
                  <a href="mailto:jeevanantham2002nkl@gmail.com" className="footer-email-link">jeevanantham2002nkl@gmail.com</a>
                </div>
              </div>

              <div className="footer-right-col">
                <div className="footer-abstract-box">
                  <div className="footer-asterisk-wrapper">
                    <svg className="footer-asterisk-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 5 V95 M5 50 H95 M18.18 18.18 L81.82 81.82 M18.18 81.82 L81.82 18.18" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom-bar">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} Jeevanantham Jayaraj
              </p>
              <div className="footer-social-links">
                <a href="https://www.linkedin.com/in/jeeva-j1426" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaLinkedin className="social-icon" />
                  <span>Linkedin</span>
                </a>
                <a href="https://www.behance.net/jeevananthamj" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaBehance className="social-icon" />
                  <span>Behance</span>
                </a>
                <a href="https://www.instagram.com/jeeva.log/" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaInstagram className="social-icon" />
                  <span>Instagram</span>
                </a>
                <a href="mailto:jeevanantham2002nkl@gmail.com" className="social-link-item">
                  <FiMail className="social-icon" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Back to Top Button */}
      <button
        className={`floating-back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to Top"
      >
        <FiArrowUp />
      </button>

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
