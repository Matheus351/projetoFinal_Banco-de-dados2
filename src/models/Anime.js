const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    nome: String,
    episodios: Number,
    estudio:String,
    genero:String
});

const Phone = mongoose.model('smartphone', phoneSchema);

module.exports = Phone;