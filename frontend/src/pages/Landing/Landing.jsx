import React, { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion';
import {
  HiMenuAlt3, HiX, HiChevronDown
} from 'react-icons/hi';
import {
  HiOutlineCommandLine, HiOutlineDocumentMagnifyingGlass,
  HiOutlineServerStack, HiOutlineCpuChip, HiOutlineBolt,
  HiOutlineShieldCheck, HiOutlineCircleStack, HiOutlineArrowPath,
  HiOutlineCodeBracket, HiOutlineCube, HiOutlineChartBar,
  HiOutlineArrowRight, HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import brandLogo from "../../assets/Brand logo.png";
import heroVideo from "../../assets/vedio/graph.mp4";
import './Landing.scss';

// Image imports for blog section
import realTimeCodeFlow from "../../assets/Insights-Images/Real-Time.png";
import developerExperience from "../../assets/Insights-Images/Developer.png";
import codeToCloud from "../../assets/Insights-Images/Unified-Code.png";
import multiAiFailover from "../../assets/Insights-Images/Multi-AI.png";
import decisionMemory from "../../assets/Insights-Images/Decision.png";
import scalableArchitecture from "../../assets/Insights-Images/Scalable.png";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Custom Cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Docs', to: '/docs', isInternal: true },
    { name: 'Products', to: 'features' },
    { name: 'Pricing', to: 'pricing' },
    { name: 'Resources', to: 'blog' },
    { name: 'Partners', to: 'how-it-works' },
    { name: 'Why CogniCode', to: 'faq' },
  ];

  const blogPosts = [
    {
      title: "Real-Time Code Flow Visualization",
      desc: "Visualize your code execution in real-time with intelligent flow tracking, helping developers debug faster and understand complex logic effortlessly.",
      image: realTimeCodeFlow
    },
    {
      title: "Developer Experience Enhancement",
      desc: "Enhance productivity with a streamlined development environment powered by AI-assisted coding, instant feedback, and optimized workflows.",
      image: developerExperience
    },
    {
      title: "Unified Code-to-Cloud Workflow",
      desc: "Seamlessly connect your development process to deployment with an integrated workflow that eliminates manual steps and accelerates delivery.",
      image: codeToCloud
    },
    {
      title: "Multi-AI Failover System",
      desc: "Ensure uninterrupted AI assistance with intelligent failover between multiple models, maintaining reliability and consistent performance.",
      image: multiAiFailover
    },
    {
      title: "Decision Memory System",
      desc: "Track and retain architectural decisions with AI-powered memory, enabling smarter recommendations and better long-term project consistency.",
      image: decisionMemory
    },
    {
      title: "Scalable Architecture Suggestions",
      desc: "Receive AI-driven architecture recommendations that adapt to your project’s scale, ensuring performance, reliability, and future growth.",
      image: scalableArchitecture
    }
  ];
  const infiniteBlogPosts = [...blogPosts, ...blogPosts];

  return (
    <div className="landing-page">
      {/* Custom Cursor Glow */}
      <motion.div
        className="landing-page__cursor-glow"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />

      <motion.div className="landing-page__scroll-progress" style={{ scaleX }} />

      <header className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__container">
          <RouterLink to="/" className="landing-nav__logo">
            <img src={brandLogo} alt="COGNICODE Logo" />
            <span className="landing-nav__logo-text">COGNICODE</span>
          </RouterLink>

          <nav className="landing-nav__menu">
            {navLinks.map((link, idx) => (
              <div key={idx} className="landing-nav__item">
                {link.isInternal ? (
                  <RouterLink to={link.to} className="landing-nav__link">
                    {link.name}
                  </RouterLink>
                ) : (
                  <ScrollLink
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    className="landing-nav__link"
                  >
                    {link.name}
                  </ScrollLink>
                )}
              </div>
            ))}
          </nav>

          <div className="landing-nav__actions">
            <RouterLink to="/login" className="landing-nav__login-btn mono">LOGIN</RouterLink>
            {user ? (
              <RouterLink to="/dashboard" className="landing-nav__btn sharp">CONSOLE</RouterLink>
            ) : (
              <RouterLink to="/register" className="landing-nav__btn sharp">SIGN UP</RouterLink>
            )}
          </div>

          <button className="landing-nav__toggle" onClick={() => setMobileMenuOpen(true)}>
            <HiMenuAlt3 />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="landing-mobile-overlay"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="landing-mobile-panel"
            >
              <div className="landing-mobile-panel__header">
                <span className="landing-nav__logo-text">COGNICODE</span>
                <button onClick={() => setMobileMenuOpen(false)}><HiX /></button>
              </div>
              <div className="landing-mobile-panel__content">
                {navLinks.map((link) => (
                  link.isInternal ? (
                    <RouterLink key={link.to} to={link.to} className="landing-mobile-panel__link" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </RouterLink>
                  ) : (
                    <ScrollLink key={link.to} to={link.to} smooth={true} duration={500} onClick={() => setMobileMenuOpen(false)} className="landing-mobile-panel__link">
                      {link.name}
                    </ScrollLink>
                  )
                ))}
                <div className="landing-mobile-panel__actions">
                  <RouterLink to="/login" className="landing-mobile-panel__btn landing-mobile-panel__btn--secondary" onClick={() => setMobileMenuOpen(false)}>LOGIN</RouterLink>
                  <RouterLink to="/register" className="landing-mobile-panel__btn landing-mobile-panel__btn--primary" onClick={() => setMobileMenuOpen(false)}>SIGN UP FOR FREE</RouterLink>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="landing-hero">
        <div className="landing-hero__bg">
          <div className="landing-hero__grid" />
          <div className="landing-hero__globe-container">
            <div className="landing-hero__globe" />
            <div className="landing-hero__globe-glow" />
          </div>
        </div>

        <div className="landing-hero__container">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="landing-hero__badge mono">
            <span className="landing-hero__badge-dot" />
            Global Network
          </motion.div>

          <motion.h1
            className="landing-hero__title"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {["A", "truly", "global", "network"].map((word, i) => (
              <motion.span key={i} variants={fadeInUp} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {word}
              </motion.span>
            ))}
            <br />
            {["for", "lightning-fast", "inference"].map((word, i) => (
              <motion.span key={i} variants={fadeInUp} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="landing-hero__subtitle"
          >
            CogniCode global network consists of more than 160 locations, allowing you to reach your users anywhere in the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="landing-hero__ctas"
          >
            <RouterLink to="/register" className="landing-hero__btn landing-hero__btn--primary mono">
              GET STARTED <HiOutlineArrowRight />
            </RouterLink>
            <RouterLink to="/docs" className="landing-hero__btn landing-hero__btn--secondary mono">EXPLORE AI EDITOR</RouterLink>
          </motion.div>

        </div>
      </section>

      <section className="landing-demo">
        <div className="landing-demo__container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="landing-demo__header"
          >
            <h2 className="landing-demo__title">Build &bull; Optimize &bull; Deploy</h2>
            <p className="landing-demo__subtitle">
              Seamless AI-powered DevOps workflow for modern engineering teams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="landing-demo__video-container"
          >
            <div className="landing-demo__video-wrapper">
              <video
                className="landing-demo__video"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      <Element name="features" className="landing-features">
        <div className="landing-features__container">
          <div className="landing-features__header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className="landing-hero__badge mono"
              style={{ marginBottom: '20px' }}
            >
              <span className="landing-hero__badge-dot" />
              CORE CAPABILITIES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className="landing-features__title"
            >
              Institutional <span className="landing-features__title--italic">Features.</span>
            </motion.h2>
            <p className="landing-features__subtitle">High-performance tools engineered for modern engineering squads.</p>
          </div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: false, amount: 0.1 }} className="landing-features__grid">
            {[
              { icon: <HiOutlineBolt />, title: 'One-Click Deploy', desc: 'Deploy your entire stack to any cloud provider in seconds with zero manual configuration.' },
              { icon: <HiOutlineCodeBracket />, title: 'AI Code Assistant', desc: 'Context-aware suggestions and real-time optimizations powered by advanced LLMs.' },
              { icon: <HiOutlineServerStack />, title: 'Env Manager', desc: 'Isolated staging, production, and dev environments with automatic scaling and security.' },
              { icon: <HiOutlineChartBar />, title: 'Real-time Logs', desc: 'Stream logs and metrics instantly to identify and resolve issues before they affect users.' },
              { icon: <HiOutlineShieldCheck />, title: 'Security Scan', desc: 'Automated vulnerability patching and institutional-grade security compliance.' },
              { icon: <HiOutlineCpuChip />, title: 'Auto Scaling', desc: 'Dynamically adjust resources based on traffic demands to optimize costs and performance.' },
              { icon: <HiOutlineCommandLine />, title: 'Terminal Access', desc: 'Manage your deployments directly through a high-performance integrated CLI.' },
              { icon: <HiOutlineArrowPath />, title: 'Instant Rollbacks', desc: 'Zero-downtime version switching with one-click restoration of previous builds.' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="landing-feature-card">
                <div className="landing-feature-card__content">
                  <div className="landing-feature-card__icon">{feature.icon}</div>
                  <h3 className="landing-feature-card__title">{feature.title}</h3>
                  <p className="landing-feature-card__desc">{feature.desc}</p>
                </div>
                <div className="landing-feature-card__glow" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Element>

      <Element name="how-it-works" className="landing-how">
        <div className="landing-how__container">
          <h2 className="landing-how__title">Deployment <span className="landing-how__title--italic">Workflow.</span></h2>
          <div className="landing-how__timeline">
            <div className="landing-how__line">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: false, amount: 0.1 }} className="landing-how__line-progress" />
            </div>
            <div className="landing-how__steps">
              {[
                { step: '01', title: 'Connect', desc: 'Link your repository and select your project branches.' },
                { step: '02', title: 'Configure', desc: 'Define your environment variables and build settings.' },
                { step: '03', title: 'Optimize', desc: 'Use AI Editor to review security and generate tests.' },
                { step: '04', title: 'Deploy', desc: 'Trigger your build and watch the live deployment logs.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: i * 0.2 }}
                  className="landing-how-step"
                >
                  <div className="landing-how-step__number mono">{item.step}</div>
                  <h3 className="landing-how-step__title">{item.title}</h3>
                  <p className="landing-how-step__desc">{item.desc}</p>
                  <div className="landing-how-step__pulse" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Element>

      <Element name="pricing" className="landing-pricing">
        <div className="landing-pricing__container">
          <div className="landing-pricing__header">
            <h2 className="landing-pricing__title">Predictable <span className="landing-pricing__title--italic">Pricing.</span></h2>
            <p className="landing-pricing__subtitle">Scalable plans for developers and organizations.</p>
          </div>
          <div className="landing-pricing__grid">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} className="landing-price-card">
              <h3 className="landing-price-card__tier mono">DEVELOPER</h3>
              <div className="landing-price-card__price">$0<span>/MO</span></div>
              <ul className="landing-price-card__features">
                {['3 Active Projects', '1GB RAM', 'Basic AI Tools', '24h Logs'].map(f => (<li key={f}><HiOutlineShieldCheck /> {f}</li>))}
              </ul>
              <RouterLink to="/register" className="landing-price-card__btn mono">START FREE</RouterLink>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.1 }} className="landing-price-card landing-price-card--featured">
              <div className="landing-price-card__badge mono">RECOMMENDED</div>
              <h3 className="landing-price-card__tier mono">PRO SQUAD</h3>
              <div className="landing-price-card__price">$29<span>/MO</span></div>
              <ul className="landing-price-card__features">
                {['Unlimited Projects', '4GB RAM', 'Full AI Suite', '30-day Logs', 'Priority Support'].map(f => (<li key={f}><HiOutlineShieldCheck /> {f}</li>))}
              </ul>
              <RouterLink to="/register" className="landing-price-card__btn landing-price-card__btn--primary mono">UPGRADE NOW</RouterLink>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} transition={{ delay: 0.2 }} className="landing-price-card">
              <h3 className="landing-price-card__tier mono">ENTERPRISE</h3>
              <div className="landing-price-card__price">CUSTOM</div>
              <ul className="landing-price-card__features">
                {['Dedicated Compute', 'SSO & RBAC', 'BYO Models', '24/7 Phone Support'].map(f => (<li key={f}><HiOutlineShieldCheck /> {f}</li>))}
              </ul>
              <button className="landing-price-card__btn mono">CONTACT SALES</button>
            </motion.div>
          </div>
        </div>
      </Element>

      <Element name="blog" className="landing-blog">
        <div className="landing-blog__container">
          <div className="landing-blog__header">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }} className="landing-blog__title">
              Insights & <span className="landing-blog__title--italic">Updates.</span>
            </motion.h2>
            <p className="landing-blog__subtitle">Latest articles, guides, and updates from CogniCode ecosystem.</p>
          </div>

          <div className="landing-blog__carousel-container">
            <motion.div
              className="landing-blog__carousel"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                }
              }}
              whileHover={{ animationPlayState: 'paused' }}
            >
              {infiniteBlogPosts.map((post, i) => (
                <div key={i} className="landing-blog-card">
                  <div className="landing-blog-card__image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="landing-blog-card__content">
                    <h3 className="landing-blog-card__title">{post.title}</h3>
                    <p className="landing-blog-card__desc">{post.desc}</p>
                    <a href="#" className="landing-blog-card__link mono">
                      READ MORE <HiOutlineArrowRight />
                      <span className="landing-blog-card__link-line" />
                    </a>
                  </div>
                  <div className="landing-blog-card__glow" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Element>

      <Element name="faq" className="landing-faq">
        <div className="landing-faq__container">
          <h2 className="landing-faq__title">Information <span className="landing-faq__title--italic">Center.</span></h2>
          <div className="landing-faq__list">
            {[
              { q: 'What does this platform do?', a: 'CogniCode is an institutional-grade DevOps platform that combines seamless deployment workflows with AI-powered code optimization and security tools.' },
              { q: 'How does deployment work?', a: 'We use Dockerized runners to build and deploy your applications directly from your linked GitHub or GitLab repositories with one click.' },
              { q: 'Can I upgrade anytime?', a: 'Yes, plans are billed monthly and can be upgraded or downgraded instantly from your account settings.' },
              { q: 'Is my data secure?', a: 'All secrets and environment variables are encrypted at rest with AES-256 and in transit via TLS 1.3. We maintain strict SOC2-compliant standards.' },
              { q: 'Do you support open-source?', a: 'We offer free Pro tier access to verified maintainers of active open-source projects. Contact our support team to apply.' },
              { q: 'What happens if limits exceed?', a: 'We provide a generous grace period and will notify you before any services are throttled. You can increase limits at any time.' },
            ].map((faq, i) => (<AccordionItem key={i} question={faq.q} answer={faq.a} />))}
          </div>
        </div>
      </Element>

      <Element name="contact" className="landing-contact">
        <div className="landing-contact__container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="landing-contact__card"
          >
            <div className="landing-contact__info">
              <h2 className="landing-contact__title mono">MISSION CONTROL</h2>
              <p className="landing-contact__desc">Our engineering team is ready to assist with your architectural planning.</p>
              <div className="landing-contact__details">
                <div className="landing-contact__item">
                  <div className="landing-contact__icon"><HiOutlineChatBubbleLeftRight /></div>
                  <div><span className="mono">SUPPORT</span><strong className="mono">support@cognicode.com</strong></div>
                </div>
              </div>
            </div>
            <div className="landing-contact__form-wrapper">
              <form className="landing-contact__form">
                <div className="landing-contact__row">
                  <div className="landing-contact__field"><label className="mono">FULL NAME</label><input type="text" placeholder="John Doe" /></div>
                  <div className="landing-contact__field"><label className="mono">EMAIL</label><input type="email" placeholder="john@example.com" /></div>
                </div>
                <div className="landing-contact__field"><label className="mono">MESSAGE</label><textarea rows="4" placeholder="Describe your inquiry..."></textarea></div>
                <button type="submit" className="landing-contact__submit mono">SEND MESSAGE</button>
              </form>
            </div>
          </motion.div>
        </div>
      </Element>

      <footer className="landing-footer">
        <div className="landing-footer__container">
          <div className="landing-footer__grid">
            <div className="landing-footer__brand">
              <RouterLink to="/" className="landing-footer__logo"><img src={brandLogo} alt="Logo" style={{ width: '20px' }} /><span>COGNICODE</span></RouterLink>
              <p className="mono">STAY SECURE. DEPLOY FAST.</p>
            </div>
            {['Platform', 'Resources', 'Company'].map(group => (
              <div key={group} className="landing-footer__group"><h4 className="mono">{group.toUpperCase()}</h4><ul>{['Features', 'Pricing', 'Docs', 'Status'].map(l => <li key={l}><a href="#" className="mono">{l.toUpperCase()}</a></li>)}</ul></div>
            ))}
          </div>
          <div className="landing-footer__bottom mono"><p>© 2026 COGNICODE SYSTEMS INC. ALL RIGHTS RESERVED.</p></div>
        </div>
      </footer>
    </div>
  );
};

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`landing-faq-item ${isOpen ? 'landing-faq-item--open' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="landing-faq-item__header">
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="landing-faq-item__icon"><HiX /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="landing-faq-item__answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
