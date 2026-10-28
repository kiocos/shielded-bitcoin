# Publishing all versions

The Pages site contains a menu and four independent Slidev builds. Existing source folders and development commands stay in place.

| URL under the site root | Presentation |
| --- | --- |
| `/v2/` | New presentation: from notes to a payment |
| `/original/` | Original presentation |
| `/bitdevs/` | BitDevs talk and Q&A appendix |
| `/study/` | Interactive course in English |

For a repository named `shielded-bitcoin`, the menu will normally be at `https://kiocos.github.io/shielded-bitcoin/`. Each path above is appended to that URL.

## First publication

1. Push this project, including all four source versions and the root lockfile, to one GitHub repository with a `main` branch
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**
3. Run **Actions → Publish presentations → Run workflow**, or push another change to `main`
4. Open the URL shown by the deployment

The workflow builds all four versions into one Pages artifact. Each successful publication replaces that artifact with the complete collection, keeping every registered version available. It uses the Pages configuration to determine the URL prefix, including for a custom domain. No personal access token is needed by the workflow.

## Local preview

```sh
npm run pages:build
npm run pages:preview
```

Open `http://localhost:4173/`. To reproduce a GitHub project URL, build with a prefix:

```sh
npm run pages:build -- --base /shielded-bitcoin/
npm run pages:preview
```

Open `http://localhost:4173/shielded-bitcoin/`. The preview reads the prefix from the build and serves ordinary static files without SPA fallback. Use `-- --port 4174` if the preview port is busy. Stop the server with Ctrl+C.

The publishing build uses Slidev's hash router: a slide link looks like `/v2/#/9` and a presenter link like `/v2/#/presenter/9`. Reloading a slide therefore works on GitHub Pages without custom server rewrites. These options apply only to the publishing build; local development is unchanged.

Speaker notes remain in the published presentations, and the menu offers the three presenter scripts as Markdown downloads. The course has its own built-in reading view. PDF exports are not part of this workflow.

## Adding a version

Create the new presentation in its own folder, then add its title, source directory, URL slug and preparation command to [decks.mjs](decks.mjs). Keep existing entries to preserve their published links. The next build includes it automatically. Update the introductory version count in [index.html](index.html) when adding versions.

The generated site lives in `dist/pages/` and is ignored by Git. Presentation sources, scripts, menu and workflow belong in Git; generated build files do not need a separate branch.

References: [Slidev hosting](https://sli.dev/guide/hosting) · [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
