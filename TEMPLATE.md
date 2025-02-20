This is a template for a custom log analytics web application. It is built with Next.js and [Tinybird](https://tinybird.co).

You can use this template to bootstrap logging analytics for any software project. Fork it and make it your own!

## Quick Start

Deploy the project to [Tinybird](https://app.tinybird.co?starter_kit=https://github.com/tinybirdco/logs-explorer-template/tinybird) and [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flogs-explorer-template&project-name=tinybird-logs-explorer-template&repository-name=tinybird-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY) to get started quickly.

Configure your Tinybird environment variables in Vercel:

```sh
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=<YOUR_TINYBIRD_HOST_REGION>
```

Append the `tinybird/fixtures/logs.ndjson` file to the `logs` Data Source or stream some mock data.

## Local Development

Get started by forking the repository and then customizing it to your needs.

Start Tinybird locally:

```sh
cd tinybird
tb local start
tb login
tb dev
token ls  # copy an admin token
```

Configure the Next.js application:

```sh
cd dashboard/log-analyzer
cp .env.example .env
```

Edit the `.env` file with your Tinybird API key and other configuration.

```sh
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=http://localhost:7181
```

Start the Next.js application:

```sh
cd dashboard/log-analyzer
npm install
npm run dev
```

Open the application in your browser:

```sh
http://localhost:3000
```

Read the [dashboard/log-analyzer/README.md](https://github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/README.md) file for more information on how to use the application and [tinybird/README.md](https://github.com/tinybirdco/logs-explorer-template/blob/main/tinybird/README.md) for more information on how to customize the template.

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

The example above uses the [logs](https://github.com/tinybirdco/logs-explorer-template/blob/main/tinybird/datasources/logs.datasource) Data Source and schema in this template but you can use your own Data Source and schema, append logs and build your own logging analytics application.

Check the [examples](https://github.com/tinybirdco/logs-explorer-template/tree/main/examples) folder for some examples of how to do this with different languages, services and schemas.

## Building a log aggregator with Vector

Vector is a log aggregator that is used to collect, process, and store logs built by DataDog.

You can use Vector to collect logs from different sources and send them to a Tinybird Sink.

Check the [examples/vector](https://github.com/tinybirdco/logs-explorer-template/tree/main/examples/vector) folder for an example of how to do this with Vector.

## Deployment

Deploy the Tinybird project to the cloud:

```sh
cd tinybird
tb --cloud deploy
```

Once deployed copy your Tinybird cloud host and `read_pipes` token, [deploy the Next.js application to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flogs-explorer-template&project-name=tinybird-logs-explorer-template&repository-name=tinybird-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard&integration-ids=oac_uoH2YyxhaS1H6UYvtuRbRbDY) and configure the environment variables.

