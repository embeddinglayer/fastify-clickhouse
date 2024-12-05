# Fastify ClickHouse

A Fastify plugin that simplifies access to the ClickHouse client.

Code rewritten from [Fastify Prisma plugin](https://github.com/joggrdocs/fastify-prisma/blob/main/src/index.ts) to instead use the ClickHouse client.

## Installation

NPM

```bash
npm i fastify-clickhouse
```

Yarn

```bash
yarn add fastify-clickhouse
```

## Usage

You can register it with the clickhouse client config

```javascript
import fastifyClickHouse from 'fastify-clickhouse';
await server.register(fastifyClickHouse, {
    clientConfig: {
        url: 'localhost:8123',
        username: "USERNAME",
        password: "PASSWORD"
    }
});
```

Or pass a ClickHouse client instance

```javascript
import { createClient } from '@clickhouse/client';

const clickhouse = await createClient({
    url: 'localhost:8123',
    username: "USERNAME",
    password: "PASSWORD"
});

server.register(fastifyClickHouse, clickhouse);
```

- [ClickHouse Javascript Documentation](https://github.com/ClickHouse/clickhouse-js)
  