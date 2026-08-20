# LifeProof - Firebase Authentication & Firestore Setup

This directory contains Firebase configuration and security rules for LifeProof.

## ⚙️ Required Firebase Console Settings

To ensure Google Login and Firestore run smoothly:

1. **Authentication Providers**:
   - Go to **Firebase Console** &rarr; **Authentication** &rarr; **Sign-in method**.
   - Click **Add new provider** &rarr; select **Google**.
   - Toggle **Enable**, choose your Project support email, and click **Save**.
   - (Optional) Enable **Email/Password** if you want to support direct email accounts.

2. **Authorized Domains**:
   - In **Authentication** &rarr; **Settings** &rarr; **Authorized domains**.
   - If running locally, ensure `localhost` and `127.0.0.1` are in the list.
   - When deploying to production (e.g. GitHub Pages, Vercel, Firebase Hosting), add your domain here.

3. **Cloud Firestore Database**:
   - Go to **Firestore Database** &rarr; **Create Database**.
   - Start in **Production mode** (or test mode during initial setup).
   - In the **Rules** tab, deploy the rules provided in `firebase/firestore.rules`.
