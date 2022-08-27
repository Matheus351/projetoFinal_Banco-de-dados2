require('dotenv').config();

const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

app.get("/edit", (req, res) => {
    res.sendFile(__dirname + "/formEdit.html");
});


const animeController = require('./src/controllers/animeController');

app.post('/save/animes', animeController.addAnime);

app.get('/animes', animeController.getAllAnimes);

app.get('/animes/:id', animeController.getAnime);

app.post('animes/:id', animeController.updateAnime);

app.delete('/animes/:id', animeController.deleteAnime);


app.listen(3000, ()=>{
    console.log(`Servidor rodando na porta 3000`);
});