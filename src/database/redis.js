require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
    url:`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

async function redisConnection(){
  await client.connect();
}

redisConnection()
.then(resp=>console.log('Conectado ao redis'))
.catch(err=>console.log(err))

module.exports = client;