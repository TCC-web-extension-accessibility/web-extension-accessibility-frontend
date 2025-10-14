# 🚀 Deployment Setup Guide

This guide will help you deploy both the **Admin App** (Vercel) and **Widget** (Cloudflare Pages) using **100% free services**.

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free) - [vercel.com](https://vercel.com)
- Cloudflare account (free) - [cloudflare.com](https://cloudflare.com)

## 🔧 Setup Instructions

### 1. **Cloudflare Pages Setup** (Widget Hosting)

1. **Login to Cloudflare Dashboard**

   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**

2. **Create Two Projects:**

   - **Production**: `accessibility-widget`
   - **Development**: `accessibility-widget-dev`

3. **Get API Credentials:**
   - Go to **My Profile** → **API Tokens**
   - Create token with **Cloudflare Pages:Edit** permissions
   - Get your **Account ID** from the right sidebar

### 2. **Vercel Setup** (Admin Hosting)

1. **Login to Vercel Dashboard**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository

2. **Configure Project:**

   - Set **Root Directory**: `apps/admin`
   - **Framework**: Next.js
   - **Build Command**: `cd ../.. && pnpm run build:admin`

3. **Get API Credentials:**
   - Go to **Settings** → **Tokens**
   - Create new token
   - Get **Team ID** and **Project ID** from project settings

### 3. **GitHub Secrets Configuration**

Add these secrets to your GitHub repository:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

```bash
# Cloudflare Secrets
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id

# Vercel Secrets
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### 4. **Environment Variables Setup**

#### **Vercel Environment Variables:**

In your Vercel project dashboard:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
NEXT_PUBLIC_WIDGET_URL=https://accessibility-widget.pages.dev
```

## 🚀 How It Works

### **Automatic Deployments:**

1. **Widget Deployment:**

   - Push changes to `apps/widget/**` or `configs/widget/**`
   - GitHub Actions automatically builds and deploys to Cloudflare Pages
   - **Production**: `main` branch → `https://accessibility-widget.pages.dev`
   - **Development**: `develop` branch → `https://accessibility-widget-dev.pages.dev`

2. **Admin Deployment:**
   - Push changes to `apps/admin/**`
   - GitHub Actions automatically deploys to Vercel
   - **Production**: `main` branch → `https://your-admin.vercel.app`
   - **Preview**: Other branches → Preview URLs

### **Manual Deployments:**

- Go to **Actions** tab in GitHub
- Run **"Deploy Widget to Cloudflare Pages"** or **"Deploy Admin to Vercel"**
- Choose environment (production/development)

## 📁 Project Structure

```bash
├── .github/workflows/
│   ├── pipeline_widget.yaml    # Widget deployment
│   └── deploy-admin.yml        # Admin deployment
├── configs/widget/
│   ├── production.json         # Production widget config
│   └── development.json        # Development widget config
├── scripts/
│   └── generate-widget-env.js  # Config → ENV converter
├── apps/
│   ├── admin/                  # → Vercel
│   └── widget/                 # → Cloudflare Pages
```

## 🔧 Configuration Management

### **Widget Feature Configuration:**

Edit files in `configs/widget/` to enable/disable features:

```json
{
  "features": {
    "languageSelector": { "enabled": true },
    "accessibilityProfiles": { "enabled": true },
    "widgetControls": {
      "contrast": { "enabled": true },
      "reader": { "enabled": false },
      "fontSize": { "enabled": true }
      // ... more features
    }
  }
}
```

**When you commit changes to config files, the widget automatically rebuilds with only enabled features!**

## 🎯 URLs After Deployment

- **Admin (Production)**: `https://your-project.vercel.app`
- **Widget (Production)**: `https://accessibility-widget.pages.dev/widget.js`
- **Widget (Development)**: `https://accessibility-widget-dev.pages.dev/widget.js`

## 🔍 Testing Your Deployment

1. **Test Widget Loading:**

   ```html
   <script src="https://accessibility-widget.pages.dev/widget.js" defer></script>
   ```

2. **Test Admin Panel:**
   - Visit your Vercel URL
   - Login to admin interface
   - Check if widget loads on the admin pages

## 💰 Cost Breakdown: **$0/month**

| Service          | Usage            | Free Tier           | Cost   |
| ---------------- | ---------------- | ------------------- | ------ |
| GitHub Actions   | ~50 builds/month | 2,000 minutes       | $0     |
| Vercel           | Admin hosting    | 100GB bandwidth     | $0     |
| Cloudflare Pages | Widget CDN       | Unlimited bandwidth | $0     |
| **Total**        |                  |                     | **$0** |

## 🆘 Troubleshooting

### **Widget Build Fails:**

- Check if `configs/widget/{env}.json` exists
- Verify all feature names match exactly
- Check GitHub Actions logs

### **Admin Deploy Fails:**

- Verify Vercel secrets are correct
- Check if `apps/admin/vercel.json` is properly configured
- Ensure build command runs successfully locally

### **Scripts Don't Run:**

- Verify Node.js version (18+) in workflows
- Check if `scripts/generate-widget-env.js` exists
- Ensure `pnpm` is available in CI

## 🎉 Next Steps

1. **Set up the secrets** using the guide above
2. **Push to main branch** to trigger first deployment
3. **Visit GitHub Actions** to watch deployments
4. **Test both URLs** when deployments complete

Your infrastructure is now **production-ready** and **100% free**! 🚀
