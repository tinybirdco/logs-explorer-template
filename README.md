# Vercel Log Drains Explorer Template

This is a template for a Vercel Log Drains Explorer web application. It is built with Next.js and [Tinybird](https://tinybird.co).

This is a fork of the [Logs Explorer Template](https://github.com/tinybirdco/logs-explorer-template) with some modifications to make it work with Vercel Log Drains.

Fork it and make it your own!

## Quick Start

Deploy the Tinybird and Next.js to the cloud to get started quickly.

<p align="left">
  <a href="https://app.tinybird.co?starter_kit=https://github.com/alrocar/vercel-logs-explorer-template/tinybird">
    <img width="200" src="https://img.shields.io/badge/Deploy%20to-Tinybird-25283d?style=flat&labelColor=25283d&color=27f795&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAwIDQyLjhsLTE1Ni4xLTQyLjgtNTQuOSAxMjIuN3pNMzUwLjcgMzQ1LjRsLTE0Mi45LTUxLjEtODMuOSAyMDUuN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii42Ii8+PHBhdGggZD0iTTAgMjE5LjlsMzUwLjcgMTI1LjUgNTcuNS0yNjguMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" />
  </a>
</p>

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falrocar%2Fvercel-logs-explorer-template&project-name=vercel-logs-explorer-template&repository-name=vercel-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/alrocar/vercel-logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard/log-analyzer)

Configure your [Vercel Log Drains webhook](https://www.tinybird.co/docs/get-data-in/guides/ingest-vercel-logdrains).

Configure Environment Variables and you are ready to go:

```bash
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=<YOUR_TINYBIRD_REGION_HOST>
```

## Local Development

Get started by forking the [GitHub repository](https://github.com/alrocar/vercel-logs-explorer-template) and then customizing it to your needs.

Start Tinybird locally:

```bash
curl -LsSf https://tbrd.co/fwd | sh
cd tinybird
tb local start
tb login
tb dev
token ls  # copy an admin token
```

Configure the Next.js application:

```bash
cd dashboard/log-analyzer
cp .env.example .env
```

Edit the `.env` file with your Tinybird API key and other configuration.

```bash
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=http://localhost:7181
```

Start the Next.js application:

```bash
cd dashboard/log-analyzer
npm install
npm run dev
```

Open the application in your browser:

```bash
http://localhost:3000
```

Read the [dashboard/log-analyzer/README.md](./dashboard/log-analyzer/README.md) file for more information on how to use the application and [tinybird/README.md](./tinybird/README.md) for more information on how to customize the template.

## Deployment

Deploy the Tinybird project to the cloud:

```bash
cd tinybird
tb --cloud deploy
```

Once deployed copy your Tinybird cloud host and `read_pipes` token, [deploy the Next.js application to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falrocar%2Fvercel-logs-explorer-template&project-name=vercel-logs-explorer-template&repository-name=vercel-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/alrocar/vercel-logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard/log-analyzer) and configure the environment variables.

