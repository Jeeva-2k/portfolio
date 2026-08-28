import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaBehance, FaInstagram } from 'react-icons/fa6';
import { FiArrowUpRight, FiMail, FiArrowUp, FiX } from 'react-icons/fi';
import {
  TbBrandFigma,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeXd,
  TbBrandAdobeIndesign,
  TbLayoutGrid,
  TbComponents,
  TbDeviceMobile
} from 'react-icons/tb';
import './App.css';
import idCardImg from './assets/id-card.png';
import heroProfileImg from './assets/hero-profile.png';
import beyondTravelImg from './assets/beyond-travel.png';
import beyondStreetImg from './assets/beyond-street.png';
import beyondWorkspaceImg from './assets/beyond-workspace.png';
import beyondArtImg from './assets/beyond-art.png';
import helpflowCaseStudyImg from './assets/helpflow-case-study.png';
import insightaiCaseStudyImg from './assets/insightai-case-study.png';

// Paste your Google Apps Script Web App URL below to log every visit directly to a Google Sheet (Excel-compatible)
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz7SPLYZVRHRvK_KZwz9HrgCxGrx1jVzVd6DRzEuiqeJzygNsoeeN5XfqVfDUfD7tnCBQ/exec";

const expertiseBadges = [
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    subtitle: 'User Flows • Wireframing • Prototyping',
    icon: <TbLayoutGrid />,
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.35)'
  },
  {
    id: 'design-systems',
    title: 'Design Systems',
    subtitle: 'Tokens • Variables • Component Libraries',
    icon: <TbComponents />,
    accent: '#1abc9c',
    glow: 'rgba(26, 188, 156, 0.35)'
  },
  {
    id: 'products',
    title: 'Digital Products',
    subtitle: 'SaaS Platforms • Mobile Apps • Web UI',
    icon: <TbDeviceMobile />,
    accent: '#ff5c28',
    glow: 'rgba(255, 92, 40, 0.35)'
  },
  {
    id: 'tools',
    title: 'Figma & Creative Suite',
    subtitle: 'Figma • Illustrator • Photoshop • XD',
    icon: <TbBrandFigma />,
    accent: '#ffd043',
    glow: 'rgba(255, 208, 67, 0.35)'
  }
];

const InteractiveIdBadge = () => {
  const [transform, setTransform] = useState({ x: 0, y: 0, rot: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const badgeRef = useRef(null);

  // Physics state ref (runs at 60/120fps synchronized via RAF)
  const physicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastPointer: { x: 0, y: 0, time: 0 }
  });

  const rafRef = useRef(null);

  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;
      const s = physicsRef.current;

      if (!s.isDragging) {
        // Damped harmonic oscillator (Hooke's spring simulation)
        const stiffness = 140;
        const damping = 9.5;

        const ax = -stiffness * s.x - damping * s.vx;
        const ay = -stiffness * s.y - damping * s.vy;

        s.vx += ax * dt;
        s.vy += ay * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Dynamic rotation with pendulum sway
        s.rot = s.x * 0.10 + s.vx * 0.008;

        // Settle when resting
        if (
          Math.abs(s.x) < 0.02 &&
          Math.abs(s.y) < 0.02 &&
          Math.abs(s.vx) < 0.02 &&
          Math.abs(s.vy) < 0.02
        ) {
          s.x = 0;
          s.y = 0;
          s.vx = 0;
          s.vy = 0;
          s.rot = 0;
        }
      } else {
        // Rotation directly follows drag displacement while held
        s.rot = s.x * 0.08;
      }

      setTransform({ x: s.x, y: s.y, rot: s.rot });
      rafRef.current = requestAnimationFrame(updatePhysics);
    };

    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    const s = physicsRef.current;
    s.isDragging = true;
    setIsDragging(true);
    s.vx = 0;
    s.vy = 0;
    s.dragStart = {
      x: e.clientX - s.x,
      y: e.clientY - s.y
    };
    s.lastPointer = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now()
    };

    const onPointerMove = (ev) => {
      if (!s.isDragging) return;

      const rawX = ev.clientX - s.dragStart.x;
      const rawY = ev.clientY - s.dragStart.y;

      // Generous, smooth drag limits without getting stuck
      // Horizontal max ~300px with soft asymptotic curve
      const maxDragX = 320;
      const clampedX = Math.sign(rawX) * maxDragX * (1 - Math.exp(-Math.abs(rawX) / (maxDragX * 0.75)));

      // Vertical: Downwards generous pull up to ~460px, Upwards ~140px
      let clampedY;
      if (rawY > 0) {
        const maxDragYDown = 460;
        clampedY = maxDragYDown * (1 - Math.exp(-rawY / (maxDragYDown * 0.7)));
      } else {
        const maxDragYUp = 140;
        clampedY = -maxDragYUp * (1 - Math.exp(rawY / (maxDragYUp * 0.7)));
      }

      const now = performance.now();
      const dt = Math.max((now - s.lastPointer.time) / 1000, 0.008);
      if (dt > 0 && dt < 0.1) {
        s.vx = (clampedX - s.x) / dt * 0.22;
        s.vy = (clampedY - s.y) / dt * 0.22;
      }
      s.lastPointer = { x: ev.clientX, y: ev.clientY, time: now };

      s.x = clampedX;
      s.y = clampedY;
    };

    const onPointerUp = () => {
      s.isDragging = false;
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // SVG Anchor & Clip Coordinates (viewBox: 280 x 500)
  const anchorX = 140;
  const anchorY = 0;
  const clipX = 140 + transform.x;
  const clipY = 82 + transform.y;
  const strapHalfW = 18; // 36px wide premium lanyard band

  return (
    <div className="id-lanyard-wrapper">
      {/* Background Ambient Lighting behind ID Card */}
      <div
        className="id-card-backdrop-lighting"
        style={{
          transform: `translate3d(${transform.x * 0.45}px, ${transform.y * 0.45}px, 0)`
        }}
      >
        <div className="backdrop-light-primary" />
        <div className="backdrop-light-cyan" />
      </div>

      {/* SVG Synchronized Lanyard Band, Wall Buckle & Swivel Clasp */}
      <svg className="lanyard-strap-svg" viewBox="0 0 280 500">
        <defs>
          <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="25%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="75%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="bandStripe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#cbd5e1" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Wide Lanyard Fabric Band */}
        <path
          d={`M ${anchorX - strapHalfW} ${anchorY} 
             Q ${anchorX - strapHalfW * 0.7 + transform.x * 0.3} ${(anchorY + clipY) * 0.5} ${clipX - 14} ${clipY - 14}
             L ${clipX + 14} ${clipY - 14}
             Q ${anchorX + strapHalfW * 0.7 + transform.x * 0.3} ${(anchorY + clipY) * 0.5} ${anchorX + strapHalfW} ${anchorY}
             Z`}
          fill="url(#bandGrad)"
          opacity="0.96"
        />

        {/* Band Edge Stitching Accent */}
        <path
          d={`M ${anchorX - strapHalfW + 3} ${anchorY} 
             Q ${anchorX - strapHalfW * 0.7 + 3 + transform.x * 0.3} ${(anchorY + clipY) * 0.5} ${clipX - 11} ${clipY - 14}`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
        />
        <path
          d={`M ${anchorX + strapHalfW - 3} ${anchorY} 
             Q ${anchorX + strapHalfW * 0.7 - 3 + transform.x * 0.3} ${(anchorY + clipY) * 0.5} ${clipX + 11} ${clipY - 14}`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Top Anchor Chrome Buckle */}
        <rect x={anchorX - 22} y={anchorY} width="44" height="8" rx="2" fill="url(#chromeMetal)" stroke="#0f172a" strokeWidth="1" />
        <ellipse cx={anchorX} cy={anchorY + 3} rx="12" ry="3" fill="#1e293b" />

        {/* Swivel Clasp & Hook passing through ID card hole */}
        <g transform={`translate(${clipX}, ${clipY - 14})`}>
          <rect x="-16" y="-7" width="32" height="9" rx="2.5" fill="url(#chromeMetal)" stroke="#0f172a" strokeWidth="1" />
          <path d="M -8 2 L -8 16 Q 0 20 8 16 L 8 2 Z" fill="url(#chromeMetal)" stroke="#0f172a" strokeWidth="1" />
          {/* Steel hook looping through slot */}
          <path d="M -4 10 Q 0 24 4 10" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="8" r="2" fill="#0f172a" />
        </g>
      </svg>

      {/* Synchronized Draggable ID Card */}
      <div
        ref={badgeRef}
        className={`interactive-id-card ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${transform.rot}deg)`,
          transition: 'none'
        }}
        onPointerDown={handlePointerDown}
      >
        <div className="id-card-gloss-sheen" />
        <div className="id-card-rim-light" />
        <img
          src={idCardImg}
          alt="Jeevanantham J - UI / UX Designer ID Card"
          className="id-card-image"
          draggable="false"
        />
      </div>

      {/* Dynamic Bottom Contact Ground Shadow */}
      <div
        className="id-card-bottom-floor-shadow"
        style={{
          transform: `translate3d(${transform.x * 0.65}px, ${Math.max(0, transform.y * 0.25)}px, 0) scale(${Math.max(0.65, 1 - transform.y / 350)}, ${Math.max(0.5, 1 - transform.y / 400)})`,
          opacity: Math.max(0.25, 0.85 - transform.y / 300)
        }}
      />
    </div>
  );
};

function ParallaxCardsCarousel() {
  const containerRef = useRef(null);

  const rawCarouselData = [
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

  // Repeat 3 identical sets for 100% seamless resolution-independent marquee scrolling
  const carouselData = [
    ...rawCarouselData.map((d) => ({ ...d, uniqueKey: `set1-${d.id}` })),
    ...rawCarouselData.map((d) => ({ ...d, uniqueKey: `set2-${d.id}` })),
    ...rawCarouselData.map((d) => ({ ...d, uniqueKey: `set3-${d.id}` })),
  ];

  useEffect(() => {
    let animFrameId;

    const updateCenterZoom = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const cards = container.querySelectorAll('.parallax-carousel-card');

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(cardCenter - containerCenter);

        // Normalize distance (0 at center, 1 when 320px away)
        const normDist = Math.min(distanceFromCenter / 320, 1.0);

        // Frame scale: zooms up to 1.10x in center, 0.94x on sides
        const frameScale = 1.10 - normDist * 0.16;

        // Image counter-scale: exact reciprocal so inner image NEVER zooms
        const imgCounterScale = 1.25 / frameScale;

        // Smooth parallax image shift as card moves across screen
        const parallaxX = ((cardCenter - containerCenter) / (containerRect.width * 0.5)) * -40;

        card.style.transform = `scale(${frameScale.toFixed(3)})`;
        if (normDist < 0.35) {
          card.classList.add('active-center');
        } else {
          card.classList.remove('active-center');
        }

        const img = card.querySelector('.parallax-card-img');
        if (img) {
          img.style.transform = `translateX(${parallaxX.toFixed(1)}px) scale(${imgCounterScale.toFixed(3)})`;
        }
      });

      animFrameId = requestAnimationFrame(updateCenterZoom);
    };

    animFrameId = requestAnimationFrame(updateCenterZoom);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="parallax-carousel-container" ref={containerRef}>
      <div className="parallax-carousel-track">
        {carouselData.map((item) => (
          <div key={item.uniqueKey} className="parallax-carousel-card">
            <div className="parallax-card-media-wrapper">
              <img
                src={item.image}
                alt={item.title}
                className="parallax-card-img"
              />
              <div className="parallax-card-gradient-overlay" />
            </div>

            <div className="parallax-card-content">
              <h3 className="parallax-card-title">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
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

const renderProjectPreview = (id) => {
  switch (id) {
    case 'helpflow':
    case 'deloitte':
      return (
        <div className="modal-preview-real-image-container">
          <img
            src={helpflowCaseStudyImg}
            alt="HelpFlow AI Responsive SaaS Platform"
            className="modal-preview-real-image"
          />
        </div>
      );
    case 'insightai':
    case 'neobank':
      return (
        <div className="modal-preview-real-image-container">
          <img
            src={insightaiCaseStudyImg}
            alt="InsightAI Conversational Business Data Platform"
            className="modal-preview-real-image"
          />
        </div>
      );
    case 'aerospace':
      return (
        <div className="modal-preview-phone-stage">
          <div className="mockup-phone dark-theme">
            <div className="phone-screen">
              <div className="phone-header">
                <span className="phone-logo">AeroAI</span>
                <span className="phone-status">Online</span>
              </div>
              <div className="chat-bubble bot">Turbine telemetry online. System ready.</div>
              <div className="chat-bubble user">Status on Fan Blade 4?</div>
              <div className="chat-bubble bot highlighted">All sensors normal. Rotation speed: 2,400 RPM. Temp: 85°C.</div>
              <div className="chat-input-mock">Query technical telemetry...</div>
            </div>
          </div>
        </div>
      );
    case 'omnisystem':
      return (
        <div className="modal-preview-tokens-stage">
          <div className="tokens-grid">
            <div className="token-card-ui"><span className="color-preview blue"></span><code>--color-primary: #3b82f6</code></div>
            <div className="token-card-ui"><span className="color-preview teal"></span><code>--color-success: #1abc9c</code></div>
            <div className="token-card-ui"><span className="color-preview yellow"></span><code>--color-warning: #eab308</code></div>
            <div className="token-card-ui"><span className="color-preview purple"></span><code>--color-accent: #8b5cf6</code></div>
            <div className="token-card-ui"><code>--radius-md: 12px</code></div>
            <div className="token-card-ui"><code>--spacing-lg: 24px</code></div>
          </div>
        </div>
      );
    case 'healthtech':
      return (
        <div className="modal-preview-browser">
          <div className="modal-preview-header">
            <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
            <span className="modal-preview-url">healthtech.internal/patient/vitals-monitor</span>
          </div>
          <div className="health-content-grid modal-health-grid">
            <div className="health-sidebar-mock"></div>
            <div className="health-body-mock">
              <div className="health-stat-pill">Resting Heart Rate: 68 BPM • Normal</div>
              <div className="health-chart-mock"></div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const caseStudyData = {
  helpflow: {
    id: 'helpflow',
    category: 'Responsive SaaS Website',
    title: 'HelpFlow AI',
    tagline: 'A responsive SaaS website for an AI-powered customer support platform.',
    overview: 'HelpFlow helps teams manage support tickets, automate repetitive replies, prioritize urgent issues, and respond faster.',
    problem: 'AI support tools often have many features, which can make the product difficult to understand quickly. Goal: Make HelpFlow’s value clear, simple, and easy to explore.',
    solution: 'Structured around Understand → Explore → Trust → Convert. Shows the product dashboard early, presents one feature at a time with alternating layouts, and focuses copy on benefits rather than technical AI jargon.',
    funnelSteps: ['Understand', 'Explore', 'Trust', 'Convert'],
    features: [
      { title: 'Early Product Dashboard', desc: 'Showed the UI early to immediately build comprehension and user trust.' },
      { title: 'Single-Focus Feature Narrative', desc: 'Presented one feature at a time instead of using a crowded, overwhelming grid.' },
      { title: 'Benefit-Focused Copywriting', desc: 'Crafted clear benefit-driven messaging free of confusing technical jargon.' },
      { title: 'Responsive Multi-Device System', desc: 'Designed consistent user journey across Desktop, Tablet, and Mobile.' }
    ],
    metrics: [
      { num: '4-Step', label: 'UX Funnel', sub: 'Understand → Convert' },
      { num: '3 Sizes', label: 'Responsive', sub: 'Desktop, Tab & Mobile' },
      { num: '100%', label: 'Clarity Focus', sub: 'Benefit-driven UX' }
    ],
    tools: ['Figma', 'Responsive SaaS', 'AI Product UX', 'Information Architecture', 'Design System']
  },
  deloitte: {
    id: 'helpflow',
    category: 'Responsive SaaS Website',
    title: 'HelpFlow AI',
    tagline: 'A responsive SaaS website for an AI-powered customer support platform.',
    overview: 'HelpFlow helps teams manage support tickets, automate repetitive replies, prioritize urgent issues, and respond faster.',
    problem: 'AI support tools often have many features, which can make the product difficult to understand quickly. Goal: Make HelpFlow’s value clear, simple, and easy to explore.',
    solution: 'Structured around Understand → Explore → Trust → Convert. Shows the product dashboard early, presents one feature at a time with alternating layouts, and focuses copy on benefits rather than technical AI jargon.',
    funnelSteps: ['Understand', 'Explore', 'Trust', 'Convert'],
    features: [
      { title: 'Early Product Dashboard', desc: 'Showed the UI early to immediately build comprehension and user trust.' },
      { title: 'Single-Focus Feature Narrative', desc: 'Presented one feature at a time instead of using a crowded, overwhelming grid.' },
      { title: 'Benefit-Focused Copywriting', desc: 'Crafted clear benefit-driven messaging free of confusing technical jargon.' },
      { title: 'Responsive Multi-Device System', desc: 'Designed consistent user journey across Desktop, Tablet, and Mobile.' }
    ],
    metrics: [
      { num: '4-Step', label: 'UX Funnel', sub: 'Understand → Convert' },
      { num: '3 Sizes', label: 'Responsive', sub: 'Desktop, Tab & Mobile' },
      { num: '100%', label: 'Clarity Focus', sub: 'Benefit-driven UX' }
    ],
    tools: ['Figma', 'Responsive SaaS', 'AI Product UX', 'Information Architecture', 'Design System']
  },
  insightai: {
    id: 'insightai',
    category: 'Conversational Business AI',
    title: 'InsightAI',
    tagline: 'Conversational AI for business data exploration and sales intelligence.',
    overview: 'InsightAI helps users explore sales and brand data by asking questions in natural language. Instead of navigating multiple dashboards and filters, users can ask: “Which suppliers are driving growth in Europe?” and get structured, data-backed answers.',
    problem: 'Business users often spend too much time finding the right report, applying filters, and comparing data. Goal: Make data exploration faster and easier without losing trust or transparency.',
    solution: 'Structured around Ask → Analyze → Verify → Reuse. Ask questions naturally, get structured insights, review source data, save useful questions to favourites, and revisit previous chats.',
    funnelSteps: ['Ask', 'Analyze', 'Verify', 'Reuse'],
    features: [
      { title: 'Chat-Driven Exploration', desc: 'Used conversational chat as the main way to explore complex business data.' },
      { title: 'Structured Comparison Tables', desc: 'Showed results in structured data tables for fast, clear comparison.' },
      { title: 'Favourites & Recent Workflows', desc: 'Added favourites and recent chats for repeated analysis and rapid revisit.' },
      { title: 'Dataset & Source Transparency', desc: 'Included sources and dataset details to improve trust and auditability.' },
      { title: 'Enterprise Responsible-AI Guidance', desc: 'Added help and responsible-AI guidance for enterprise compliance.' }
    ],
    metrics: [
      { num: '4-Step', label: 'UX Cycle', sub: 'Ask → Analyze → Reuse' },
      { num: 'Instant', label: 'Natural Q&A', sub: 'No complex filters' },
      { num: '100%', label: 'Traceability', sub: 'Source-backed answers' }
    ],
    tools: ['Figma', 'Conversational AI UX', 'Enterprise BI', 'Data Visualization', 'Design Systems']
  },
  neobank: {
    id: 'insightai',
    category: 'Conversational Business AI',
    title: 'InsightAI',
    tagline: 'Conversational AI for business data exploration and sales intelligence.',
    overview: 'InsightAI helps users explore sales and brand data by asking questions in natural language. Instead of navigating multiple dashboards and filters, users can ask: “Which suppliers are driving growth in Europe?” and get structured, data-backed answers.',
    problem: 'Business users often spend too much time finding the right report, applying filters, and comparing data. Goal: Make data exploration faster and easier without losing trust or transparency.',
    solution: 'Structured around Ask → Analyze → Verify → Reuse. Ask questions naturally, get structured insights, review source data, save useful questions to favourites, and revisit previous chats.',
    funnelSteps: ['Ask', 'Analyze', 'Verify', 'Reuse'],
    features: [
      { title: 'Chat-Driven Exploration', desc: 'Used conversational chat as the main way to explore complex business data.' },
      { title: 'Structured Comparison Tables', desc: 'Showed results in structured data tables for fast, clear comparison.' },
      { title: 'Favourites & Recent Workflows', desc: 'Added favourites and recent chats for repeated analysis and rapid revisit.' },
      { title: 'Dataset & Source Transparency', desc: 'Included sources and dataset details to improve trust and auditability.' },
      { title: 'Enterprise Responsible-AI Guidance', desc: 'Added help and responsible-AI guidance for enterprise compliance.' }
    ],
    metrics: [
      { num: '4-Step', label: 'UX Cycle', sub: 'Ask → Analyze → Reuse' },
      { num: 'Instant', label: 'Natural Q&A', sub: 'No complex filters' },
      { num: '100%', label: 'Traceability', sub: 'Source-backed answers' }
    ],
    tools: ['Figma', 'Conversational AI UX', 'Enterprise BI', 'Data Visualization', 'Design Systems']
  },
  aerospace: {
    id: 'aerospace',
    category: 'Industrial AI Assistant',
    title: 'AeroSpace AI Copilot',
    tagline: 'Conversational AI interface allowing field technicians to query maintenance manuals and live sensor telemetry hands-free.',
    overview: 'An intelligent operational assistant designed for aerospace technicians working on aircraft engines and hangar machinery. Translates complex telemetry queries into concise natural-language answers and schematic overlays.',
    problem: 'Technicians handling heavy machinery could not easily search through thousands of pages of PDF maintenance manuals while diagnosing engine turbines.',
    solution: 'Developed an accessible high-contrast dark AI interface with rapid voice queries, step-by-step repair checklists, and instant schematic visualizers.',
    features: [
      { title: 'Natural Language Diagnostics', desc: 'Query turbine sensor telemetry using conversational phrasing.' },
      { title: 'High-Contrast Dark Theme', desc: 'Optimized for low-light hangars and field operations.' },
      { title: 'Offline Resilience', desc: 'Gracefully caches diagrams and checklists for zero-connectivity zones.' }
    ],
    metrics: [
      { num: '65%', label: 'Faster Search', sub: 'Manual lookup time' },
      { num: '100%', label: 'Safety Guardrails', sub: 'Double confirmation' },
      { num: '0', label: 'False Actions', sub: 'Verified AI outputs' }
    ],
    tools: ['Figma', 'AI Interfaces', 'Micro-Interactions', 'Industrial UX', 'Prototyping']
  },
  omnisystem: {
    id: 'omnisystem',
    category: 'Design Systems Architecture',
    title: 'OmniSystem Multi-Brand Library',
    tagline: 'Scalable design token architecture and 200+ reusable Figma components for enterprise web and mobile products.',
    overview: 'A unified multi-brand design system built to bridge product design and frontend development across multiple digital platforms with automated token pipelines.',
    problem: 'Product teams suffered from duplicate component libraries, inconsistent brand colors, and fragmented styling across four distinct digital apps.',
    solution: 'Architected a 3-tier token structure (Global, Semantic, Component) in Tokens Studio with automated Style Dictionary export for React codebases.',
    features: [
      { title: '3-Tier Token Hierarchy', desc: 'Clean separation of brand colors, semantic roles, and component styles.' },
      { title: '200+ Auto-Layout Components', desc: 'Fully responsive Figma components with dark & light theme variants.' },
      { title: 'Direct React Token Sync', desc: 'Automated JSON export transforming tokens directly into CSS variables.' }
    ],
    metrics: [
      { num: '+200', label: 'Master Components', sub: 'Variants & variables' },
      { num: '75%', label: 'Faster Sprints', sub: 'Pre-built layout blocks' },
      { num: '100%', label: 'Token Mapping', sub: 'Zero style drift' }
    ],
    tools: ['Figma', 'Tokens Studio', 'React Handoff', 'Design Systems', 'WCAG Auditing']
  },
  healthtech: {
    id: 'healthtech',
    category: 'Healthcare & Telehealth',
    title: 'HealthTech Patient & Clinic Portal',
    tagline: 'Accessible healthcare platform for chronic care patients to log biometric vitals and consult clinicians seamlessly.',
    overview: 'An accessible, patient-friendly medical dashboard designed with strict WCAG 2.1 AAA accessibility guidelines, featuring high-legibility typography, clear vital trend charts, and secure telehealth messaging.',
    problem: 'Elderly patients with chronic conditions found existing clinic portals intimidating, cluttered, and inaccessible on mobile devices.',
    solution: 'Crafted a simplified, calming interface with large touch targets, colorblind-safe vital graphs, and single-focus onboarding flows.',
    features: [
      { title: 'Accessible Vitals Tracking', desc: 'High-contrast graphs for blood pressure, pulse, and glucose logs.' },
      { title: 'One-Touch Telehealth Booking', desc: 'Straightforward appointment scheduling with automatic SMS reminders.' },
      { title: 'WCAG 2.1 AAA Compliance', desc: 'Tested and certified for screen readers and high-contrast modes.' }
    ],
    metrics: [
      { num: 'AAA', label: 'Accessibility', sub: 'WCAG 2.1 Certified' },
      { num: '+52%', label: 'Engagement', sub: 'Active patient logging' },
      { num: '100%', label: 'Privacy Compliant', sub: 'Secure patient consent' }
    ],
    tools: ['Figma', 'WCAG 2.1 AAA', 'Responsive UI', 'Healthcare UX', 'Accessibility']
  }
};

function CaseStudyModal({ caseStudy, onClose }) {
  useEffect(() => {
    if (!caseStudy) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [caseStudy, onClose]);

  if (!caseStudy) return null;

  return (
    <div className="case-study-modal-backdrop" onClick={onClose}>
      <div className="case-study-single-screen-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Column: Title, Subtext, Visual Mockup & Impact Metrics */}
        <div className="modal-col-visual">
          
          {/* Header on Left above Image */}
          <div className="modal-left-hero-header">
            <h2 className="modal-case-title">{caseStudy.title}</h2>
            <p className="modal-case-tagline">{caseStudy.tagline}</p>
          </div>

          <div className="modal-preview-stage-container">
            {renderProjectPreview(caseStudy.id)}
          </div>

          <div className="modal-metrics-strip-compact">
            {caseStudy.metrics.map((m, idx) => (
              <div key={idx} className="metric-pill-compact">
                <span className="metric-num-compact">{m.num}</span>
                <span className="metric-lbl-compact">{m.label}</span>
                <span className="metric-sub-compact">{m.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean Editorial & Structured Case Study */}
        <div className="modal-col-content">
          
          {/* Top Bar on Right: Close Button */}
          <div className="modal-content-top-nav right-aligned">
            <h3 className="modal-section-main-heading">CASE STUDY SPECIFICATIONS</h3>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close Case Study" title="Close (Esc)">
              <FiX />
            </button>
          </div>

          {/* Clean Editorial Story Flow (No Clutter) */}
          <div className="modal-story-flow">

            {/* Section 1: The Challenge */}
            <div className="modal-story-block">
              <div className="story-label-row">
                <span className="story-idx-tag red">01</span>
                <span className="story-label-text">THE CHALLENGE</span>
              </div>
              <p className="story-paragraph">{caseStudy.problem}</p>
            </div>

            {/* Section 2: UX Framework & Strategy */}
            <div className="modal-story-block">
              <div className="story-label-row">
                <span className="story-idx-tag green">02</span>
                <span className="story-label-text">UX APPROACH &amp; STRATEGY</span>
              </div>
              {caseStudy.funnelSteps && (
                <div className="strategy-funnel-steps">
                  {caseStudy.funnelSteps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span className={`funnel-step ${sIdx === caseStudy.funnelSteps.length - 1 ? 'active' : ''}`}>{step}</span>
                      {sIdx < caseStudy.funnelSteps.length - 1 && <span className="funnel-arrow">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <p className="story-paragraph">{caseStudy.solution}</p>
            </div>

            {/* Section 3: Key Design Highlights */}
            <div className="modal-story-block">
              <div className="story-label-row">
                <span className="story-idx-tag blue">03</span>
                <span className="story-label-text">KEY DESIGN HIGHLIGHTS</span>
              </div>
              <div className="story-bullets-grid">
                {caseStudy.features.map((feat, idx) => (
                  <div key={idx} className="story-bullet-item">
                    <span className="bullet-dot"></span>
                    <div className="bullet-content">
                      <strong>{feat.title}:</strong> {feat.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Toolstack Row */}
          <div className="modal-story-footer">
            <span className="footer-tools-label">DESIGN STACK:</span>
            <div className="footer-tools-pills">
              {caseStudy.tools.map((t, idx) => (
                <span key={idx} className="story-tool-pill">{t}</span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function App() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentTime, setCurrentTime] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [formMessage, setFormMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(null);
  const [visitorGeo, setVisitorGeo] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

          {/* Connected Architectural Grid Frame */}
          <div className="about-connected-frame">
            <div className="about-grid-main-row">
              {/* Connected Left Cell: Interactive Lanyard ID Card Badge + Social Links */}
              <div className="about-grid-cell about-cell-left">
                <span className="cell-corner-crosshair top-left">+</span>
                <span className="cell-corner-crosshair top-right">+</span>
                <InteractiveIdBadge />

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

              {/* Connected Right Cell: Clean Editorial Story + Bento Stats */}
              <div className="about-grid-cell about-cell-right">
                <span className="cell-corner-crosshair top-right">+</span>
                {/* Header Badge & Title */}
                <div className="about-editorial-header">
                  <div className="about-status-badge">
                    <span className="status-ping-dot"></span>
                    <span>UI/UX &amp; PRODUCT DESIGNER</span>
                  </div>
                  <h3 className="about-hero-heading">
                    Hi, I'm <span className="text-highlight-cyan">Jeevanantham Jayaraj</span>
                  </h3>
                  <p className="about-role-headline">
                    Crafting <span className="text-highlight-purple">scalable design systems</span> &amp; enterprise SaaS products with precision.
                  </p>
                </div>

                {/* Bio Narrative */}
                <p className="about-narrative-text">
                  Specialized in architecting high-impact SaaS platforms and fluid user journeys. Currently a <strong>Deloitte Contractor</strong> at <strong>The Cloud Company</strong>, transforming complex business logic into intuitive, visually refined products.
                </p>

                {/* Bento Metric Cards Grid */}
                <div className="about-bento-metrics">
                  <div className="bento-metric-card">
                    <div className="metric-card-top">
                      <span className="bento-stat-number">+18</span>
                      <span className="metric-badge-tag">Delivered</span>
                    </div>
                    <span className="bento-stat-label">Projects Completed</span>
                    <span className="bento-stat-sub">SaaS &amp; Mobile</span>
                  </div>

                  <div className="bento-metric-card">
                    <div className="metric-card-top">
                      <span className="bento-stat-number">3+</span>
                      <span className="metric-badge-tag">Years</span>
                    </div>
                    <span className="bento-stat-label">Experience</span>
                    <span className="bento-stat-sub">Enterprise UX</span>
                  </div>

                  <div className="bento-metric-card">
                    <div className="metric-card-top">
                      <span className="bento-stat-number">+200</span>
                      <span className="metric-badge-tag">Reusable</span>
                    </div>
                    <span className="bento-stat-label">Components Built</span>
                    <span className="bento-stat-sub">Design Systems</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Bottom Cell: Full-Width Design Tool Stack */}
            <div className="about-grid-cell about-cell-bottom">
              <span className="cell-corner-crosshair bottom-left">+</span>
              <span className="cell-corner-crosshair bottom-right">+</span>
              <div className="toolstrip-label-col">
                <span className="toolstrip-badge">DESIGN ARSENAL</span>
                <span className="toolstrip-caption">Core Production Stack</span>
              </div>
              <div className="toolstrip-badges-row">
                <div className="tool-capsule" title="Figma">
                  <TbBrandFigma className="tool-package-icon figma" />
                  <span>Figma</span>
                </div>
                <div className="tool-capsule" title="Photoshop">
                  <TbBrandAdobePhotoshop className="tool-package-icon ps" />
                  <span>Photoshop</span>
                </div>
                <div className="tool-capsule" title="Illustrator">
                  <TbBrandAdobeIllustrator className="tool-package-icon ai" />
                  <span>Illustrator</span>
                </div>
                <div className="tool-capsule" title="Premiere Pro">
                  <TbBrandAdobePremiere className="tool-package-icon pr" />
                  <span>Premiere Pro</span>
                </div>
                <div className="tool-capsule" title="Adobe XD">
                  <TbBrandAdobeXd className="tool-package-icon xd" />
                  <span>Adobe XD</span>
                </div>
                <div className="tool-capsule" title="InDesign">
                  <TbBrandAdobeIndesign className="tool-package-icon id" />
                  <span>InDesign</span>
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

            {/* Project 1: HelpFlow AI */}
            <div className="brotype-project-card card-helpflow" onClick={() => setSelectedCaseStudy(caseStudyData.helpflow)}>
              <div className="project-card-left">
                <h3 className="project-card-title">HelpFlow AI</h3>
                <p className="project-card-desc">A responsive SaaS website for an AI-powered customer support platform. HelpFlow helps teams manage support tickets, automate repetitive replies, prioritize urgent issues, and respond faster.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Responsive SaaS</div>
                  <div className="meta-col">AI Support</div>
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">UX Strategy</div>
                </div>
                <button
                  className="project-arrow-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedCaseStudy(caseStudyData.helpflow); }}
                  aria-label="View HelpFlow AI Case Study Details"
                  title="View HelpFlow AI Case Study Details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
              </div>
              <div className="project-card-right project-card-image-wrap">
                <img
                  src={helpflowCaseStudyImg}
                  alt="HelpFlow AI Responsive SaaS Platform"
                  className="project-real-thumbnail"
                />
              </div>
            </div>

            {/* Project 2: InsightAI */}
            <div className="brotype-project-card card-insightai" onClick={() => setSelectedCaseStudy(caseStudyData.insightai)}>
              <div className="project-card-left">
                <h3 className="project-card-title">InsightAI</h3>
                <p className="project-card-desc">Conversational AI for business data. InsightAI helps users explore sales and brand data by asking questions in natural language, delivering structured, data-backed answers.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Conversational AI</div>
                  <div className="meta-col">Data Analytics</div>
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Enterprise UX</div>
                </div>
                <button
                  className="project-arrow-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedCaseStudy(caseStudyData.insightai); }}
                  aria-label="View InsightAI Case Study Details"
                  title="View InsightAI Case Study Details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
              </div>
              <div className="project-card-right project-card-image-wrap">
                <img
                  src={insightaiCaseStudyImg}
                  alt="InsightAI Conversational Business Data Platform"
                  className="project-real-thumbnail"
                />
              </div>
            </div>

            {/* Project 3: AeroSpace AI Copilot */}
            <div className="brotype-project-card card-aerospace" onClick={() => setSelectedCaseStudy(caseStudyData.aerospace)}>
              <div className="project-card-left">
                <h3 className="project-card-title">AeroSpace AI</h3>
                <p className="project-card-desc">Interactive conversational assistant for technicians to retrieve manuals and telemetry data using Natural Language processing.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Micro-interactions</div>
                  <div className="meta-col">AI Interfaces</div>
                </div>
                <button
                  className="project-arrow-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedCaseStudy(caseStudyData.aerospace); }}
                  aria-label="View AeroSpace AI Case Study Details"
                  title="View AeroSpace AI Case Study Details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
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
            <div className="brotype-project-card card-omnisystem" onClick={() => setSelectedCaseStudy(caseStudyData.omnisystem)}>
              <div className="project-card-left">
                <h3 className="project-card-title">OmniSystem</h3>
                <p className="project-card-desc">Scaling multi-brand enterprise platforms with a unified design system of over 200+ reusable Figma components and token architectures.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">Tokens Studio</div>
                  <div className="meta-col">React Handoff</div>
                </div>
                <button
                  className="project-arrow-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedCaseStudy(caseStudyData.omnisystem); }}
                  aria-label="View OmniSystem Case Study Details"
                  title="View OmniSystem Case Study Details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
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
            <div className="brotype-project-card card-healthtech" onClick={() => setSelectedCaseStudy(caseStudyData.healthtech)}>
              <div className="project-card-left">
                <h3 className="project-card-title">HealthTech</h3>
                <p className="project-card-desc">A responsive health tracking portal designed with an emphasis on WCAG 2.1 accessibility standards and patient data privacy.</p>
                <div className="project-card-meta">
                  <div className="meta-col">Figma</div>
                  <div className="meta-col">WCAG 2.1</div>
                  <div className="meta-col">Responsive Design</div>
                </div>
                <button
                  className="project-arrow-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedCaseStudy(caseStudyData.healthtech); }}
                  aria-label="View HealthTech Case Study Details"
                  title="View HealthTech Case Study Details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
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

        {/* 5️⃣ Expertise Section */}
        <section className="expertise-section-brotype" id="skills">
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

          <div className="expertise-capsules-wrapper">
            <div className="expertise-capsules-grid">
              {expertiseBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className="expertise-visual-capsule"
                  style={{
                    '--badge-accent': badge.accent,
                    '--badge-glow': badge.glow
                  }}
                >
                  <div className="capsule-icon-orb">
                    {badge.icon}
                  </div>
                  <div className="capsule-content">
                    <h3 className="capsule-heading">{badge.title}</h3>
                    <span className="capsule-subtitle">{badge.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6️⃣ Beyond Design / Personal Explorations Section */}
        <section className="offscreen-section" id="stories">
          <div className="recent-works-header-container">
            <span className="recent-works-circle circle-left" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </span>
            <h2 className="recent-works-title">BEYOND DESIGN</h2>
            <span className="recent-works-circle circle-right" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="0.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
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

      {/* Case Study Details Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </>
  );
}

export default App;
