<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10de0n0X9ib_-dXrUwbkADFbmPazxMr_E

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Set the Firebase configuration in [.env.local](.env.local). You can find these values in your Firebase project settings.
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Run the app:
   `npm run dev`

## Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project into Vercel.
3. Vercel will automatically detect that it is a Vite project.
4. Add the environment variables (from `.env.local`) to the Vercel project settings.
5. Deploy!
