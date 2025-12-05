// Frontend API proxy for admin report status updates
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
    
    // Add body for PUT requests
    if (body && method === 'PUT') {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Forward the request to the backend admin status update endpoint
    const response = await fetch(
      `${backendUrl}/api/reports/admin/reports/${reportId}/status`, 
      fetchOptions
    );

    // Handle different response types
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      console.error('Failed to parse status update response as JSON:', text);
      return res.status(response.status).json({
        success: false,
        error: 'Invalid response from server',
        details: text.substring(0, 200)
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Admin status update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}