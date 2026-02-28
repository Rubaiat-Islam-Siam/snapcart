# Vercel Deployment Guide for Google OAuth

## Problem
Google login works on localhost but redirects to login page on Vercel deployment (snapcart-nu-lime.vercel.app).

## Solution

### 1. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://snapcart-nu-lime.vercel.app/api/auth/callback/google
   ```
6. If you have a custom domain, add that too
7. Click **Save**

### 2. Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

```
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=https://your-app-url.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
MONGO_URL=your_mongodb_connection_string_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_BASE_URL=https://your-app-url.vercel.app
NEXT_PUBLIC_SOCKET_SERVER=your_socket_server_url
GEMINI_API_KEY=your_gemini_api_key_here
GMAIL=your_gmail_address@gmail.com
PASS=your_gmail_app_password_here
```

**Important**: The most critical variables for Google OAuth are:
- `AUTH_SECRET`
- `NEXTAUTH_URL` (must match your production URL)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 3. Redeploy Your Application

After setting the environment variables:
1. Go to **Deployments** tab in Vercel
2. Click the three dots (**...**) on the latest deployment
3. Click **Redeploy**
4. OR push a new commit to trigger automatic deployment

### 4. Verify the Configuration

After redeployment:
1. Visit `https://snapcart-nu-lime.vercel.app/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's login page
4. After authenticating, you should be redirected back to your app

## Common Issues

### Issue: Still redirecting to login page
**Solution**: 
- Clear your browser cookies for the site
- Make sure `NEXTAUTH_URL` exactly matches your deployment URL
- Check Vercel logs for any errors

### Issue: "redirect_uri_mismatch" error
**Solution**: 
- Double-check the authorized redirect URI in Google Cloud Console
- It must be exactly: `https://snapcart-nu-lime.vercel.app/api/auth/callback/google`

### Issue: Environment variables not working
**Solution**: 
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables (they don't apply to existing deployments)

### Issue: ENOENT: no such file or directory, middleware.js.nft.json
**Solution**: 
- This error occurs when middleware is re-exported from another file
- The middleware logic must be directly in the root `middleware.ts` file
- ✅ Fixed: Moved middleware logic from `src/proxy.ts` to root `middleware.ts`
- Do not use re-export pattern like `export { proxy as middleware } from "./src/proxy"`

## Code Changes Already Made

✅ Added `trustHost: true` to auth configuration (required for NextAuth v5 on Vercel)
✅ Enhanced JWT callback to handle Google sign-in properly
✅ Created middleware.ts file for authentication
✅ Fixed callback URL handling in login page

## Testing

Test the Google login flow:
1. Clear browser cache and cookies
2. Visit your production site
3. Try Google login
4. Should redirect to home or role selection page (not back to login)
