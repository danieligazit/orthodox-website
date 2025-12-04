/**
 * GitHub OAuth Proxy for Decap CMS
 * Deploy this to Cloudflare Workers to handle GitHub OAuth authentication
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // OAuth authorization endpoint
    if (path === '/auth' || path === '/auth/') {
      const clientId = env.GITHUB_CLIENT_ID;
      const redirectUri = `${url.origin}/callback`;
      const state = url.searchParams.get('state') || generateRandomString();
      const scope = url.searchParams.get('scope') || 'repo';

      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('scope', scope);

      return Response.redirect(authUrl.toString(), 302);
    }

    // OAuth callback endpoint
    if (path === '/callback' || path === '/callback/') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        return new Response('Missing authorization code', { 
          status: 400,
          headers: corsHeaders 
        });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          return new Response(`Error: ${tokenData.error_description || tokenData.error}`, {
            status: 400,
            headers: corsHeaders,
          });
        }

        // Redirect back to Decap CMS with the token
        const siteUrl = env.SITE_URL || 'https://danieligazit.github.io/orthodox-website';
        if (!siteUrl || typeof siteUrl !== 'string') {
          return new Response('Error: SITE_URL environment variable is not set', {
            status: 500,
            headers: corsHeaders,
          });
        }
        
        // Set token in a cookie for the proxy to use for API requests
        // Also pass it in URL for Decap CMS to pick up
        const redirectUrl = new URL(`${siteUrl}/admin/`);
        redirectUrl.searchParams.set('access_token', tokenData.access_token);
        if (state) {
          redirectUrl.searchParams.set('state', state);
        }
        if (tokenData.token_type) {
          redirectUrl.searchParams.set('token_type', tokenData.token_type);
        }

        // Create redirect response with cookie
        const response = Response.redirect(redirectUrl.toString(), 302);
        // Set cookie with token (HttpOnly for security, but accessible to proxy)
        // Note: Cloudflare Workers cookies need to be set on the same domain
        // Since we're redirecting to a different domain, we'll pass token in URL
        // and let the admin page store it
        
        return response;
      } catch (error) {
        return new Response(`Error: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Proxy all GitHub API requests
    // When base_url is set, Decap CMS routes all GitHub API calls through the proxy
    if (path.startsWith('/repos/') || path.startsWith('/user') || path.startsWith('/orgs/')) {
      // Get token from Authorization header or query parameter
      let token = null;
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('token ')) {
        token = authHeader.replace('token ', '');
      } else if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else {
        // Try to get from query params (for initial auth)
        token = url.searchParams.get('access_token');
      }
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized - no token provided' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      try {
        // Proxy the request to GitHub API
        const githubUrl = `https://api.github.com${path}${url.search}`;
        const githubResponse = await fetch(githubUrl, {
          method: request.method,
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Decap-CMS',
            ...(request.headers.get('Content-Type') && {
              'Content-Type': request.headers.get('Content-Type'),
            }),
          },
          body: request.method !== 'GET' && request.method !== 'HEAD' 
            ? await request.text() 
            : undefined,
        });
        
        const responseData = await githubResponse.text();
        const contentType = githubResponse.headers.get('Content-Type') || 'application/json';
        
        return new Response(responseData, {
          status: githubResponse.status,
          headers: {
            ...corsHeaders,
            'Content-Type': contentType,
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Health check endpoint
    if (path === '/health' || path === '/health/') {
      return new Response('OK', { headers: corsHeaders });
    }

    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders 
    });
  },
};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

