require('dotenv').config();

const bodyParser = require('body-parser')
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.listen(process.env.API_PORT, ()=>{
    console.log(`API rodando na porta ${process.env.API_PORT}`);
});