# Push-up Pact — Setup Guide

## 1. Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Give it a name (e.g. `pushup-pact`) and click through the wizard.
3. Once created, click **Firestore Database** in the left sidebar → **Create database** → start in **test mode** (you can lock it down later).
4. Click the **</>** (Web) icon on the project overview page to register a web app. Copy the `firebaseConfig` values.

## 2. Environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values from your Firebase config:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 on your phone (make sure your phone is on the same Wi-Fi, then use your computer's local IP instead of `localhost`).

## 4. Deploy (optional)

The easiest free option is **Firebase Hosting**:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public dir: dist, single-page app: yes
npm run build
firebase deploy
```

You'll get a public URL you can both bookmark or add to your home screens.

## 5. Add to home screen

- **iOS**: Open the URL in Safari → Share → Add to Home Screen
- **Android**: Open in Chrome → Menu → Add to Home Screen

## Firestore security rules (recommended after testing)

In the Firebase console → Firestore → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // personal app — open access
    }
  }
}
```

Since this is a private app between two people and the data isn't sensitive, open rules are fine.
