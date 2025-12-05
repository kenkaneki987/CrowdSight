// Frontend API proxy for admin operations
export default async function handler(req, res) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const { method, body, query } = req;
    
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Build query string from query parameters
    const queryString = Object.keys(query).length > 0 
      ? '?' + new URLSearchParams(query).toString() 
      : '';
    
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
    
    // Forward the request to the backend admin routes
    const response = await fetch(`${backendUrl}/api/reports/admin/reports${queryString}`, fetchOptions);

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
        details: text.substring(0, 200) // Truncate for security
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Admin proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}