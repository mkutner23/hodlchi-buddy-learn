# Security Policy

## Reporting a vulnerability

If you believe you've found a security issue in Hodlchi, please **do not open
a public GitHub issue**. Instead, email the maintainers at
`security@hodlchi.com` (or open a private security advisory on the GitHub
repository if you have access).

Please include:

- A description of the issue and its impact
- Steps to reproduce (or a proof-of-concept)
- Any relevant logs, URLs, or account IDs
- Your name/handle if you'd like to be credited

We will acknowledge your report within **3 business days** and aim to
provide a fix or mitigation within **30 days** for confirmed issues.

## Scope

In scope:

- The Hodlchi web app (`hodlchi.com`, `www.hodlchi.com`, preview URLs)
- The public MCP server at `/mcp`
- Authentication and account flows

Out of scope:

- Denial-of-service attacks
- Social engineering of Hodlchi users or staff
- Vulnerabilities requiring physical access to a user's device
- Reports about missing security headers on marketing pages with no
  authenticated surface

## Data & privacy

Hodlchi stores minimal user data. Learner state (Penny's name, XP, streak)
is kept in browser `localStorage` and — where authentication is present —
in a Supabase-backed database governed by row-level security.

Hodlchi is **educational only**. It does not process real financial
transactions, connect to brokerages, or handle wallets or private keys.

## Safe harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction,
  and service disruption.
- Only interact with accounts they own or have explicit permission to test.
- Give us reasonable time to fix issues before public disclosure.
