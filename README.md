# Radicle Explorer Self

A fork of **Radicle Explorer** to give you a personalized web UI for your Radicle repositories.

## What you configure

All project-specific branding and defaults live in `config/default.json`, under `owner`:

- `owner.did`: your Radicle DID (used to list your repos)
- `owner.sitename`, `owner.description`, `owner.bio`: shown in OpenGraph or the UI
- `owner.url`: your public site URL
- `owner.avatar`: avatar path (eg. `/khalid.png` in `public/`)
- `owner.repos.perPage`: number of repositories to show per page in owner view (homepage)
- `owner.repos.pinned`: pinned repo RIDs shown in owner view

The images are under `public/images`. Replace them accordingly without changing their names.

## Quick start (local)

**Prerequisites**

* Recent versions of [Node.js][nod] (20.9.0 or higher) and [npm][npm] installed

```shell
git clone https://rosa.radicle.xyz/z3wSfGTKhTTx4p4R4dSUFtiWAHp7p.git radicle-explorer-self
cd radicle-explorer-self
npm install
npm start
```

Open: http://localhost:3000

## Build for deployment

``` shell
npm run build
```

Serve the generated `build/` directory using any static hosting service.

### SPA rewrite rule

The explorer is a single-page application (SPA). To ensure that all routes are handled correctly, add a rewrite rule to your web server configuration. For example:

Example (Caddy):

```
example.com {
    rewrite * /index.html
}
```

## Repo aliases

The project will generate `config/repos.json` (name → RID mapping) so you can use URLs like `baseURL/repoAlias`instead of `baseURL/repoRID`.

Generate it:

``` shell
npm run repos
```

Notes:
- `config/repos.json` is **generated** by `scripts/generate-repos` at build time and is **gitignored**.
- It fetches repositories for `owner.did` from `preferredSeeds[0]`.
- When you create a new repository on Radicle, you wouldn't be able to use `baseURL/repoAlias` until you regenerate `config/repos.json`.

## Configuration options

### `config/local.json` (recommended for private overrides)

1. Copy [`default.json`][def] to a new file in the same directory called
   `local.json`.
2. Modify the properties in `local.json` to suit your setup.

## License

GPLv3 (see `LICENSE`).
