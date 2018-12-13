import * as knex from "knex";

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL
}

const client = knex(config);

export default client;