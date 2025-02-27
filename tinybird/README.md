


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

## Instrumenting your Vercel Log Drains

Read this guide to learn how to instrument your Vercel Log Drains: [Ingest Vercel Log Drains](https://www.tinybird.co/docs/get-data-in/guides/ingest-vercel-logdrains).