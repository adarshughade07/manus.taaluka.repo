# Taaluka on Netlify

This project can be deployed as a standalone static site on Netlify. It does not require the Manus server, MySQL database, or tRPC API when built with the Netlify configuration.

## Deploy from the source folder

Use the complete source project, not the static-only `dist/public` ZIP. The source project includes `netlify/functions/waitlist-count.mts` and `netlify.toml`; both are required for the live count Function.

1. Upload this project folder to a new Netlify site, or connect the repository.
2. Netlify reads `netlify.toml` automatically.
3. The configured build command installs dependencies and runs `pnpm build:netlify`.
4. The publish directory is `dist/public`.

Netlify uploads the Function from `netlify/functions/` during the same deploy. The Function is available at `/api/waitlist-count`.

If Netlify asks for a package manager, use pnpm. The repository includes `pnpm-lock.yaml` and pins pnpm through `package.json`.

## Netlify Forms

The waitlist form is named `taaluka-waitlist`. Netlify discovers the hidden form in `client/index.html` during the build. The live React form submits URL-encoded `name` and `mobile` values to `/` when the static Netlify build is active.

After the first deployment:

1. Open the Netlify dashboard for the site.
2. Go to **Forms**.
3. Select `taaluka-waitlist` to view submissions or configure notifications.

The page now reads the real `submission_count` for `taaluka-waitlist` through the server-side Netlify Function at `/api/waitlist-count`. The count refreshes on page load, every 30 seconds, and after a successful form submission. The private API token is never sent to the browser.

### Enable the live count

The Function needs a Netlify personal access token with permission to read the site forms:

1. In Netlify, open **User settings → Applications → Personal access tokens** and create a token.
2. In the site, open **Site configuration → Environment variables**.
3. Add `NETLIFY_AUTH_TOKEN` with the token value and make sure its scope includes **Functions**.
4. Trigger a new deploy after saving the variable. `SITE_ID` is supplied automatically by Netlify to Functions.

If the token is missing or the Function has not been redeployed yet, the page safely shows `—` instead of an invented number.

## Exact deployment options

### Option A: Netlify dashboard with a Git repository

1. Extract the complete source ZIP and push its contents to a Git repository.
2. In Netlify, choose **Add new site → Import an existing project** and select that repository.
3. Keep the build settings from `netlify.toml`: build command `pnpm install --frozen-lockfile && pnpm build:netlify`, publish directory `dist/public`, and Functions directory `netlify/functions`.
4. Add `NETLIFY_AUTH_TOKEN` under **Site configuration → Environment variables**, with the **Functions** scope enabled.
5. Deploy or trigger a new deploy after adding the variable.

### Option B: Netlify CLI from the extracted source ZIP

Run these commands from the extracted project root:

```bash
pnpm install --frozen-lockfile
pnpm build:netlify
pnpm --package=netlify-cli dlx netlify login
pnpm --package=netlify-cli dlx netlify link
pnpm --package=netlify-cli dlx netlify deploy --prod --dir=dist/public --functions=netlify/functions
```

Set `NETLIFY_AUTH_TOKEN` in the Netlify site environment variables before deploying. Do not put the token in `client/`, `dist/`, `netlify.toml`, or any committed file. The Function reads it only at runtime.

## Local static build

```bash
pnpm install
pnpm build:netlify
```

The finished upload-ready site is in `dist/public`.
