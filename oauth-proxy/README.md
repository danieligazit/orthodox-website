# Decap CMS OAuth Proxy

This Cloudflare Worker handles GitHub OAuth authentication for Decap CMS when hosting on GitHub Pages.

## Setup Instructions (Using GitHub Actions - Recommended)

### 1. Get Cloudflare Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account (or create one if needed)
3. Go to **Workers & Pages** → **Overview**
4. Note your **Account ID** (visible in the URL or sidebar)
5. Go to **My Profile** → **API Tokens** → **Create Token**
6. Use the **Edit Cloudflare Workers** template, or create a custom token with:
   - **Account** → **Workers Scripts** → **Edit**
   - **Zone** → **Workers Routes** → **Edit** (if using custom domain)
7. Copy the API token (you won't see it again!)

### 2. Get GitHub OAuth Credentials

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App (or edit your existing one with App ID: `Ov23liBCC2xuzIwQ3irZ`)
3. Set the **Authorization callback URL** to: `https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/callback`
   - You'll get the exact URL after deploying (step 4)
   - For now, use a placeholder like `https://decap-oauth-proxy.YOUR-SUBDOMAIN.workers.dev/callback`
4. Copy the **Client ID** and generate a **Client Secret**

### 3. Set GitHub Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets (only needed for deployment):
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token from step 1
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID from step 1

**Note:** `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` will be set directly in Cloudflare Workers (step 5), not as GitHub secrets.

### 4. Deploy the Worker

The worker will deploy automatically when you push changes to the `oauth-proxy/` directory:

1. Commit and push the `oauth-proxy/` directory to your repository
2. Go to **Actions** tab in GitHub
3. The workflow will run automatically
4. After deployment succeeds, check the workflow logs for the worker URL
5. The URL will be something like: `https://decap-oauth-proxy.YOUR-SUBDOMAIN.workers.dev`

**Note:** `SITE_URL` is already configured in `wrangler.toml`, so you only need to set the GitHub OAuth secrets.

### 5. Set Worker Secrets (After First Deployment)

After the first deployment, you need to set the GitHub OAuth secrets in Cloudflare. You can do this via Cloudflare Dashboard (easiest):

**Using Cloudflare Dashboard (Recommended)**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**
2. Click on your worker (`decap-oauth-proxy`)
3. Go to **Settings** → **Variables and Secrets**
4. Under **Secrets**, click **Add secret** and add:
   - `GITHUB_CLIENT_ID` - Your GitHub OAuth Client ID
   - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth Client Secret

**Using Wrangler CLI (Alternative)**
If you prefer CLI, install wrangler once and set secrets:
```bash
npm install -g wrangler
wrangler login
cd oauth-proxy
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

### 6. Update GitHub OAuth App Callback URL

After deploying, update your GitHub OAuth App's callback URL to:
```
https://YOUR-WORKER-URL/callback
```

### 7. Update Decap CMS Config

Update `public/admin/config.yml` to use the proxy:

```yaml
backend:
  name: github
  repo: danieligazit/orthodox-records
  branch: main
  base_url: https://YOUR-WORKER-URL
```

Remove the `auth_type: pkce` and `app_id` lines.

## Testing

1. Visit your worker's health endpoint: `https://YOUR-WORKER-URL/health`
2. Should return "OK"

## Troubleshooting

- Make sure all secrets are set correctly
- Verify the callback URL in GitHub OAuth App matches your worker URL
- Check Cloudflare Worker logs: `wrangler tail`

