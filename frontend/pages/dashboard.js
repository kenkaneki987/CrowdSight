import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [crowdLevelFilter, setCrowdLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);

  const reportsPerPage = 10;

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    fetchReports();
  }, [currentPage, searchTerm, statusFilter, crowdLevelFilter]);

  // Fetch reports from API
  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: reportsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(crowdLevelFilter && { crowdLevel: crowdLevelFilter })
      });

      const response = await fetch(`/api/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Reports API response:', data);

      if (data.success) {
        // Backend returns: { success: true, data: reports, pagination: { totalCount: ... } }
        console.log('Reports fetched:', data.data);
        setReports(data.data || []);
        setTotalReports(data.pagination?.totalCount || 0);
        setError('');
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Delete report - users can only delete their own reports
  const deleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchReports(); // Refresh reports
        setError('');
      } else {
        setError('Failed to delete report');
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600';
      case 'In Progress': return 'bg-blue-600';
      case 'Resolved': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  // Get crowd level color
  const getCrowdLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'High': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCrowdLevelFilter('');
    setCurrentPage(1);
  };

  // Show loading state
  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalReports / reportsPerPage);

  return (
    <>
      <Head>
        <title>Dashboard - CrowdSight</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-white">CrowdSight</h1>
                <a href="/report" className="text-gray-300 hover:text-white transition-colors">
                  Report Issue
                </a>
                {/* Admin Portal Link - Only show for admin users */}
                {user?.role === "admin" && (
                  <a href="/admin" className="text-purple-300 hover:text-purple-100 transition-colors font-semibold">
                    🛡️ Admin Portal
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, <span className="font-semibold text-white">{user?.name}</span>
                  {user?.role === "admin" && (
                    <span className="ml-2 px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              User Dashboard – My Reports
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and monitor crowd reports in real-time
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Crowd Level</label>
                <select
                  value={crowdLevelFilter}
                  onChange={(e) => setCrowdLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* User Permissions Info */}
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <span>ℹ️</span>
              <span>You can view and delete your own reports. Only administrators can change report status.</span>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
            {reports.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-lg">No reports found</p>
                <p className="text-gray-500 mt-2">Create your first report to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Crowd Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{report.title}</div>
                          <div className="text-gray-400 text-sm">{report.description?.substring(0, 100)}...</div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {report.location}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCrowdLevelColor(report.crowdLevel)}`}>
                            {report.crowdLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {report.imageUrl ? (
                            <div className="relative">
                              <img
                                src={report.imageUrl}
                                alt="Report"
                                className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => {
                                  // Handle both base64 and URL images
                                  if (report.imageUrl.startsWith('data:')) {
                                    // For base64 images, open in a new tab with proper data URL
                                    const newTab = window.open();
                                    newTab.document.write(`
                                      <html>
                                        <head><title>Report Image</title></head>
                                        <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;">
                                          <img src="${report.imageUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                                        </body>
                                      </html>
                                    `);
                                  } else {
                                    // For URL images, open normally
                                    window.open(report.imageUrl, '_blank');
                                  }
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <span 
                                className="text-gray-500 text-sm" 
                                style={{ display: 'none' }}
                              >
                                Image error
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No image</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {/* Status is read-only for users - only admins can change status */}
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Total Reports</h3>
              <p className="text-3xl font-bold text-blue-400">{totalReports}</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-400">
                {reports.filter(r => r.status === 'Pending').length}
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Resolved</h3>
              <p className="text-3xl font-bold text-green-400">
                {reports.filter(r => r.status === 'Resolved').length}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
