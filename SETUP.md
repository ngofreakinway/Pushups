# Push-up Pact — Setup Guide

## 1. Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Give it a name (e.g. `pushup-pact`) and click through the wizard.
3. Once created, click **Firestore Database** in the left sidebar → **Create database** → start in **test mode** (you can lock it down later).
4. Click the **</>** (Web) icon on the project overview page to register a web app. Copy the `firebaseConfig` values.

## 2. Deploy with AWS Amplify (recommended)

Amplify connects directly to your GitHub repo and builds + hosts the app automatically on every push.

### Step-by-step

1. Go to the [AWS Amplify console](https://console.aws.amazon.com/amplify/home) and click **Create new app**.
2. Choose **GitHub** as the source, authorize AWS, and select the `ngofreakinway/Pushups` repo and the `claude/pushup-tracker-app-JNuxn` branch (or `main` after you merge).
3. On the **Build settings** screen, Amplify will detect the `amplify.yml` in the repo automatically — no manual config needed.
4. Before clicking **Save and deploy**, go to **Advanced settings** → **Environment variables** and add all six Firebase values:

   | Variable | Value |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | `AIza...` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `your-project` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
   | `VITE_FIREBASE_APP_ID` | `1:123:web:abc` |

5. Click **Save and deploy**. Amplify will build and give you a URL like `https://main.d1abc.amplifyapp.com`.

Every push to the branch will trigger a new deploy automatically.

### Optional: custom domain

In the Amplify console → **Custom domains**, you can attach a domain you own (or get a free one via Route 53) so the URL is something like `pushups.yourdomain.com`.

## 3. Run locally

```bash
cp .env.example .env
# fill in your Firebase values
npm install
npm run dev
```

Open http://localhost:5173. To test on your phone over Wi-Fi, replace `localhost` with your computer’s local IP address.

## 4. Add to home screen

- **iOS**: Open the Amplify URL in Safari → Share → Add to Home Screen
- **Android**: Open in Chrome → Menu → Add to Home Screen

## 5. Firestore security rules

In the Firebase console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Since this is a private two-person app with non-sensitive data, open rules are fine.
