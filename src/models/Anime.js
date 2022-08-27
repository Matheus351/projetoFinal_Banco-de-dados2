const mongoose = require('../database/mongo');

const animeSchema = new mongoose.Schema({
    nome: String,
    episodios: Number,
    estudio:String,
    genero:String,
    produtora:String,
    imagem:String
});

const Anime = mongoose.model('anime', animeSchema);

module.exports = Anime;