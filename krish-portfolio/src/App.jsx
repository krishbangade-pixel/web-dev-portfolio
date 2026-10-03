import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const HeroScene = lazy(() => import('./HeroScene.jsx'));

const IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=500&auto=format&fit=crop'
];



const Loader = ({ onComplete }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 300); // Keep the image cycle lively without rapid React updates

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 3000); // 3 seconds loader

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <span>KRISH</span>
      <div className="loader-image-container">
        {IMAGES.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt="loader" 
            className={`loader-image ${idx === imageIndex ? 'active' : ''}`} 
          />
        ))}
      </div>
      <span>BANGADE</span>
    </motion.div>
  );
};



const RevealCurtain = () => (
  <motion.div
    className="reveal-curtain"
    initial={{ y: 0 }}
    animate={{ y: '-115vh' }}
    transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
    aria-hidden="true"
  />
);

const Hero = () => {
  const [isVisible, setIsVisible] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const element = heroRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.01 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Krish <br /> Bangade
        </h1>
        <p className="hero-subtitle">
         Web Developer
        </p>
        
      </div>

      <div className="hero-image-container">
        <img 
          src="/profile.jpg" 
          alt="Krish Profile" 
          className="hero-image"
          fetchpriority="high"
        />
      </div>

      <div className="hero-bg-canvas">
        {isVisible && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
      </div>
    </section>
  );
};

const AboutWord = ({ children, progress, range, isRed }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="about-word">
      <span className="about-word-bg">{children}</span>
      <motion.span 
        className="about-word-fg" 
        style={{ opacity, color: isRed ? 'var(--accent-color)' : 'inherit' }}
      >
        {children}
      </motion.span>
    </span>
  );
};

const About = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  const text = "Hey, I’m Krish — a Data Science student, Web Developer, and creative enthusiast. I love turning ideas into functional websites and applications while exploring new technologies. Apart from coding, I’m also passionate about video editing, motion graphics, and creative storytelling.";
  const words = text.split(" ");

  return (
    <section ref={container} className="about-section" id="about">
      <div className="about-sticky">
        <div className="about-content">
          <p className="about-text">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + (1 / words.length);
              const isRed = ["Data", "Science", "Web", "Developer,", "video", "editing,", "motion", "graphics,"].includes(word);
              return (
                <AboutWord key={i} progress={scrollYProgress} range={[start, end]} isRed={isRed}>
                  {word}
                </AboutWord>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

const Websites = () => {
  const listRef = useRef(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const slides = [
    { title: 'AI Code Review', num: '01', link: 'https://ai-code-review-sys.vercel.app/', img: '/ai-code-review.png' },
    { title: 'UpFiles Storage', num: '02', link: 'https://upfiles.vercel.app/', img: '/upfiles.png' },
    { title: 'InsurePro Dash', num: '03', link: 'https://insurepro-beta.vercel.app/login?redirect=%2Fdashboard', img: '/insurepro.png' },
    { title: 'Bloomspace Interio', num: '04', link: 'https://bloomspace-interio-portfolio.vercel.app', img: '/bloomspace.png' },
    { title: 'Phishing Platform', num: '05', link: 'https://phishing-platform-ten.vercel.app/', img: '/phishing.png' },
    { title: 'In-Amigoes Foundation', num: '06', link: 'https://in-amigoes-foundation.vercel.app/', img: '/INAMIGOS.png' },
    { title: 'Car Website', num: '07', link: 'https://car-web-taupe.vercel.app/', img: '/carwebsite.png' }
  ];

  const handleMouseDown = (e) => {
    dragRef.current.isDown = true;
    if (!listRef.current) return;
    listRef.current.style.cursor = 'grabbing';
    listRef.current.style.scrollSnapType = 'none';
    dragRef.current.startX = e.pageX - listRef.current.offsetLeft;
    dragRef.current.scrollLeft = listRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    if (!listRef.current) return;
    listRef.current.style.cursor = 'grab';
    listRef.current.style.scrollSnapType = 'x mandatory';
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDown || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - dragRef.current.startX) * 2; // Scroll-fast multiplier
    listRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
  };

  return (
    <section className="websites-scroller-section" id="work">
      <motion.header 
        className="projects-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="slider-section-title">MY PROJECTS</h2>
      </motion.header>
      <main className="projects-main">
        <ul 
          className="projects-list"
          ref={listRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: 'grab' }}
        >
          {slides.map((slide, i) => (
            <motion.li 
              key={i} 
              className="project-item"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            >
              <article className="project-article">
                <div className="project-header">
                  <h3 className="project-title">
                    <span aria-hidden="true">{slide.num}.&nbsp;</span>{slide.title}
                  </h3>
                  <a 
                    href={slide.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="project-visit-btn"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking button
                  >
                    Visit Website ↗
                  </a>
                </div>
                <div className="project-img-wrapper">
                  <img src={slide.img} alt={slide.title} draggable="false" loading="lazy" style={{ zIndex: 1, position: 'relative' }} />
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </main>
    </section>
  );
};

const Resume = () => {
  const [openPages, setOpenPages] = useState({});

  const togglePage = (index, e) => {
    e.stopPropagation();
    setOpenPages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const closeAll = () => {
    setOpenPages({});
  };

  const anyOpen = Object.values(openPages).some(isOpen => isOpen);

  const resumePages = [
    {
      front: (
        <div className="cv-cover">
          <div className="cv-title">MY<br/>RESUME</div>
          <div className="cv-click">CLICK ME</div>
        </div>
      ),
      back: (
        <div className="cv-page cv-blank">
          <div className="cv-inner-logo">KRISH BANGADE</div>
        </div>
      )
    },
    {
      front: (
        <div className="cv-page">
          <h3>PROFESSIONAL SUMMARY</h3>
          <p>Web Developer and B.Tech Data Science student with hands-on experience building responsive web applications using React.js, JavaScript, HTML5, CSS3, Python, Supabase, and REST APIs. Experienced in frontend development, backend integration, and authentication.</p>
          
          <h3>TECHNICAL SKILLS</h3>
          <ul className="cv-list">
            <li><strong>Frontend:</strong> React.js, HTML5, CSS3, UI Dev</li>
            <li><strong>Backend & APIs:</strong> Node.js, Express.js, REST APIs</li>
            <li><strong>Database:</strong> Supabase, PostgreSQL</li>
            <li><strong>Tools:</strong> Git, GitHub, VS Code, npm, Postman</li>
          </ul>
        </div>
      ),
      back: (
        <div className="cv-page">
          <h3>EXPERIENCE</h3>
          <h4>Web Developer Intern — Innovexis</h4>
          <p className="cv-date">6-Month Internship | Nagpur</p>
          <ul className="cv-list">
            <li>Contributed to frontend development and application functionality.</li>
            <li>Worked with modern web technologies for responsive interfaces.</li>
            <li>Practiced collaborative workflows using Git and GitHub.</li>
          </ul>
          
          <h4>Web Developer Intern — InAmigos</h4>
          <p className="cv-date">2-Week Internship</p>
          <ul className="cv-list">
            <li>Developed and modified web pages using HTML, CSS, JavaScript.</li>
            <li>Practiced responsive design based on requirements.</li>
          </ul>
        </div>
      )
    },
    {
      front: (
        <div className="cv-page">
          <h3>SELECTED PROJECTS</h3>
          <h4>AI Code Review System</h4>
          <p className="cv-stack">React.js | Node.js | OpenAI API | Supabase</p>
          <ul className="cv-list">
            <li>AI-powered code review platform providing automated feedback.</li>
            <li>Built backend APIs for code analysis and review history.</li>
            <li>Implemented metrics: Cyclomatic Complexity, Lines of Code.</li>
          </ul>
          
          <h4>Cloud Media Storage Platform</h4>
          <p className="cv-stack">React.js | Node.js | Supabase Storage</p>
          <ul className="cv-list">
            <li>Platform for uploading, storing, and sharing media files.</li>
            <li>Integrated Supabase Storage for persistent file management.</li>
          </ul>
        </div>
      ),
      back: (
        <div className="cv-page">
          <h3>ADDITIONAL PROJECTS</h3>
          <h4>Manjil Milky — Multiplayer Game</h4>
          <ul className="cv-list">
            <li>Browser-based game with Infinity and Racing modes.</li>
            <li>Added multiplayer functionality and game mechanics.</li>
          </ul>
          <h4>Video Editing Portfolio</h4>
          <ul className="cv-list">
            <li>Personal portfolio to showcase video editing projects.</li>
          </ul>
          <h4>IPL Match Winner Predictor</h4>
          <ul className="cv-list">
            <li>Web app predicting IPL outcomes with React and Python.</li>
          </ul>
        </div>
      )
    },
    {
      front: (
        <div className="cv-page">
          <h3>EDUCATION</h3>
          <h4>B.Tech — Data Science</h4>
          <p>Suryodaya College of Engineering, Nagpur<br/>CGPA: 7.0 / 10</p>
          
          <h4>Higher Secondary — State Board</h4>
          <p>Providence Junior College | 53%</p>
          
          <h4>Secondary — CBSE</h4>
          <p>CBSE Board | 61%</p>
        </div>
      ),
      back: (
        <div className="cv-page">
          <h3>CERTIFICATIONS & ACHIEVEMENTS</h3>
          <ul className="cv-list">
            <li>Web Development and Frontend Development</li>
            <li>React.js and JavaScript Development</li>
            <li>REST API Development and Integration</li>
            <li>Supabase Database and Authentication</li>
            <li>Participated in a 24-hour hackathon to develop a software solution.</li>
            <li>Actively preparing for technical placement exams.</li>
          </ul>
        </div>
      )
    },
    {
      front: (
        <div className="cv-page">
          <h3>CORE STRENGTHS</h3>
          <div className="cv-tags">
            <span>Frontend Dev</span>
            <span>React.js</span>
            <span>REST APIs</span>
            <span>Databases</span>
            <span>Authentication</span>
            <span>Problem Solving</span>
            <span>Git/GitHub</span>
            <span>Full-Stack</span>
            <span>AI Integration</span>
          </div>

          <h3 style={{marginTop: '1.5rem'}}>LINKS</h3>
          <p style={{fontSize: '0.8rem', wordBreak: 'break-all'}}>
            <strong>GitHub:</strong> github.com/krishbangade-pixel<br/>
            <strong>Portfolio:</strong> editor-krish.vercel.app
          </p>
        </div>
      ),
      back: (
        <div className="cv-cover cv-back-cover">
          <div className="cv-inner-logo">KB</div>
        </div>
      )
    }
  ];

  return (
    <section className="resume-section scene" id="resume" onClick={closeAll}>
      <div className={`galeria-book-3d ${anyOpen ? 'book-open' : ''}`}>
        {resumePages.map((page, i) => (
          <div 
            key={i} 
            className={`galeria-book-3d__item ${openPages[i] ? 'is-open' : ''}`}
            style={{ "--i": i }}
            onClick={(e) => togglePage(i, e)}
          >
            <div className="cv-side cv-front">{page.front}</div>
            <div className="cv-side cv-back">{page.back}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
    { title: 'Web Developer', desc: 'Building responsive, modern, and engaging web applications from the ground up.' },
    { title: 'Supabase', desc: 'Leveraging powerful Backend-as-a-Service for scalable databases and real-time features.' },
    { title: 'Backend Developer', desc: 'Architecting robust APIs, server logic, and seamless database integrations.' },
    { title: 'Python', desc: 'Developing data-driven solutions, automation scripts, and analytical tools.' }
  ];

  return (
    <section className="skills">
      <h2 className="skills-title">Skillset</h2>
      <div className="skill-list">
        {skills.map((skill, idx) => (
          <div className="skill-item hover-target" key={idx}>
            <div>0{idx + 1}</div>
            <div style={{ flex: 1, marginLeft: '2rem' }}>{skill.title}</div>
            <div style={{ fontSize: '1rem', maxWidth: '400px', opacity: 0.7 }}>{skill.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer-overlay"></div>
    <div className="footer-content">
      <h2>GET IN TOUCH</h2>
      <p style={{marginTop: '1rem'}}>Or just write: krishbangade@gmail.com</p>
      
      <form className="footer-form">
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label>NAME</label>
            <input type="text" placeholder="Your full name" className="hover-target" />
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label>EMAIL</label>
            <input type="email" placeholder="name@company.com" className="hover-target" />
          </div>
        </div>
        <div className="form-group">
          <label>MESSAGE</label>
          <textarea placeholder="A few words" rows="3" className="hover-target"></textarea>
        </div>
        <button type="button" className="submit-btn hover-target">Send Details ↗</button>
      </form>
    </div>
  </footer>
);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && <RevealCurtain />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ pointerEvents: loading ? 'none' : 'auto', height: loading ? '100vh' : 'auto', overflow: loading ? 'hidden' : 'visible' }}
      >
        <Hero />
        <About />
        <Websites />
        <Resume />
        <Skills />
        <Footer />
      </motion.div>
    </>
  );
}

export default App;
