# Backoffice setup

One-time setup after the Firebase project is connected (`.env.local` filled in from `.env.local.example`).

## 0. Enable Auth providers

Firebase Console → Authentication → Sign-in method → enable **Email/Password** (for admin login) and **Anonymous** (used by the public live chat widget to identify visitors without requiring them to sign up).

## 1. Create the first admin user

Firebase Console → Authentication → Users → Add user. Set an email + password — this is what you'll use to sign in at `/admin/login`.

## 2. Grant admin access

Signing in alone is not enough — Firestore security rules only allow writes from users with an `admin: true` custom claim. Run this once (locally, with `.env.local` populated) for each admin account:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase-admin/app');
const { cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\n'),
  }),
});

getAuth(app)
  .getUserByEmail('YOUR_ADMIN_EMAIL_HERE')
  .then((user) => getAuth(app).setCustomUserClaims(user.uid, { admin: true }))
  .then(() => console.log('Admin claim set.'));
"
```

Replace `YOUR_ADMIN_EMAIL_HERE` with the email from step 1. The user must sign out and back in for the claim to take effect on their session cookie.

## 3. Deploy Firestore rules

Copy `firestore.rules` into Firebase Console → Firestore Database → Rules, or deploy via the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## 4. Seed starting content (optional)

The public site will render an empty state until content exists in Firestore. Add at least one document to `services`, `news`, and `portfolio` from the Backoffice (`/admin`) so the site isn't blank on first load.

## 5. Gemini API key (for Live Chat auto-reply)

Get a key from [Google AI Studio](https://aistudio.google.com/apikey) and put it in `GEMINI_API_KEY` in `.env.local`. Add a few entries in `/admin/faq` — the chat bot only answers from what's there; without any FAQ entries it will tell visitors a team member will follow up.

## 6. Google Maps API key (for the real map on the Contact page)

The Contact page embeds a real Google Map of the office address. Without a key it falls back to Google's free "no-key" embed trick, which some browsers/networks block.

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → enable **Maps Embed API**.
2. Create an API key (Credentials → Create Credentials → API key).
3. Restrict the key to **Maps Embed API** and, under Application restrictions, add your production domain (and `localhost` for local dev) as an allowed HTTP referrer.
4. Put the key in `.env.local` as `GOOGLE_MAPS_EMBED_API_KEY`.

The Maps Embed API is free up to a generous monthly quota (no credit card charge under normal traffic for a single office map).
