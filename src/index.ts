/**
 * Code sourced from https://github.com/joggrdocs/fastify-prisma/blob/main/src/index.ts
 * Forked to work with ClickHouse instead of Prisma.
*/
import { createClient as createClickHouseClient, ClickHouseClient, ClickHouseClientConfigOptions } from '@clickhouse/client';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Override FastifyInstance interface to include the clickhouse decorator.
 */
declare module 'fastify' {
    interface FastifyInstance {
        clickhouse: ClickHouseClient;
    }
}

type FastifyClickHouse = FastifyPluginAsync<fastifyClickHouse.FastifyClickHouseOptions>;

declare namespace fastifyClickHouse {

    interface FastifyClickHouseOptionsWithClient {
        client: ClickHouseClient;
    }

    interface FastifyClickHouseOptionsWithoutClient {
        clientConfig?: ClickHouseClientConfigOptions;
    }

    export type FastifyClickHouseOptions =
        | FastifyClickHouseOptionsWithClient
        | FastifyClickHouseOptionsWithoutClient;

    export const fastifyClickHouse: FastifyClickHouse;
    export { fastifyClickHouse as default };
}

const plugin = async (
    fastify: FastifyInstance,
    opts: fastifyClickHouse.FastifyClickHouseOptions
): Promise<void> => {
    if (!fastify.hasDecorator('clickhouse')) {
        const client = await createClient(opts);
        fastify.decorate('clickhouse', client);
        fastify.addHook('onClose', async (server) => {
            await server.clickhouse.close();
        });
    } else {
        throw new Error(
            'fastify-clickhouse has already been registered.'
        );
    }
};

export default fp(plugin, {
    name: 'fastify-clickhouse',
    fastify: '5.x',
});

const createClient = async (
    pluginOptions: fastifyClickHouse.FastifyClickHouseOptions
): Promise<ClickHouseClient> => {
    if ('client' in pluginOptions) {
        return pluginOptions.client;
    } else {
        return createClickHouseClient(pluginOptions.clientConfig);
    }
};