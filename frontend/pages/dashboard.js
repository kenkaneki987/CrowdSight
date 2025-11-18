import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data.user);
      setIsLoading(false);

    } catch (err) {
      console.error('Auth verification error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-white text-lg font-medium animate-pulse">Verifying authentication...</p>
          <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - CrowdSight</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <span className="text-3xl font-black tracking-tight text-white">
                  CrowdSight
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-gray-300">
                  Welcome, <span className="font-semibold text-white">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor and analyze crowd data in real-time
            </p>
          </div>

          <div className="card mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-gray-400 font-medium w-32">Name:</span>
                <span className="text-white font-semibold">{user?.name}</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-gray-400 font-medium w-32">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-gray-400 font-medium w-32">User ID:</span>
                <span className="text-gray-300 font-mono text-sm">{user?.id}</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-gray-400 font-medium w-32">Joined:</span>
                <span className="text-white">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group card bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 animate-slide-up hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">Active Cameras</p>
                  <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">12</p>
                  <div className="flex items-center text-green-400 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    +2 this week
                  </div>
                </div>
                <div className="opacity-30 group-hover:opacity-60 transition-opacity duration-300 group-hover:rotate-6 transform transition-transform duration-300">
                  <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 h-2 bg-blue-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-3/4 animate-shimmer"></div>
              </div>
            </div>

            <div className="group card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 animate-slide-up hover:from-green-600/30 hover:to-green-800/30 transition-all duration-500" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium mb-1">People Detected</p>
                  <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">1,234</p>
                  <div className="flex items-center text-green-400 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    +89 today
                  </div>
                </div>
                <div className="opacity-30 group-hover:opacity-60 transition-opacity duration-300 group-hover:rotate-6 transform transition-transform duration-300">
                  <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 h-2 bg-green-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full w-5/6 animate-shimmer"></div>
              </div>
            </div>

            <div className="group card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 animate-slide-up hover:from-purple-600/30 hover:to-purple-800/30 transition-all duration-500" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium mb-1">Alerts Today</p>
                  <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">3</p>
                  <div className="flex items-center text-red-400 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    -1 from yesterday
                  </div>
                </div>
                <div className="opacity-30 group-hover:opacity-60 transition-opacity duration-300 group-hover:rotate-6 transform transition-transform duration-300">
                  <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-1/6 animate-shimmer"></div>
              </div>
            </div>
          </div>

          <div className="glass-card animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">Real-Time Monitoring</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Monitor live crowd density with advanced camera analytics
                </p>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full w-4/5 animate-pulse-glow"></div>
                </div>
              </div>
              <div className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">Analytics Dashboard</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Access detailed reports and insights about crowd behavior patterns
                </p>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full w-3/4 animate-pulse-glow"></div>
                </div>
              </div>
              <div className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">Smart Alerts</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Get intelligent notifications when crowd density exceeds safe thresholds
                </p>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full w-3/5 animate-pulse-glow"></div>
                </div>
              </div>
              <div className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01.293.707V12a1 1 0 01-.293.707L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-2.586l2.293-2.293A1 1 0 016 10V7.414L3.707 5.121A1 1 0 013 4zm10-1a1 1 0 011 1v2.586l2.293 2.293A1 1 0 0117 10v2.586l-2.293 2.293A1 1 0 0114 15v1a1 1 0 01-2 0v-4a1 1 0 01.293-.707L14.586 9l-2.293-2.293A1 1 0 0112 6V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-pink-300 transition-colors duration-300">Heat Maps</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Visualize crowd distribution with beautiful interactive heat maps
                </p>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full w-full animate-pulse-glow"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 glass-card text-center animate-slide-up group hover:scale-105 transition-all duration-500" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 mr-3 group-hover:scale-110 transition-transform duration-300 animate-float">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Development in Progress
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              More features coming soon! This is a demo dashboard showcasing modern authentication and UI design.
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-3/4 animate-pulse-glow"></div>
            </div>
            <p className="text-sm text-gray-400">
              75% Complete • AI Analytics, Live Monitoring, Real-time Alerts
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
