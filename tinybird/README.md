
## Getting Started

Start Tinybird locally:

```bash
cd tinybird
tb local start
tb login
tb dev
token ls  # copy an admin token
```

Deploy the Tinybird project to the cloud:

```bash
cd tinybird
tb --cloud deploy
```

## Customization

Adapt the [logs.datasource](./datasources/logs.datasource) and pipes accordingly to match your application's log schema.

Once you've made the changes in Tinybird, instrument your application and adapt the `tinybird.ts` library and components accordingly to support the new pipes and parameters.

## Mock Data

You can use the [mockingbird-cli](https://github.com/tinybirdco/mockingbird?tab=readme-ov-file#cli) to generate mock data for the application.

```bash
cd tinybird
export TB_LOCAL_TOKEN=<YOUR_TINYBIRD_LOCAL_ADMIN_TOKEN>
TB_ENDPOINT=http://localhost mockingbird-cli tinybird \
--schema "mocks/logs.json" \
--datasource "logs" \
--token $TB_LOCAL_TOKEN \
--endpoint "custom" \
--eps 100 \
--limit 200000000
```

You can stream mock data to Tinybird Cloud by using your Workspace host and append token.

Update the [mocks/logs.json](./mocks/logs.json) file to match your application's log schema.

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