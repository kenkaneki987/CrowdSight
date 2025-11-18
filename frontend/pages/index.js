import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      title: 'Real-Time Analysis',
      description: 'Monitor crowd density in real-time with AI-powered video analytics and machine learning algorithms',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-blue-400 via-blue-500 to-indigo-600',
      delay: '0ms'
    },
    {
      title: 'Anomaly Detection',
      description: 'Automatically detect unusual patterns and potential safety concerns with advanced AI algorithms',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      gradient: 'from-red-400 via-red-500 to-pink-600',
      delay: '200ms'
    },
    {
      title: 'Crowd Insights',
      description: 'Get detailed analytics and insights about crowd behavior, patterns, and predictive trends',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      delay: '400ms'
    }
  ];

  const stats = [
    { 
      value: '99.9%', 
      label: 'Accuracy Rate', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-400 to-emerald-500'
    },
    { 
      value: '<1ms', 
      label: 'Response Time', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      value: '24/7', 
      label: 'Monitoring', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'from-blue-400 to-purple-500'
    }
  ];

  return (
    <>
      <Head>
        <title>CrowdSight - AI-Powered Crowd Monitoring</title>
        <meta name="description" content="Real-Time Crowd Density & Safety Monitoring System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden scroll-smooth-page">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)] animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-float"></div>
        </div>

        {/* Navigation Bar */}
        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-3xl font-black tracking-tight text-white">
                  CrowdSight
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => router.push('/login')}
                  className="nav-link text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-primary"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-30 section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Main Heading */}
              <h1 className="hero-text mb-8 relative z-30">
                <span className="block">Crowd Monitoring</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              {/* Tagline */}
              <p className="hero-subtitle mb-12 max-w-4xl mx-auto">
                Experience the future of crowd monitoring with AI-powered analytics 
                that deliver real-time insights and unparalleled safety monitoring.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 relative z-30 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-primary group relative z-30 w-48 sm:w-auto sm:min-w-[200px]"
                >
                  <span>Get Started Free</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="btn-secondary group relative z-30 w-48 sm:w-auto sm:min-w-[200px]"
                >
                  <span>View Demo</span>
                  <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-20 section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`text-center mb-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Everything you need to monitor and analyze crowd behavior with cutting-edge technology
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card group cursor-pointer hover-lift animate-slide-up transition-all duration-700 delay-[${feature.delay}] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  {/* Icon with animated gradient */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 animate-pulse-glow transition-all duration-500 shadow-glow-blue`}>
                    <div className="text-white animate-float">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover effect indicator */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 animate-shimmer">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-20 section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white">
                Proven Performance
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Trusted by organizations worldwide for reliable crowd monitoring solutions
              </p>
            </div>
            
            <div className={`transition-all duration-1000 delay-800 relative z-20 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group hover:scale-105 transition-all duration-500 relative z-20"
                    style={{ animationDelay: `${index * 200 + 800}ms` }}
                  >
                    {/* Icon with gradient background */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl relative z-20`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="text-4xl lg:text-5xl font-black text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg text-gray-400 font-medium">
                      {stat.label}
                    </div>
                    
                    {/* Animated progress bar */}
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden relative z-20">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                        style={{ animationDelay: `${index * 300}ms` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>        {/* Call to Action Section */}
        <section className="relative z-20 section-padding">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className={`transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white">
                Ready to get started?
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Join thousands of organizations already using CrowdSight for safer, smarter crowd monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-primary text-xl px-10 py-5 w-48 sm:w-auto sm:min-w-[200px]"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="btn-secondary text-xl px-10 py-5 w-48 sm:w-auto sm:min-w-[200px]"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 border-t border-white/10 backdrop-blur-md bg-black/20 mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="mb-6">
                <span className="text-3xl font-black text-white">
                  CrowdSight
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Real-Time Crowd Density & Safety Monitoring System
              </p>
              <p className="text-sm text-gray-500">
                © 2025 CrowdSight. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
