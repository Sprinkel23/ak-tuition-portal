# AK Tuition Student Results Portal — Updated Teacher Access

## Teacher access setup

The requested teacher key is configured as a server-side fallback: `AKT-Teach@2026#729`. For better security, set the Netlify environment variable `TEACHER_ACCESS_KEY` to your own private value; when set, it overrides the fallback key. Avoid publishing the project source publicly while using the fallback key.
1. Deploy the **whole project folder** using a Git-connected Netlify site or the Netlify CLI. A static-only drag-and-drop upload may publish the page without deploying the server function. Do not open `index.html` directly from your computer; the secure API requires Netlify.
   - CLI option: install Node.js, open a terminal in this folder, run `npm install`, then `npx netlify login`, `npx netlify init` (link/create a site), and `npx netlify deploy --prod`.
2. In Netlify, open **Site configuration → Environment variables** (sometimes shown under **Project configuration → Environment variables**).
3. To use the built-in key, enter `AKT-Teach@2026#729` on the Teacher Portal. If you set `TEACHER_ACCESS_KEY` in Netlify, enter the exact value you configured instead.
4. If you change the environment variable, save it and trigger a new deploy so the function receives it.
5. Open your deployed website → **Teacher Portal** → enter the matching key → **Sign in**. The key is case-sensitive.

If you see **Failed to fetch** or **Cannot connect to the Netlify API**, the function is not deployed/reachable. Deploy the whole project using Git or Netlify CLI, verify `/.netlify/functions/results?action=teacher-check` is being reached via the app, then redeploy after setting the environment variable. If you see **Invalid teacher access key**, check that `TEACHER_ACCESS_KEY` is exact, the value matches, and you redeployed after saving it. If you open the HTML as a local file or on a host other than Netlify, the function will not run.

## Features
- Student lookup by exact name and roll number.
- Teacher sign-in with show/hide key, Enter-to-sign-in, and sign-out.
- Add, edit, and delete results.
- Results stored in Netlify Blobs so they are shared across devices on the deployed site.
- Print or save result cards as PDF.

## Important privacy note
The teacher key is checked by a server-side Netlify Function; it is not embedded in the HTML. Student lookup still uses name + roll number, which is not strong authentication. For real student data, add a student PIN/OTP or another access control before public use.

## Local testing
Install Node.js, run `npm install`, set `TEACHER_ACCESS_KEY` in a local `.env` file (never commit it), then run `npx netlify dev`.
