import { createClient } from 'redis';
import { redis } from './config';

const url = `redis://${redis.host}:${redis.port}`;
const client = createClient({ url });
if (redis.usePassword.toUpperCase() === 'YES') {
    client.auth(redis.password).then(r => {});
}

console.log('Redis Client loaded!!!');
export default client;
