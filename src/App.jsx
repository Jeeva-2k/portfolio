import { useState, useEffect } from 'react';
import './App.css';

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
                <svg viewBox="0 0 100 100" className="logo-svg">
                  <rect width="100" height="100" rx="24" fill="#ff5c28" />
                  <text x="50" y="65" fontFamily="'Cabinet Grotesk', sans-serif" fontWeight="900" fontSize="52" fill="#000" textAnchor="middle">J</text>
                </svg>
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
            <svg viewBox="0 0 100 100" className="logo-svg">
              <rect width="100" height="100" rx="24" fill="#ff5c28" />
              <text x="50" y="65" fontFamily="'Cabinet Grotesk', sans-serif" fontWeight="900" fontSize="52" fill="#000" textAnchor="middle">J</text>
            </svg>
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
            <div className="hero-badge" onMouseEnter={playHoverSound}>
              <span className="pulse-dot"></span>
              <span>Deloitte Contractor</span>
            </div>
            <h1 className="hero-name" onMouseEnter={playHoverSound}>Jeevanantham Jayaraj</h1>
            <h2 className="hero-title" onMouseEnter={playHoverSound}>UI/UX & Visual Designer</h2>
            <p className="hero-tagline" onMouseEnter={playHoverSound}>Designing clarity from complexity — crafting high-impact enterprise SaaS platforms & scalable design systems.</p>
            
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary" onMouseEnter={playHoverSound} onClick={playClickSound}>
                <span>View My Work</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#contact" className="btn btn-secondary" onMouseEnter={playHoverSound} onClick={playClickSound}>Get In Touch</a>
            </div>
            
            <div className="hero-stats">
              <div className="hero-stat-item" onMouseEnter={playHoverSound}>
                <span className="hero-stat-num">18+</span>
                <span className="hero-stat-label">Projects</span>
              </div>
              <div className="hero-stat-item" onMouseEnter={playHoverSound}>
                <span className="hero-stat-num">3+</span>
                <span className="hero-stat-label">Years Exp.</span>
              </div>
              <div className="hero-stat-item" onMouseEnter={playHoverSound}>
                <span className="hero-stat-num">Active</span>
                <span className="hero-stat-label">Deloitte Contractor</span>
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
          <div className="section-header">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Design with Purpose</h2>
          </div>
          
          <div className="about-grid">
            <div className="about-image-card">
              <div className="image-frame">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" alt="Jeevanantham Jayaraj" className="profile-img" />
                <div className="frame-border"></div>
              </div>
              
              <div className="about-tools-box" onMouseEnter={playHoverSound}>
                <h4>Toolset</h4>
                <div className="about-tools-tags">
                  <span className="tool-tag">Figma</span>
                  <span className="tool-tag">Adobe XD</span>
                  <span className="tool-tag">Photoshop</span>
                  <span className="tool-tag">Illustrator</span>
                  <span className="tool-tag">InDesign</span>
                  <span className="tool-tag">Tokens Studio</span>
                </div>
              </div>
            </div>
            
            <div className="about-text-content">
              <p className="about-lead" onMouseEnter={playHoverSound}>
                I am a UI/UX Designer with 2.5+ years of experience designing enterprise SaaS platforms, dashboards, and modern software applications. Contributed as an external contractor to Deloitte, delivering 18+ projects across enterprise verticals.
              </p>
              <p className="about-desc" onMouseEnter={playHoverSound}>
                I specialize in simplifying complex workflows, building scalable design systems, and bridging the gap between design and front-end implementation to deliver clean, user-centric interfaces.
              </p>
              
              <div className="about-highlights-grid">
                <div className="about-highlight-card" onMouseEnter={playHoverSound}>
                  <div className="highlight-icon">🏢</div>
                  <h3>Deloitte Contractor</h3>
                  <p>Delivered 18+ high-impact enterprise dashboards and apps.</p>
                </div>
                <div className="about-highlight-card" onMouseEnter={playHoverSound}>
                  <div className="highlight-icon">🎨</div>
                  <h3>Full-Spectrum</h3>
                  <p>End-to-end design: UI/UX + Visual + Brand Identity.</p>
                </div>
                <div className="about-highlight-card" onMouseEnter={playHoverSound}>
                  <div className="highlight-icon">🚀</div>
                  <h3>Immediate Joiner</h3>
                  <p>Active and ready to join full-time roles (6 LPA+ budget).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Selected Work / Projects Section */}
        <section className="projects-section" id="projects">
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Projects that made an impact</h2>
          </div>
          
          <div className="projects-container">
            {/* Featured Project (Big Card) */}
            <div className="project-card featured-project" onMouseEnter={playHoverSound} onClick={playClickSound}>
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
            <div className="projects-grid">
              {/* Project 1 */}
              <div className="project-card grid-project" onMouseEnter={playHoverSound} onClick={playClickSound}>
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
              <div className="project-card grid-project" onMouseEnter={playHoverSound} onClick={playClickSound}>
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
              <div className="project-card grid-project" onMouseEnter={playHoverSound} onClick={playClickSound}>
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
              <div className="project-card grid-project" onMouseEnter={playHoverSound} onClick={playClickSound}>
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
          <div className="section-header">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">What I bring to your team</h2>
          </div>
          
          <div className="skills-grid-new">
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">⚡</div>
              <h3>UI/UX Design</h3>
              <p>Creating intuitive user journeys, interactive wireframes, and pixel-perfect high-fidelity interface layouts.</p>
            </div>
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">📐</div>
              <h3>Design Systems</h3>
              <p>Developing scalable design libraries, token frameworks, and comprehensive guidelines for multi-brand platforms.</p>
            </div>
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🎨</div>
              <h3>Visual & Brand Design</h3>
              <p>Establishing unique brand identities, custom vector assets, typography systems, and modern visual guides.</p>
            </div>
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🔧</div>
              <h3>Tools & Software</h3>
              <p>Expert proficiency in Figma, Adobe XD, Photoshop, Illustrator, InDesign, and CSS integration.</p>
            </div>
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">💻</div>
              <h3>Product Types</h3>
              <p>Tailoring designs for responsive Web apps, enterprise SaaS dashboards, mobile interfaces, and patient portals.</p>
            </div>
            <div className="skill-card-new" onMouseEnter={playHoverSound}>
              <div className="skill-card-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Bridge developer-designer communication with component specs, Agile coordination, and design-token systems.</p>
            </div>
          </div>
        </section>

        {/* 6️⃣ Experience Section */}
        <section className="experience-section" id="experience">
          <div className="section-header">
            <span className="section-tag">Career Journey</span>
            <h2 className="section-title">Work & Education Timeline</h2>
          </div>
          
          <div className="timeline">
            {/* Experience Item */}
            <div className="timeline-item">
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
            <div className="timeline-item">
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
          <div className="section-header">
            <span className="section-tag">Impact</span>
            <h2 className="section-title">Key Impact & Value</h2>
          </div>
          
          <div className="impact-grid-new">
            <div className="impact-card-new" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">18+</span>
              <span className="impact-stat-label">Projects Delivered</span>
              <p>Deploying SaaS platforms and dashboards successfully under tight enterprise requirements.</p>
            </div>
            <div className="impact-card-new" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">200+</span>
              <span className="impact-stat-label">Components Built</span>
              <p>Standardizing UI components inside Figma to boost workflow scaling and developer velocity.</p>
            </div>
            <div className="impact-card-new" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">40%</span>
              <span className="impact-stat-label">Workflows Simplified</span>
              <p>Reducing user task flow complexities, resulting in shorter product onboarding times.</p>
            </div>
            <div className="impact-card-new" onMouseEnter={playHoverSound}>
              <span className="impact-stat-number">5+</span>
              <span className="impact-stat-label">AI Tools Integrated</span>
              <p>Leveraging generative tools and prompt engineering to accelerate design iterations.</p>
            </div>
          </div>
        </section>

        {/* 8️⃣ Contact Section */}
        <section className="contact-section" id="contact">
          <div className="section-header">
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Let's build something great</h2>
          </div>
          
          <div className="contact-grid">
            {/* Contact Cards Side */}
            <div className="contact-cards-container">
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
            <div className="contact-form-container" onMouseEnter={playHoverSound}>
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

      {/* Floating Sound Toggle Widget */}
      <div className="sound-toggle-container" onMouseEnter={playHoverSound}>
        <span className="toggle-text">Sound</span>
        <button className={`sound-toggle ${!soundEnabled ? 'off' : ''}`} onClick={() => {
          const nextVal = !soundEnabled;
          setSoundEnabled(nextVal);
          if (nextVal) {
            // Trigger quick click sound to show audio context is active
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(440, ctx.currentTime);
              gain.gain.setValueAtTime(0.015, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.08);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.08);
            } catch (e) {}
          }
        }}>
          <span className="toggle-status">{soundEnabled ? 'On' : 'Off'}</span>
          <div className="spark-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
        </button>
      </div>
    </>
  );
}

export default App;
