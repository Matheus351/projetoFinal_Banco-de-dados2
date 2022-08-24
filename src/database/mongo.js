require('dotenv').config();

const mongoose = require('mongoose');


main()
.then(resp => console.log('Conectado ao Mongo'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`);
}

module.exports = mongoose;