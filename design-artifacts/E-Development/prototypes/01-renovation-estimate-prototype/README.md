# Renovation Estimate Visual Prototype

Responsive React prototype for the three-step renovation estimate flow:

1. Address Search
2. Renovation Details
3. Estimated Renovation Cost

## Prerequisites

- Node.js 20 or later
- npm
- Access to the internal CoreLogic Artifactory repositories
- npm authentication configured for Artifactory

The prototype depends on the internal package `@ensemble/lib@6.1.9`. If
installation returns `401` or `403`, connect to the company network or VPN and
confirm that your npm Artifactory credentials are current.

## Start locally

From the repository root:

```bash
cd design-artifacts/E-Development/prototypes/01-renovation-estimate-prototype
npm ci
npm run dev
```

Open:

```text
http://localhost:5173/renocalc/ceshllg/search
```

Select `400 Catherine Street Lilyfield NSW 2040`, choose `Internal`, then
`Kitchen` to progress through all three pages. The Details and Result routes
are guarded and redirect to the appropriate earlier step when the required
flow state is missing.

To expose the server to other devices on the local network:

```bash
npm run dev -- --host 0.0.0.0
```

## Other commands

```bash
npm test       # Run the automated tests
npm run build  # Type-check and create the production build in dist/
```
