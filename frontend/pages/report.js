import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ReportIssue() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    crowdLevel: '',
    crowdCount: '',
    imageUrl: ''
  });

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
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const uploadImage = async (file) => {
    console.log('Uploading file:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          imageUrl: result.imageUrl // Now stores base64 data URL
        }));
        setMessage('Image converted to base64 and ready for database storage!');
        console.log('Image converted to base64, size:', result.size);
      } else {
        setMessage('Failed to upload image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload image');
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }
      
      setUploadingImage(true);
      await uploadImage(file);
      setUploadingImage(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }
      
      setUploadingImage(true);
      await uploadImage(file);
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { title, description, location, crowdLevel } = formData;
      if (!title.trim() || !description.trim() || !location.trim() || !crowdLevel) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const reportData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        crowdLevel,
        crowdCount: formData.crowdCount ? parseInt(formData.crowdCount) : null,
        imageUrl: formData.imageUrl.trim() || null
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Report submitted successfully!');
        setFormData({
          title: '',
          description: '',
          location: '',
          crowdLevel: '',
          crowdCount: '',
          imageUrl: ''
        });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Handle specific error types
        if (result.code === 'FILE_TOO_LARGE') {
          setMessage('Image file is too large. Please use an image smaller than 5MB.');
        } else {
          setMessage(`Error: ${result.error || result.message || 'Unknown error occurred'}`);
        }
      }

    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Handle specific network errors
      if (error.message.includes('Failed to fetch')) {
        setMessage('Network error. Please check your connection and try again.');
      } else if (error.name === 'SyntaxError') {
        setMessage('Server response error. The image might be too large.');
      } else {
        setMessage('Failed to submit report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Report Issue - CrowdSight</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-white">CrowdSight</h1>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, <span className="font-semibold text-white">{user?.name}</span>
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

        <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Submit Crowd Report
            </h1>
            <p className="text-gray-400 text-lg">
              Provide details about crowd density or safety concerns in your area.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief title for the incident"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Detailed description of the crowd situation"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Address or description of location"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Crowd Level *
                </label>
                <select
                  name="crowdLevel"
                  value={formData.crowdLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select crowd level</option>
                  <option value="Low">Low - Small groups, normal activity</option>
                  <option value="Medium">Medium - Moderate crowds, monitor closely</option>
                  <option value="High">High - Large crowds, potential safety concerns</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Crowd Count (optional)
                </label>
                <input
                  type="number"
                  name="crowdCount"
                  value={formData.crowdCount}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Approximate number of people"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image (optional)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
                <div className="space-y-4">
                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-800/50'
                    } ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                    
                    {uploadingImage ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-gray-400">Uploading image...</p>
                      </div>
                    ) : formData.imageUrl ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="max-h-32 max-w-full object-cover rounded-lg mb-2"
                        />
                        <p className="text-green-400 text-sm mb-2">✓ Image uploaded successfully</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="text-red-400 hover:text-red-300 text-sm underline"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-300 mb-1">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Alternative: Manual URL Input */}
                  <div className="text-center text-gray-500 text-sm">
                    OR
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg or relative path"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      You can paste a direct image URL here or upload using drag & drop above
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('Error') || message.includes('Failed')
                    ? 'bg-red-900/50 text-red-300 border border-red-700'
                    : 'bg-green-900/50 text-green-300 border border-green-700'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 text-sm text-gray-400 text-center">
            <p>* Required fields</p>
            <p className="mt-2">
              Please provide accurate information about crowd situations to help maintain public safety.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
