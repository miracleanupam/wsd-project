import { Pool } from '../deps.js';
import { config } from '../config/config.js';

const CONCURRENT_CONNECTIONS = 5;

const connectionPool = new Pool(config.database, CONCURRENT_CONNECTIONS);

const getClient = () => {
    return new Client(config.database);
}

const executeQuery = async (query, ...args) => {
    const client = await connectionPool.connect();
    try {
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        await client.release();
    }
}

export { executeQuery };
