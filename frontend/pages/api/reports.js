// Frontend API proxy for reports
export default async function handler(req, res) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
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
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/reports${queryString}`, fetchOptions);

    // Handle different response types
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, check if it's a payload too large error
      if (response.status === 413) {
        return res.status(413).json({
          success: false,
          error: 'Image file is too large. Please use an image smaller than 5MB.',
          code: 'FILE_TOO_LARGE'
        });
      }
      
      // For other parsing errors, return the raw response
      const text = await response.text();
      console.error('Failed to parse response as JSON:', text);
      return res.status(response.status).json({
        success: false,
        error: 'Invalid response from server',
        details: text.substring(0, 200) // Truncate for security
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Reports proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}