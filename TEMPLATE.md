This is a template for a log analytics web application. It is built with Next.js and [Tinybird](https://tinybird.co).

You can use this template to bootstrap logging analytics for any software project. Fork it and make it your own!

## Quick Start

Deploy the Tinybird and Next.js to the cloud to get started quickly.

<p align="left">
  <a href="https://app.tinybird.co?starter_kit=https://github.com/tinybirdco/log-analytics-template/tinybird">
    <img width="200" src="https://img.shields.io/badge/Deploy%20to-Tinybird-25283d?style=flat&labelColor=25283d&color=27f795&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAwIDQyLjhsLTE1Ni4xLTQyLjgtNTQuOSAxMjIuN3pNMzUwLjcgMzQ1LjRsLTE0Mi45LTUxLjEtODMuOSAyMDUuN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii42Ii8+PHBhdGggZD0iTTAgMjE5LjlsMzUwLjcgMTI1LjUgNTcuNS0yNjguMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" />
  </a>
</p>

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flog-analytics-template&project-name=tinybird-log-analytics-template&repository-name=tinybird-log-analytics-template&demo-description=Custom%20analytics%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flog-analytics.tinybird.co&demo-image=//github.com/tinybirdco/log-analytics-starter-kit/blob/main/dashboard/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY)

Configure your Tinybird environment variables in Vercel:

```
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=<YOUR_TINYBIRD_HOST_REGION>
```

Append the `tinybird/fixtures/logs.ndjson` file to the `logs` Data Source or stream some mock data.

## Local Development

Get started by forking the repository and then customizing it to your needs.

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

## Instrumenting your application

To instrument your application, just send JSON objects to the Tinybird [Events API](https://www.tinybird.co/docs/get-data-in/ingest-apis/events-api).

```typescript
const data = {
    timestamp: new Date().toISOString(),
    level: 'info',
    service: 'my-app',
    message: 'This is a test message',
    request_id: '1234567890',
    environment: 'development',
    status_code: 200,
    response_time: 100,
    request_method: 'GET',
    request_path: '/',
    host: 'my-app.com',
    user_agent: req.headers.get('user-agent')
}
await fetch(
    `https://<YOUR_TINYBIRD_HOST>/v0/events?name=logs`,
    {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${process.env.TINYBIRD_APPEND_TOKEN}` },
    }
)
```

The example above uses the [logs](./tinybird/datasources/logs.datasource) Data Source and schema in this template but you can use your own Data Source and schema, append logs and build your own logging analytics application.

Check the [examples](./examples) folder for some examples of how to do this with different languages, services and schemas.

## Building a log aggregator with Vector

Vector is a log aggregator that is used to collect, process, and store logs built by DataDog.

You can use Vector to collect logs from different sources and send them to a Tinybird Sink.

Check the [examples/vector](./examples/vector) folder for an example of how to do this with Vector.

## Deployment

Deploy the Tinybird project to the cloud:

```bash
cd tinybird
tb --cloud deploy
```

Once deployed copy your Tinybird cloud host and `read_pipes` token, [deploy the Next.js application to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flog-analytics-template&project-name=tinybird-log-analytics-template&repository-name=tinybird-log-analytics-template&demo-description=Custom%20analytics%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flog-analytics.tinybird.co&demo-image=//github.com/tinybirdco/log-analytics-starter-kit/blob/main/dashboard/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY) and configure the environment variables.

