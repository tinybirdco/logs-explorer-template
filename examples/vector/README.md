[Vector](https://vector.dev/) is a log aggregation tool that is used to collect, process, and store logs built by DataDog.

You can use Vector to collect logs from different sources and send them to a Tinybird Sink.

In this example, we will use Vector to collect logs from a syslog source and a docker source and send them to a Tinybird Sink via the Events API.

## Getting Started

Install Vector and start the Tinybird Local instance.

```bash
brew install vector
tb local start
tb dev
tb > token ls
```

export your Tinybird token and host as environment variables.

```bash
export TINYBIRD_TOKEN=
export TINYBIRD_HOST=
```

## Run the example

```bash
vector -vv --config vector_syslog.yaml
```

That will start the Vector instance and send demo syslog logs to the local Tinybird Sink via the Events API.

You can check the logs in the Tinybird Sink by running the following command:

```bash
tb dev
tb > select count() from syslog
```