const redis = require('ioredis');
const { promisify } = require('util');
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

client.on('error', (err) => {
    console.log('Redis Error:', err);
});

client.on("connect", function () {
   console.log("Redis Connection Established");
});

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);


module.exports = {
    client,
    getAsync,
    setAsync,
};
