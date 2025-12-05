/**
 * Admin Portal - Report Management System
 * Only accessible to users with admin role
 * Now matches the beautiful theme of the user portal
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Admin Route Protection Component
const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and has admin role
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <div className="mt-4 text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

// Main Admin Component
const AdminPortal = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalReports: 0 });
  const router = useRouter();

  // Fetch all reports for admin
  const fetchReports = async (status = 'all', page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...(status !== 'all' && { status }),
        page: page.toString(),
        limit: '10'
      });

      console.log('Admin: Fetching reports from /api/admin with params:', queryParams.toString());
      
      const response = await fetch(`/api/admin?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('Admin: Fetch response:', result);

      if (result.success) {
        setReports(result.reports);
        setPagination(result.pagination);
        console.log('Admin: Reports loaded:', result.reports.length, 'reports');
      } else {
        setMessage(`Error: ${result.error || 'Failed to fetch reports'}`);
        console.error('Admin: Fetch error:', result);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setMessage('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Update report status
  const updateStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Report status updated to ${newStatus}`);
        fetchReports(statusFilter, pagination.currentPage);
      } else {
        setMessage(`Error: ${result.error || 'Failed to update status'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update report status');
    }
  };

  // Delete report
  const deleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Report deleted successfully');
        fetchReports(statusFilter, pagination.currentPage);
      } else {
        setMessage(`Error: ${result.error || 'Failed to delete report'}`);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setMessage('Failed to delete report');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Load reports on component mount and when filter changes
  useEffect(() => {
    fetchReports(statusFilter, 1);
  }, [statusFilter]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      'Pending': 'bg-yellow-600/80 text-yellow-100',
      'In Progress': 'bg-blue-600/80 text-blue-100',
      'Resolved': 'bg-green-600/80 text-green-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${colors[status] || 'bg-gray-600/80 text-gray-100'}`}>
        {status}
      </span>
    );
  };

  // Get crowd level color - matching user portal styling
  const getCrowdLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-600/80 text-green-100';
      case 'Medium': return 'bg-yellow-600/80 text-yellow-100';
      case 'High': return 'bg-red-600/80 text-red-100';
      default: return 'bg-gray-600/80 text-gray-100';
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black text-white">
        <Head>
          <title>Admin Portal - CrowdSight</title>
        </Head>

        {/* Background - Same as user portal but with purple accents for admin */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Navigation - Matching user portal style */}
        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-white">CrowdSight</h1>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 rounded-full text-purple-200 text-sm font-medium backdrop-blur-sm">
                  🛡️ Admin Portal
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium"
                >
                  User Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors backdrop-blur-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header - Matching user portal gradient text */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600/30 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg mb-4">
              <p className="text-purple-200 font-medium">
                🚨 Administrator Access - You can view and manage ALL reports from ALL users
              </p>
            </div>
            <p className="text-gray-400 text-lg">
              Manage all reports and monitor crowd incidents across the system
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>Total Reports: {pagination.totalReports}</span>
            </div>
          </div>

          {/* Filters and Controls - Glassmorphism design */}
          <div className="mb-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => fetchReports(statusFilter, 1)}
                  className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700 text-white rounded-lg transition-colors backdrop-blur-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Message Display - Improved styling */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg backdrop-blur-sm border ${
              message.includes('Error') || message.includes('Failed') 
                ? 'bg-red-900/50 border-red-700/50 text-red-200' 
                : 'bg-green-900/50 border-green-700/50 text-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Reports Table */}
          {isLoading ? (
            <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <div className="absolute inset-0 inline-block animate-ping rounded-full h-12 w-12 border border-purple-400 opacity-20"></div>
              </div>
              <p className="mt-6 text-gray-400 text-lg">Loading reports...</p>
              <p className="mt-2 text-gray-500 text-sm">Fetching data from the system</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-lg">No reports found</p>
              <p className="text-gray-500 mt-2">Reports will appear here when users submit them</p>
            </div>
          ) : (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Report Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location & Crowd
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {report.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(report.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-white">
                              {report.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {report.user?.email || 'No email'}
                            </div>
                            <div className="text-xs text-purple-400">
                              Role: {report.user?.role || 'user'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-white flex items-center">
                              📍 {report.location}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center mt-1">
                              🚶 <span className={`ml-1 px-2 py-1 rounded text-xs backdrop-blur-sm ${getCrowdLevelColor(report.crowdLevel)}`}>
                                {report.crowdLevel}
                              </span>
                              {report.crowdCount && <span className="ml-2 text-gray-500">({report.crowdCount})</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {/* Status Update Buttons */}
                            {report.status !== 'Pending' && (
                              <button
                                onClick={() => updateStatus(report.id, 'Pending')}
                                className="bg-yellow-600/80 hover:bg-yellow-700 text-white px-3 py-1 text-xs rounded backdrop-blur-sm transition-colors"
                              >
                                Pending
                              </button>
                            )}
                            {report.status !== 'In Progress' && (
                              <button
                                onClick={() => updateStatus(report.id, 'In Progress')}
                                className="bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded backdrop-blur-sm transition-colors"
                              >
                                In Progress
                              </button>
                            )}
                            {report.status !== 'Resolved' && (
                              <button
                                onClick={() => updateStatus(report.id, 'Resolved')}
                                className="bg-green-600/80 hover:bg-green-700 text-white px-3 py-1 text-xs rounded backdrop-blur-sm transition-colors"
                              >
                                Resolve
                              </button>
                            )}
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteReport(report.id)}
                              className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 text-xs rounded backdrop-blur-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Matching user portal design */}
              <div className="lg:hidden space-y-4 p-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white">{report.title}</h3>
                      <StatusBadge status={report.status} />
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div className="flex items-center">📍 {report.location}</div>
                      <div className="flex items-center">
                        🚶 <span className={`ml-1 px-2 py-1 rounded text-xs backdrop-blur-sm ${getCrowdLevelColor(report.crowdLevel)}`}>
                          {report.crowdLevel}
                        </span>
                        {report.crowdCount && <span className="ml-2">({report.crowdCount})</span>}
                      </div>
                      <div className="flex items-center">👤 {report.user?.name || 'Unknown'}</div>
                      <div className="flex items-center text-purple-400">✉️ {report.user?.email}</div>
                      <div className="flex items-center">📅 {new Date(report.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {report.status !== 'Pending' && (
                        <button
                          onClick={() => updateStatus(report.id, 'Pending')}
                          className="bg-yellow-600/80 hover:bg-yellow-700 text-white px-3 py-1 text-xs rounded flex-1 backdrop-blur-sm transition-colors"
                        >
                          Pending
                        </button>
                      )}
                      {report.status !== 'In Progress' && (
                        <button
                          onClick={() => updateStatus(report.id, 'In Progress')}
                          className="bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded flex-1 backdrop-blur-sm transition-colors"
                        >
                          In Progress
                        </button>
                      )}
                      {report.status !== 'Resolved' && (
                        <button
                          onClick={() => updateStatus(report.id, 'Resolved')}
                          className="bg-green-600/80 hover:bg-green-700 text-white px-3 py-1 text-xs rounded flex-1 backdrop-blur-sm transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 text-xs rounded w-full mt-2 backdrop-blur-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination - Updated styling */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-3">
              <button
                onClick={() => fetchReports(statusFilter, pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-900/50 disabled:cursor-not-allowed disabled:text-gray-500 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-300 px-4 py-2 bg-gray-800/30 rounded-lg backdrop-blur-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchReports(statusFilter, pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-900/50 disabled:cursor-not-allowed disabled:text-gray-500 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminPortal;