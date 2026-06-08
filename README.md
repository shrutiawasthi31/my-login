# LexReason Login Page

Static login page designed in a premium legal-tech style and ready for GitHub Pages deployment through GitHub Actions.

## Files

- `index.html` - the deployable login page
- `login-reference.png` - the hero image used in the left panel
- `.github/workflows/deploy.yml` - CI workflow that deploys the site to GitHub Pages

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
