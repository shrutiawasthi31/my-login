# LexReason Firebase Login Page

Static login page designed in a premium legal-tech style with Firebase Authentication for Google sign-in and phone OTP login.

## Files

- `index.html` - the deployable login page
- `auth.js` - Google and phone OTP login logic
- `firebase-config.js` - Firebase web configuration placeholders
- `login-reference.png` - the hero image used in the left panel
- `welcome.html` - post-login hello world / welcome page
- `welcome.js` - welcome page session handling and logout
- `.github/workflows/ci.yml` - CI validation workflow
- `.github/workflows/deploy.yml` - Pages deployment workflow

## Firebase setup

1. Create a Firebase project.
2. In Firebase Console, create a Web App.
3. Copy your Firebase web config into `firebase-config.js`.
4. In Firebase Authentication, enable:
   - `Google`
   - `Phone`
5. Add your GitHub Pages domain to authorized domains if needed.
6. For phone auth, use numbers in international format such as `+91xxxxxxxxxx`.

## Local preview

Open `index.html` directly in a browser, or run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub deployment

1. Create a new GitHub repository.
2. Copy these files into that repository.
3. Commit and push to the `main` branch.
4. In GitHub, open `Settings > Pages`.
5. Under `Build and deployment`, choose `Source: GitHub Actions`.
6. Push again if needed, or run the `Deploy Static Site` workflow manually from the `Actions` tab.
7. Your site will be published at:

```text
https://<your-github-username>.github.io/<your-repository-name>/
```

## Suggested git commands

```bash
git init
git add .
git commit -m "Add LexReason login page"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-repository-name>.git
git push -u origin main
```
