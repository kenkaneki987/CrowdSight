// Debug page to check environment variables
export default function Debug() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      <h2>Environment Variables:</h2>
      <pre>
        NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}
      </pre>
      <h2>API Base URL:</h2>
      <pre>
        {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}
      </pre>
      <h2>Current Host:</h2>
      <pre>
        {typeof window !== 'undefined' ? window.location.host : 'Server Side'}
      </pre>
    </div>
  );
}