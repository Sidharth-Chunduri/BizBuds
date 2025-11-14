# Deployment Guide

## Firebase Setup (Required)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "bizbudz-learnhub")
4. Follow the setup wizard

### 2. Enable Firebase Services
1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider
   - Save changes

2. **Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for now)
   - Select a location (preferably close to your users)

### 3. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app (</>) icon
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

### 4. Update Firebase Configuration
Replace the placeholder values in `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Seed Initial Data (Optional)
After deploying, open your deployed app's browser console and run:
```javascript
seedFirebaseData()
```

## GitHub Pages Deployment

### 1. Repository Setup
1. Ensure your code is pushed to GitHub
2. Make sure the repository is named correctly (the Vite config assumes "BizBudzLearnHub")

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages (in sidebar)
3. Source: **GitHub Actions** (not Deploy from branch)

### 3. Deploy
1. Push to main branch or make any commit
2. GitHub Actions will automatically build and deploy
3. Check Actions tab for deployment status
4. Your site will be available at: `https://yourusername.github.io/BizBudzLearnHub/`

## Important Notes

### Security Considerations
- **Firebase Security Rules:** Currently set to test mode (public access)
- **Production Rules:** Update Firestore rules for production:

```javascript
// Firestore Security Rules (Basic)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions are public read, admin write
    match /sessions/{document} {
      allow read: if true;
      allow write: if false; // Only admins should write sessions
    }
    
    // Notes are public read, authenticated write
    match /notes/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User stats - users can read/write their own
    match /userStats/{document} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Comments, likes, signups - authenticated users only
    match /{path=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Limitations
- **Static Site:** Server-side functionality replaced with Firebase
- **Authentication:** Uses Firebase Auth instead of Passport
- **Database:** Uses Firestore instead of PostgreSQL
- **Real-time:** Can add real-time features using Firestore listeners

### Troubleshooting
1. **Build fails:** Check Firebase config is properly set
2. **404 errors:** Ensure base path in vite.config.ts matches repo name
3. **Auth issues:** Verify Firebase Auth is enabled and configured
4. **Data not loading:** Check Firestore security rules and seeding

## Local Development
```bash
npm install
npm run dev
```

Make sure Firebase config is set up for local development to work properly.