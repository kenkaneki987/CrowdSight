// Frontend API proxy for individual report operations
export default async function handler(req, res) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const { method, body, query } = req;
    const { id } = query; // Get the report ID from the route
    
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
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/reports/${id}`, fetchOptions);

    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Report proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}