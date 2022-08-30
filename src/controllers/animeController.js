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

    await session.run(`CREATE(a:Anime{nome:"${req.body.nome}",genero:"${req.body.genero}",episodios:${req.body.episodios},produtora:"${req.body.produtora}",imagem:"${req.body.imagem}"})
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

    const session = neo4j.session()

    const anime = await Anime.find({_id:id},{__v:false});
   
    try {
       const result = await session.run(`MATCH(a:Anime{nome:"${anime[0].nome}"})
       DETACH DELETE a`) 
       const animesShounen = []
       const animesFound = result.records

       animesFound.forEach((record, index, animesFound)=>{
           const anime = animesFound[index].get(0).properties
           animesShounen.push(anime)
       } 
       )
    } catch (error) {
        console.log('Erro na busca:',error)
        resp.status(400).send('Falha ao encontrar animes')
    }

    await session.close()


    
    const result = await Anime.deleteOne({_id:id});

    if(result.deletedCount > 0){
        resp.status(200).send('Anime removido!');
    }else{
        resp.status(400).send('Anime não encontrado');
    }
};


const searchAnimesShounen = async(req,resp)=>{
   
    const session = neo4j.session()
    
    try {
       const result = await session.run(`MATCH(a:Anime)-[:GENERO_DE]->(g:Genero{genero:"Shounen"}) return a`) 
       const animesShounen = []
       const animesFound = result.records

       animesFound.forEach((record, index, animesFound)=>{
           const anime = animesFound[index].get(0).properties
           animesShounen.push(anime)
       } 
       )
       resp.status(200).send(animesShounen)
    } catch (error) {
        console.log('Erro na busca:',error)
        resp.status(400).send('Falha ao encontrar animes')
    }

    await session.close()
}

const searchAnimesFantasy = async(req,resp)=>{
   
    const session = neo4j.session()
    
    try {
       const result = await session.run(`MATCH(a:Anime)-[:GENERO_DE]->(g:Genero{genero:"Fantasia"}) return a`) 
       const animesShounen = []
       const animesFound = result.records

       animesFound.forEach((record, index, animesFound)=>{
           const anime = animesFound[index].get(0).properties
           animesShounen.push(anime)
          
       } 
       )
       resp.status(200).send(animesShounen)
    } catch (error) {
        console.log('Erro na busca:',error)
        resp.status(400).send('Falha ao encontrar animes')
    }

    await session.close()
}
module.exports = {addAnime, getAllAnimes, updateAnime, deleteAnime, getAnime, searchAnimesShounen,searchAnimesFantasy};