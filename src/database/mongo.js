require('dotenv').config();

const mongoose = require('mongoose');


main()
.then(resp => console.log('Conectado ao Mongo'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_CONNECTION);
}

module.exports = mongoose;