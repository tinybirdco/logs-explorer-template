This is a template for a Logs Explorer web application. It is built with Next.js and Tinybird.

Use this template to bootstrap a multi-tenant, user-facing logs explorer for any software project. Fork it and make it your own!

## Set up the project

Fork the GitHub repository and deploy the data project to Tinybird.

```bash
# select or create a new workspace
tb login

# deploy the template
tb --cloud deploy --template https://github.com/tinybirdco/logs-explorer-template/tree/main/tinybird

# copy the dashboard token
tb --cloud token copy read_pipes
```

Deploy the [dashboard to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flogs-explorer-template&project-name=tinybird-logs-explorer-template&repository-name=tinybird-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard/log-analyzer)

Configure your Tinybird environment variables in Vercel:

```sh
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_READ_PIPES_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=<YOUR_TINYBIRD_HOST_REGION>
```

## Instrument your application

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

## Local Development, multi-tenancy and more

See the GitHub repository [README.md](https://github.com/tinybirdco/logs-explorer-template)
