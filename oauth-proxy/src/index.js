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
      'Access-Control-Allow-Headers': 'Content-Type',
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
        const redirectUrl = new URL(`${env.SITE_URL}/admin/`);
        redirectUrl.searchParams.set('access_token', tokenData.access_token);
        if (state) {
          redirectUrl.searchParams.set('state', state);
        }

        return Response.redirect(redirectUrl.toString(), 302);
      } catch (error) {
        return new Response(`Error: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
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

