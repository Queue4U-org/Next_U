import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import * as THREE from 'three';
import { 
  X, Menu, ChevronDown, Github, FileText, Twitter, 
  Instagram, Linkedin, MessageSquare, CheckCircle2, 
  AlertCircle, Rocket, Network, TrendingUp, ToggleLeft,
  Users, Target, Award, Zap
} from 'lucide-react';

export const LandingPage = () => {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  const phrases = [
    "BECOME THE MAIN CHARACTER IN YOUR LIFE'S ADVENTURE",
    "TRANSFORM YOUR POTENTIAL INTO REALITY",
    "UNLOCK YOUR FULL POTENTIAL WITH OUR PLATFORM",
    "YOUR JOURNEY TO SUCCESS STARTS HERE"
  ];

  // Refs
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Improved typing effect
  useEffect(() => {
    const typeText = () => {
      const currentText = phrases[currentPhraseIndex];
      const shouldDelete = isDeleting;
      const currentLength = currentPhrase.length;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (!shouldDelete && currentLength === currentText.length) {
        // Pause at the end of the phrase
        typingTimeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(50);
        }, 2000);
        return;
      }

      if (shouldDelete && currentLength === 0) {
        setIsDeleting(false);
        setTypingSpeed(100);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }

      const newText = shouldDelete
        ? currentText.substring(0, currentLength - 1)
        : currentText.substring(0, currentLength + 1);

      setCurrentPhrase(newText);

      typingTimeoutRef.current = setTimeout(
        typeText,
        shouldDelete ? typingSpeed / 2 : typingSpeed
      );
    };

    typingTimeoutRef.current = setTimeout(typeText, typingSpeed);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentPhrase, currentPhraseIndex, isDeleting, typingSpeed, phrases]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    const handleMouseEnter = () => cursorRef.current?.classList.add('active');
    const handleMouseLeave = () => cursorRef.current?.classList.remove('active');
    
    document.addEventListener('mousemove', handleMouseMove);
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Scroll effects with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (scrollProgressRef.current) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            scrollProgressRef.current.style.width = `${scrollProgress}%`;
          }
          
          if (navbarRef.current) {
            navbarRef.current.classList.toggle('scrolled', window.scrollY > 50);
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js background with improved performance
  useEffect(() => {
    if (!threeContainerRef.current) return;
    
    const container = threeContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Optimized particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = Math.min(800, window.innerWidth < 768 ? 400 : 800);
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    // Optimized animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    
    animate();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Clean up Three.js resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Optimized particle network
  useEffect(() => {
    if (!particleCanvasRef.current) return;
    
    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    const particleCount = window.innerWidth < 768 ? 30 : 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1
    }));
    
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.size / 4})`;
        ctx.fill();
      });
      
      // Optimized connection drawing
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    const timer = setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!submitButton) return;
    
    const originalText = submitButton.textContent;
    submitButton.innerHTML = 'PROCESSING...';
    submitButton.setAttribute('disabled', 'true');
    
    try {
      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const password = formData.get('password')?.toString() || '';
      
      // Validation
      if (!name || !email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Thank you for signing up! We will contact you soon.', 'success');
      setShowModal(false);
      form.reset();
      setLocation('/home');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'An error occurred', 'error');
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.removeAttribute('disabled');
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = navbarRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateToHome = () => {
    setLocation('/home');
  };

  return (
    <div className="landing-page">
      {/* Background Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Custom Cursor */}
      <div className="custom-cursor" ref={cursorRef}></div>

      {/* Scroll Progress */}
      <div className="scroll-progress" ref={scrollProgressRef}></div>

      {/* Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loader-circle"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        className="navbar"
        ref={navbarRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <a href="#" className="logo">NEXT_U</a>
        <div className="nav-controls">
          <button 
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {['features', 'get-started', 'about', 'contact'].map((link) => (
            <li key={link}>
              <a 
                href={`#${link}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  scrollToSection(link);
                }}
              >
                {link.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="threejs-container" ref={threeContainerRef}></div>
        <canvas id="particleNetwork" ref={particleCanvasRef}></canvas>
        
        <motion.h1 
          className="title animated-gradient-text"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          NEXT_<span className="underscore" aria-hidden="true"></span>U
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {currentPhrase}
        </motion.p>
        
        <motion.button 
          className="cta-button"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          onClick={navigateToHome}
        >
          EXPLORE NOW
        </motion.button>
        
        <motion.button 
          className="scroll-down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={() => scrollToSection('features')}
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">KEY FEATURES</h2>
        <div className="features-grid">
          {[
            {
              icon: <Rocket size={48} />,
              title: "Rapid Growth",
              description: "Accelerate your personal development with our AI-powered growth algorithms."
            },
            {
              icon: <Network size={48} />,
              title: "Smart Network",
              description: "Connect with like-minded individuals and mentors for your success journey."
            },
            {
              icon: <TrendingUp size={48} />,
              title: "Progress Tracking",
              description: "Visualize your improvement with real-time analytics and adaptive goals."
            }
          ].map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="feature-card"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="action-buttons">
          <motion.button 
            className="action-button github"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://github.com/Queue4U-org/Next_U', '_blank')}
          >
            <Github size={20} /> GitHub Repo
          </motion.button>
          <motion.button 
            className="action-button ppt"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://nextu.my.canva.site/', '_blank')}
          >
            <FileText size={20} /> See PPT
          </motion.button>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-started" id="get-started">
        <h2 className="section-title">GET STARTED</h2>
        <div className="timeline">
          <div className="timeline-line"></div>
          <div className="steps">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Set up your personalized account in just a few minutes. Tell us about your goals.",
                action: "Get Started"
              },
              {
                step: 2,
                title: "Take the Assessment",
                description: "Our AI will analyze your current skills and recommend the perfect starting point.",
                action: "Take Assessment"
              },
              {
                step: 3,
                title: "Begin Your Adventure",
                description: "Dive into your customized learning path and start transforming your life today.",
                action: "Start Learning"
              }
            ].map((step, index) => (
              <motion.div 
                key={step.step}
                className="step"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="step-marker">{step.step}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <button 
                    className="action-button" 
                    onClick={() => setShowModal(true)}
                  >
                    {step.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.button 
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
        >
          START YOUR JOURNEY
        </motion.button>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-text">
            <h2 className="about-heading">Transforming Lives Through Personal Growth</h2>
            <p className="about-description">
              NEXT_U is more than just a platform – it's a movement dedicated to helping individuals unlock their full potential. 
              We combine cutting-edge technology with proven personal development methodologies to create a unique growth experience.
            </p>
            <p className="about-description mt-4">
              Our AI-driven approach adapts to your personal journey, providing customized challenges, real-time feedback, and 
              measurable progress tracking to ensure you're always moving forward on your path to success.
            </p>
            
            <div className="about-stats">
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="stat-number">50+</div>
                <div className="stat-label">Expert Mentors</div>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </motion.div>
            </div>
          </div>
          
          <div className="about-image">
            <div className="about-image-grid">
              <motion.div 
                className="about-image-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                  alt="Team collaboration"
                  className="rounded-lg"
                />
              </motion.div>
              <motion.div 
                className="about-image-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                  alt="Learning together"
                  className="rounded-lg"
                />
              </motion.div>
              <motion.div 
                className="about-image-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" 
                  alt="Personal achievement"
                  className="rounded-lg"
                />
              </motion.div>
              <motion.div 
                className="about-image-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" 
                  alt="Success celebration"
                  className="rounded-lg"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4">
        <h2 className="section-title">CONNECT WITH US</h2>
        <ul className="social-links">
          {[
            { icon: <Twitter size={24} />, label: "Twitter", url: "#" },
            { icon: <Instagram size={24} />, label: "Instagram", url: "#" },
            { icon: <Linkedin size={24} />, label: "LinkedIn", url: "#" },
            { icon: <MessageSquare size={24} />, label: "Discord", url: "#" }
          ].map((social) => (
            <li key={social.label}>
              <a 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={social.label}
                className="hover:text-blue-400 transition-colors"
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
        
        <motion.button 
          className="action-button google-form mt-8"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://forms.gle/AKJpJoM8nd2pnT8R7', '_blank')}
        >
          <ToggleLeft size={20} /> Connect Via Google Form
        </motion.button>
        
        <p className="copyright mt-8">© {new Date().getFullYear()} NEXT_U. All rights reserved.</p>
      </footer>

      {/* Signup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-modal"
                aria-label="Close modal"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
              <h2 className="section-title">START YOUR JOURNEY</h2>
              <form onSubmit={handleSubmit} noValidate>
                {[
                  { id: 'name', label: 'Full Name', type: 'text' },
                  { id: 'email', label: 'Email', type: 'email' },
                  { id: 'password', label: 'Password', type: 'password' }
                ].map((field) => (
                  <div key={field.id} className="form-group">
                    <label htmlFor={field.id}>{field.label}</label>
                    <input 
                      type={field.type} 
                      id={field.id} 
                      name={field.id} 
                      required 
                      aria-required="true" 
                      minLength={field.id === 'password' ? 8 : undefined}
                    />
                  </div>
                ))}
                <button type="submit" className="cta-button w-full mt-6">SIGN UP</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`toast ${toast.type}`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            role="alert"
          >
            {toast.type === 'success' ? 
              <CheckCircle2 size={20} /> :
              <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
