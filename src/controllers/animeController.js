const Anime = require('../models/Anime');
const mongoose = require('../database/mongo')

const getAnime = async (req, resp) =>{
    let id = mongoose.Types.ObjectId(req.params.id);
    const anime = await Anime.find({_id:id},{__v:false});
    if(anime.length > 0){
        resp.status(200).send(anime);
    }else{
        resp.status(400).send('Anime não encontrado');
    }
};


const addAnime = async (req, resp) =>{

    const anime = new Anime(req.body);
    anime.save()
    .then(()=>{
        resp.redirect('/')
    })
    .catch(err=>{
        resp.status(400).send('Falha ao salvar');
    });

};

const getAllAnimes = async (req, resp) =>{

    const animes = await Anime.find({},{__v:false});
    resp.status(200).send(animes);

}

const updateAnime = async (req, resp) =>{
    
  let id = mongoose.Types.ObjectId(req.params.id);
    Anime.findOneAndUpdate(
    {_id:id},{$set:{nome:req.body.nome,episodios:req.body.episodios,estudio:req.body.estudio,genero:req.body.genero,imagem:req.body.imagem}}
        ).exec(function(err,res){
            if(err) {
                resp.status(500).send(err);
            } else {
               resp.redirect('/')
            }
        })
}

const deleteAnime = async (req, resp)=>{

    let id = mongoose.Types.ObjectId(req.params.id);
    const result = await Anime.deleteOne({_id:id});

    if(result.deletedCount > 0){
        resp.status(200).send('Anime removido!');
    }else{
        resp.status(400).send('Anime não encontrado');
    }
};


module.exports = {addAnime, getAllAnimes, updateAnime, deleteAnime, getAnime};