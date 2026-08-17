# Media Planner Frontend

Next.js frontend and backoffice for the Media Planner website. The public site is currently Thai-only and redirects unprefixed routes to `/th`. Admin users manage CMS content, media, and site data through `/admin`.

## Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Firebase Auth, Firestore, Storage, and Hosting
- CSS Modules
- TipTap rich text editing for admin content

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Fill in the Firebase web app and Admin SDK values in `.env.local`. Keep real secrets out of git; `.env.local` is ignored.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site will redirect to `/th`.

## Environment Variables

Required for Firebase client features:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Required for server-side Firebase Admin access:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Optional:

- `GOOGLE_MAPS_EMBED_API_KEY` - enables the keyed Google Maps embed on the contact page.
- `NEXT_PUBLIC_SITE_URL` - used for canonical and Open Graph URLs. Defaults to `http://localhost:3000`.
- `GEMINI_API_KEY` - reserved by the environment template for server-side AI integrations.

## Main Routes

- `/th` - public homepage
- `/th/about`
- `/th/services`
- `/th/services/[slug]`
- `/th/portfolio`
- `/th/portfolio/[id]`
- `/th/news`
- `/th/news/[id]`
- `/th/contact`
- `/admin/login` - admin sign-in
- `/admin` - protected backoffice

## Admin Setup

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for the Firebase one-time setup:

- Enable Firebase Auth providers.
- Create the first admin user.
- Grant the `admin: true` custom claim.
- Deploy Firestore rules.
- Seed starting CMS content.
- Configure optional Google Maps support.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run deploy
npm run clients:set-non-ipo-to-pr:dry-run
npm run clients:set-non-ipo-to-pr
```

Notes:

- `npm run deploy` deploys Firebase Hosting using `firebase.json`.
- The client category scripts update Firestore client records; run the dry-run script first.

## Project Structure

```text
src/app/(site)/[locale]     Public localized website routes
src/app/(admin)/admin       Backoffice routes and layout
src/app/api                 API routes
src/components              Shared site components
src/components/admin        Admin UI components
src/lib/cms                 CMS data access and types
src/lib/firebase            Firebase client/admin helpers
src/lib/i18n                Locale configuration
src/lib/dictionaries        Thai copy dictionary
scripts                     Maintenance scripts
public                      Static images and videos
```

## Deployment

The app is configured for Firebase Hosting with framework support in `asia-east1`.

```bash
npm run build
npm run deploy
```

Deploy Firestore rules separately when they change:

```bash
firebase deploy --only firestore:rules
```
