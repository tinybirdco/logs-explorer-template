# Log Analytics Template

This is a template for a log analytics web application. It is built with Next.js and Tinybird.

You can use this template to bootstrap logging analytics for any software project. Take it and make it your own!

Get started by forking the repository and then customizing it to your needs.

## Quick Start

<p align="left">
  <a href="https://app.tinybird.co?starter_kit=https://github.com/tinybirdco/log-analytics-template/tinybird">
    <img width="200" src="https://img.shields.io/badge/Deploy%20to-Tinybird-25283d?style=flat&labelColor=25283d&color=27f795&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAwIDQyLjhsLTE1Ni4xLTQyLjgtNTQuOSAxMjIuN3pNMzUwLjcgMzQ1LjRsLTE0Mi45LTUxLjEtODMuOSAyMDUuN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii42Ii8+PHBhdGggZD0iTTAgMjE5LjlsMzUwLjcgMTI1LjUgNTcuNS0yNjguMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" />
  </a>
</p>

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flog-analytics-template&project-name=tinybird-log-analytics-template&repository-name=tinybird-log-analytics-template&demo-description=Custom%20analytics%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flog-analytics.tinybird.co&demo-image=//github.com/tinybirdco/log-analytics-starter-kit/blob/main/dashboard/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY)

Append the `tinybird/fixtures/logs.ndjson` file to the `logs` Data Source.

## Local Development

Start Tinybird locally:

```bash
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
NEXT_PUBLIC_TINYBIRD_API_URL=http://localhost
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

## Deployment

Deploy the Tinybird project to the cloud:

```bash
cd tinybird
tb --cloud deploy --auto --wait
```

Once deployed copy your Tinybird cloud host and `read_pipes` token, [deploy the Next.js application to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flog-analytics-template&project-name=tinybird-log-analytics-template&repository-name=tinybird-log-analytics-template&demo-description=Custom%20analytics%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flog-analytics.tinybird.co&demo-image=//github.com/tinybirdco/log-analytics-starter-kit/blob/main/dashboard/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY) and configure the environment variables.

