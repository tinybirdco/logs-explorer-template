# Logs Explorer Template

This is a template for a Logs Explorer web application. It is built with Next.js and [Tinybird](https://tinybird.co).

Use this template to bootstrap a multi-tenant, user-facing logs explorer for any software project. Fork it and make it your own!

Tech Stack:
- Next.js
- Tinybird
- Clerk
- Vercel
- zod-bird
- Tailwind CSS
- Shadcn UI

## Live Demo

- [https://logs.tinybird.app](https://logs.tinybird.app)
- [Watch Demo Video](https://tinybird-blog.ghost.io/content/media/2025/02/1-explorer-features-2.mp4)

## Quick Start

Deploy the Tinybird and Next.js to the cloud to get started quickly.

```bash
# select or create a new workspace
tb login

# deploy the template
tb --cloud deploy https://github.com/tinybirdco/logs-explorer-template/tree/main/tinybird

# copy the dashboard token
tb --cloud token copy read_pipes
```

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flogs-explorer-template&project-name=tinybird-logs-explorer-template&repository-name=tinybird-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard/log-analyzer)

Append the `tinybird/fixtures/logs.ndjson` file to the `logs` Data Source or stream some mock data.

Configure these Environment Variables in your Vercel project and you are ready to go:

```bash
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_ADMIN_TOKEN>
NEXT_PUBLIC_TINYBIRD_API_URL=<YOUR_TINYBIRD_REGION_HOST>
```

Get your Tinybird admin token and region host from the Tinybird dashboard.

## Local Development

Get started by forking the [GitHub repository](https://github.com/tinybirdco/logs-explorer-template) and then customizing it to your needs.

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
NEXT_PUBLIC_TINYBIRD_API_KEY=<YOUR_TINYBIRD_LOCAL_ADMIN_TOKEN>
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

## Multi-tenancy

The template is designed to be multi-tenant. It uses Clerk for authentication and user management.

Configure the `.env` file with your Clerk publishable key and secret.

```bash
CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>
```

Then set the Tinybird JWT secret and workspace ID in the `.env` file.

```bash
TINYBIRD_JWT_SECRET=<YOUR_TINYBIRD_ADMIN_TOKEN>
TINYBIRD_WORKSPACE_ID=<YOUR_TINYBIRD_WORKSPACE_ID>
```

Modify the middleware to adapt the Tinybird token to your tenants.

```typescript
// dashboard/log-analyzer/src/middleware.ts

const token = await new jose.SignJWT({
    workspace_id: process.env.TINYBIRD_WORKSPACE_ID,
    name: `frontend_jwt_user_${userId}`,
    exp: Math.floor(Date.now() / 1000) + (60 * 15), // 15 minute expiration
    iat: Math.floor(Date.now() / 1000),
    scopes: [
      {
        type: "PIPES:READ",
        resource: "log_analysis",
        fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
      },
      {
        type: "PIPES:READ",
        resource: "log_explorer",
        fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
      },
      {
        type: "PIPES:READ",
        resource: "generic_counter",
        fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
      },
      {
        type: "PIPES:READ",
        resource: "log_timeseries",
        fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
      }
    ],
    limits: {
      rps: 10
    }
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
```

Read more about how to integrate Clerk and Tinybird JWT tokens in [this guide](https://www.tinybird.co/docs/publish/api-endpoints/guides/multitenant-real-time-apis-with-clerk-and-tinybird).

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

The example above uses the [logs](./tinybird/datasources/logs.datasource) Data Source and schema in this template but you can use your own Data Source and schema, append logs and build your own logs explorer application.

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

Once deployed copy your Tinybird cloud host and `read_pipes` token, [deploy the Next.js application to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftinybirdco%2Flogs-explorer-template&project-name=tinybird-logs-explorer-template&repository-name=tinybird-logs-explorer-template&demo-description=Custom%20logs%20explorer%20for%20your%20application%20logs%20using%20Tinybird&demo-url=http%3A%2F%2Flogs.tinybird.app&demo-image=//github.com/tinybirdco/logs-explorer-template/blob/main/dashboard/log-analyzer/public/banner.png?raw=true&root-directory=dashboard/log-analyzer) and configure the environment variables.

## Customizing the template

You can use the template as a starting point to build your own logs explorer application or embed components in your own application.

To customize the template, adapt the data sources and pipes in the [tinybird project](./tinybird) and the components in the [Next.js application](./dashboard/log-analyzer).

See how it's done in the [Vercel Log Drains template](https://github.com/alrocar/vercel-logs-explorer-template) and the [Auth0 Log Streams template](https://github.com/tinybirdco/auth0-logs-explorer-template).

## Contributing

Please open an issue or submit a pull request.

## Support

Join the Tinybird [Slack community](https://www.tinybird.co/community) to get help with your project.

## License

MIT License

Copyright (c) 2025 Tinybird.co
