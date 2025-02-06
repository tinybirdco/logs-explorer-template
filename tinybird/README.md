
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
tb --cloud deploy --auto --wait
```

## Customization

Adapt the [logs.datasource](./datasources/logs.datasource) and pipes accordingly to match your application's log schema.

Once you've made the changes in Tinybird adapt the `tinybird.ts` library and components accordingly to support the new pipes and parameters.

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
