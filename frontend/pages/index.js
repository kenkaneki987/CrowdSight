import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaChartLine, FaExclamationTriangle, FaUsers, FaCheckCircle, FaBolt, FaRocket, FaSignOutAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { RiRadarLine } from 'react-icons/ri';

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = (e.clientX / window.innerWidth) * 100;
      const newY = (e.clientY / window.innerHeight) * 100;
      
      setMousePosition({ x: newX, y: newY });
      
      // Add trail effect
      setTrail(prev => [...prev.slice(-15), { 
        x: newX, 
        y: newY, 
        id: Date.now() + Math.random() 
      }]);
    };
    
    const handleClick = (e) => {
      // Create ripple on click
      const newRipple = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
        id: Date.now()
      };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1500);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const features = [
    {
      title: 'Real-Time Analysis',
      description: 'Monitor crowd density in real-time with AI-powered video analytics',
      icon: <FaChartLine className="w-8 h-8" />,
      gradient: 'from-[#7c3aed] to-[#a78bfa]',
      glowColor: '#7c3aed',
      delay: 0
    },
    {
      title: 'Anomaly Detection',
      description: 'Detect unusual patterns with advanced AI algorithms instantly',
      icon: <FaExclamationTriangle className="w-8 h-8" />,
      gradient: 'from-[#3b82f6] to-[#60a5fa]',
      glowColor: '#3b82f6',
      delay: 0.2
    },
    {
      title: 'Crowd Insights',
      description: 'Get detailed analytics about crowd behavior and trends',
      icon: <FaUsers className="w-8 h-8" />,
      gradient: 'from-[#7c3aed] to-[#a78bfa]',
      glowColor: '#7c3aed',
      delay: 0.4
    }
  ];

  const stats = [
    { 
      value: '99.9%', 
      label: 'ACCURACY', 
      icon: <FaCheckCircle className="w-10 h-10" />,
      gradient: 'from-[#7c3aed] to-[#a78bfa]',
      glowColor: '#7c3aed'
    },
    { 
      value: '<1ms', 
      label: 'RESPONSE', 
      icon: <FaBolt className="w-10 h-10" />,
      gradient: 'from-[#3b82f6] to-[#60a5fa]',
      glowColor: '#3b82f6'
    },
    { 
      value: '24/7', 
      label: 'UPTIME', 
      icon: <FaRocket className="w-10 h-10" />,
      gradient: 'from-[#7c3aed] to-[#a78bfa]',
      glowColor: '#7c3aed'
    }
  ];

  return (
    <>
      <Head>
        <title>CrowdSight - AI-Powered Crowd Monitoring</title>
        <meta name="description" content="Real-Time Crowd Density & Safety Monitoring System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden relative" ref={containerRef}>
        {/* Subtle gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Interactive Mouse Gradient - Enhanced */}
        <motion.div 
          className="fixed inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(124, 58, 237, 0.2), transparent 60%),
                         radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15), transparent 50%)`
          }}
        />

        {/* Mouse Trail Effect */}
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed w-2 h-2 rounded-full pointer-events-none z-10"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              background: 'rgba(124, 58, 237, 0.6)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)',
            }}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ 
              opacity: 0, 
              scale: 0,
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Click Ripple Effects */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-20"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: '20px',
              height: '20px',
              marginLeft: '-10px',
              marginTop: '-10px',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: 'rgba(124, 58, 237, 0.8)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: 20, 
                opacity: 0,
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: 'rgba(59, 130, 246, 0.6)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: 15, 
                opacity: 0,
              }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: 0.1
              }}
            />
          </motion.div>
        ))}

        {/* Floating Particles - Enhanced */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.id % 2 === 0 
                ? 'rgba(124, 58, 237, 0.6)' 
                : 'rgba(59, 130, 246, 0.5)',
              boxShadow: particle.id % 2 === 0
                ? '0 0 15px rgba(124, 58, 237, 0.8)'
                : '0 0 15px rgba(59, 130, 246, 0.7)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Gradient Orbs - Enhanced */}
        <motion.div 
          className="fixed w-[500px] h-[500px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, #a78bfa 40%, transparent 70%)',
            left: `${20 + mousePosition.x * 0.08}%`,
            top: `${10 + mousePosition.y * 0.08}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="fixed w-[500px] h-[500px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, #60a5fa 40%, transparent 70%)',
            right: `${10 + mousePosition.x * 0.06}%`,
            bottom: `${10 + mousePosition.y * 0.06}%`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="fixed w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #c084fc 40%, transparent 70%)',
            left: `${60 - mousePosition.x * 0.07}%`,
            top: `${50 - mousePosition.y * 0.07}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated Grid Lines */}
        <motion.div 
          className="fixed inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-50 backdrop-blur-xl bg-black/50 border-b border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center relative overflow-hidden"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  <RiRadarLine className="text-white text-xl" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1.1',
                    WebkitFontSmoothing: 'antialiased'
                  }}
                >
                  CrowdSight
                </span>
              </motion.div>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={() => router.push('/report')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-base font-medium text-white/80 hover:text-white transition-colors"
                    >
                      Report
                    </motion.button>
                    <motion.button
                      onClick={() => router.push('/dashboard')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-base font-medium text-white/80 hover:text-white transition-colors"
                    >
                      Dashboard
                    </motion.button>
                    <motion.div className="flex items-center space-x-3">
                      <span className="text-sm text-white/70">
                        Welcome, {user?.name || user?.email}
                      </span>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm flex items-center gap-2"
                        title="Logout"
                      >
                        <FaSignOutAlt className="text-sm" />
                        Logout
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.button
                      onClick={() => router.push('/login')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 text-base font-medium text-white/80 hover:text-white transition-colors"
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      onClick={() => router.push('/login')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg font-semibold text-base"
                    >
                      Get Started
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        <section className="relative z-30 pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center relative">
              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mb-6"
              >
                <motion.span 
                  className="block text-6xl md:text-7xl lg:text-8xl font-bold mb-3 leading-tight"
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #a1a1a1 50%, #6b7280 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Crowd Monitoring
                </motion.span>
                <motion.span 
                  className="block text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Reimagined
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Real-time AI analytics for smarter, safer crowd management
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.button
                  onClick={() => router.push('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg font-semibold text-lg shadow-lg"
                >
                  Get Started Free
                </motion.button>
                
                <motion.button
                  onClick={() => router.push('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-gray-700 rounded-lg font-semibold text-lg backdrop-blur-sm hover:border-gray-600 transition-colors"
                >
                  View Demo
                </motion.button>
              </motion.div>

              {/* Simple Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-16 flex flex-wrap justify-center gap-8"
              >
                {['1M+ Events', '99.9% Uptime', '<1ms Response'].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.split(' ')[0]}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {stat.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative z-20 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Everything you need for modern crowd monitoring
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  {/* Animated Glow Effect on Hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${feature.glowColor}, transparent)`
                    }}
                  />
                  
                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: `radial-gradient(circle at center, ${feature.glowColor}, transparent 70%)`
                    }}
                  />
                  
                  <div className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 group-hover:border-gray-700 group-hover:bg-gray-900/70 transition-all duration-300 h-full backdrop-blur-sm">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 relative`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Icon Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          boxShadow: `0 0 20px ${feature.glowColor}`
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="text-white relative z-10">
                        {feature.icon}
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#7c3aed] group-hover:to-[#3b82f6] group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
                Trusted Performance
              </h2>
              <p className="text-lg text-gray-400">
                Built for reliability and speed
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.08 }}
                  className="group relative text-center"
                >
                  {/* Animated Glow on Hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${stat.glowColor}, transparent)`
                    }}
                  />
                  
                  {/* Pulsing Ring Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      border: `2px solid ${stat.glowColor}`,
                      filter: 'blur(1px)'
                    }}
                  />
                  
                  <div className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 group-hover:border-gray-700 group-hover:bg-gray-900/70 transition-all duration-300">
                    <motion.div 
                      className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center relative`}
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Icon Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          boxShadow: `0 0 30px ${stat.glowColor}, 0 0 60px ${stat.glowColor}`
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="text-white relative z-10">
                        {stat.icon}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-4xl lg:text-5xl font-bold text-white mb-2"
                      whileHover={{ 
                        scale: 1.1,
                        textShadow: `0 0 20px ${stat.glowColor}`
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-base text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>        <section className="relative z-20 py-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative p-12 md:p-16 rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-[#3b82f6]/10 border border-[#7c3aed]/20 text-center backdrop-blur-sm">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
                    Ready to get started?
                  </span>
                </h2>
                <p className="text-lg text-gray-400 mb-10">
                  Join thousands using CrowdSight for smarter crowd monitoring
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    onClick={() => router.push('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] rounded-lg font-semibold text-lg"
                  >
                    Start Free Trial
                  </motion.button>
                  <motion.button
                    onClick={() => router.push('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 border-2 border-gray-700 rounded-lg font-semibold text-lg backdrop-blur-sm hover:border-gray-600 transition-colors"
                  >
                    Schedule Demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="relative z-20 border-t border-gray-800 backdrop-blur-xl bg-black/50 mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center relative overflow-hidden"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <RiRadarLine className="text-white text-xl" />
                </motion.div>
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1.1',
                    WebkitFontSmoothing: 'antialiased'
                  }}
                >
                  CrowdSight
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Real-Time Crowd Density & Safety Monitoring
              </p>
              <p className="text-sm text-gray-600">
                © 2025 CrowdSight. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
