## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tinybird Integration

The project uses the [Tinybird](https://tinybird.co) API to fetch the data and display it in the dashboard.

There are three components that use the Tinybird API:

**1. GenericCounter.tsx**

The [generic_counter](../../tinybird/endpoints/generic_counter.pipe) pipe is used to fetch the data for the side bar filters.

**2. LogTableWithPagination.tsx**

The [log_analysis](../../tinybird/endpoints/log_analysis.pipe) pipe is used to fetch the data for the log analysis table.

**3. TimeSeriesChart.tsx**

It uses the [log_timeseries](../../tinybird/endpoints/log_timeseries.pipe) pipe to fetch the data for the time series chart using [Tinybird charts](https://www.npmjs.com/package/@tinybirdco/charts).

The [./lib/tinybird.ts](./src/lib/tinybird.ts) file contains the Tinybird client and the pipes used to fetch the data for the side bar filters and the log analysis table.

## Customization

See the [tinybird/README.md](../../tinybird/README.md) file for more information on how to customize the template by adapting the `logs` schema and pipes.

Once you've made the changes in Tinybird adapt the `tinybird.ts` library and components accordingly to support the new pipes and parameters.
