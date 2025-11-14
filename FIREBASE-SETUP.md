# Firebase Hosting Deployment Guide

## ✅ Setup Complete!

Your project is now configured for Firebase Hosting. Here's what's ready:

### Files Created/Updated:
- `firebase.json` - Firebase hosting configuration
- `.firebaserc` - Project configuration (using bizbudz-e80a0)
- `firestore.rules` - Security rules for Firestore
- `firestore.indexes.json` - Database indexes
- Updated `package.json` with deploy scripts
- Updated `vite.config.ts` for Firebase hosting

## 🚀 Deploy Your App

### 1. Login to Firebase (Required)
```bash
npx firebase login
```
This will open a browser window for authentication.

### 2. Deploy Everything
```bash
npm run deploy
```

This will:
- Build your React app
- Deploy to Firebase Hosting
- Deploy Firestore rules and indexes

### 3. Alternative: Deploy Hosting Only
```bash
npx firebase deploy --only hosting
```

## 🔧 Firebase Console Setup

### Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/project/bizbudz-e80a0)
2. Authentication → Sign-in method
3. Enable "Email/Password"

### Enable Firestore
1. Go to Firestore Database
2. Create database in production mode
3. The security rules will be deployed automatically

## 🌐 Your App URL
After deployment, your app will be available at:
**https://bizbudz-e80a0.web.app**

## 📝 Development Commands

```bash
# Run locally
npm run dev

# Build for production
npm run build

# Serve built files locally (for testing)
npm run serve

# Deploy to Firebase
npm run deploy
```

## 🔄 Seed Initial Data

After first deployment:
1. Open your deployed app
2. Open browser developer console
3. Run: `seedFirebaseData()`

This will populate your Firestore with sample sessions and notes.

## 🔒 Security

Your Firestore security rules are already configured to:
- Allow public read access to sessions and notes
- Require authentication for user actions (likes, comments, signups)
- Ensure users can only modify their own data

## 🆘 Troubleshooting

**Build fails:** Check that all Firebase config is correct
**Auth issues:** Ensure Email/Password is enabled in Firebase Console
**Deployment fails:** Make sure you're logged into Firebase CLI
**Data not loading:** Check Firestore rules and run the seed function