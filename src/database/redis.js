require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
    url:'redis://localhost:6379'
});

async function redisConnection(){
  await client.connect();
}

redisConnection()
.then(resp=>console.log('Conectado ao redis'))
.catch(err=>console.log(err))

module.exports = client;