const Anime = require('../models/Anime');
const mongoose = require('../database/mongo')
const redisClient = require('../database/redis')
const neo4j = require('../database/neo4j')



const getAnime = async (req, resp) =>{
    let id = mongoose.Types.ObjectId(req.params.id);

    const result = await redisClient.get(req.params.id);
    if(result!=null){
        const anime = JSON.parse(result);
        resp.status(200).send(anime);
    }else{
        const anime = await Anime.find({_id:id},{__v:false});
        if(anime.length > 0){
            resp.status(200).send(anime);
            await redisClient.set(req.params.id, JSON.stringify(anime),{EX: 4000});
        }else{
            resp.status(400).send('Anime não encontrado');
        }

    }

   
};

const addInNeo4j = async(req)=>{
    const session = neo4j.session()

    await session.run(`CREATE(a:Anime{nome:"${req.body.nome}",genero:"${req.body.genero}",episodios:${req.body.episodios},produtora:"${req.body.produtora}"})
    WITH a MATCH(g:Genero{genero:"${req.body.genero}"})
    CREATE(a)-[:GENERO_DE]->(g)`)

    await session.close()
}

const addAnime = async (req, resp) =>{

   await addInNeo4j(req).catch(err=>console.log(err))

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