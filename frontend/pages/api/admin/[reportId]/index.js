// Frontend API proxy for individual admin report operations
export default async function handler(req, res) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const { method, body } = req;
    const { reportId } = req.query;
    
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Prepare fetch options
    const fetchOptions = {
      method,
      headers,
    };
    
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Route to correct backend endpoint based on URL
    let backendEndpoint;
    if (req.url?.includes('/status')) {
      backendEndpoint = `${backendUrl}/api/reports/admin/reports/${reportId}/status`;
    } else {
      backendEndpoint = `${backendUrl}/api/reports/admin/reports/${reportId}`;
    }
    
    // Forward the request to the backend
    const response = await fetch(backendEndpoint, fetchOptions);

    // Handle different response types
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, return error
      const text = await response.text();
      console.error('Failed to parse admin response as JSON:', text);
      return res.status(response.status).json({
        success: false,
        error: 'Invalid response from server',
        details: text.substring(0, 200)
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Admin report operation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}