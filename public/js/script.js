axios('http://localhost:3000/animes')
.then(resp => loadContent(resp.data))


function loadContent(arquivoJson){

 const grid = document.querySelector('.grid')

 for (const anime of arquivoJson){
  const card = document.createElement('div')
  const img = document.createElement('img')
  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const p4 = document.createElement('p')
  const divOptions = document.createElement('div')
  const a1 = document.createElement('a')
  const a2 = document.createElement('a')

  a1.setAttribute('href','#editAnime')
  card.setAttribute('class','card')
  img.setAttribute('src',anime.imagem)
  p1.setAttribute('class','tituloAnime')
  p2.setAttribute('class','generoAnime')
  p3.setAttribute('class','episodiosAnime')
  p4.setAttribute('class','produtoraAnime')
  divOptions.setAttribute('class', "options")

  p1.innerText=`Título:${anime.nome}`
  p2.innerText=`Gênero:${anime.genero}`
  p3.innerText=`Episódios:${anime.episodios}`
  p4.innerText=`Produtora:${anime.produtora}`

  

  const idAnime = anime._id
  card.setAttribute('id',idAnime)

  const buttonEdit = document.createElement('button')
  buttonEdit.innerText='Editar'
  const buttonDelete = document.createElement('button')
  buttonDelete.innerText='Deletar'


  buttonEdit.setAttribute('onclick', `handleEdit('${idAnime}','${anime.nome}','${anime.genero}','${anime.episodios}','${anime.produtora}','${anime.imagem}');`);
  buttonDelete.setAttribute('onclick', `handleDelete('${idAnime}');`);
 

  card.appendChild(img)
  card.appendChild(p1)
  card.appendChild(p2)
  card.appendChild(p3)
  card.appendChild(p4)
  a1.appendChild(buttonEdit)
  a2.appendChild(buttonDelete)
  divOptions.appendChild(a1)
  divOptions.appendChild(a2)
  card.appendChild(divOptions)

  grid.appendChild(card)

}
}
      
function handleEdit(idAnime, nome, genero, episodios, produtora, imagem){

 const formEdit = `
 <div class="titleEdit">
      <h2>Formulário de edição</h2>
      <p>Você está editando o anime ${nome}</p>
 </div>
 <div class="form" id="form">
 <form class="formulario" method="post" action="/animes/${idAnime}">
     <p> </option>Preencha os campos</p>

     <div class="field">
         <label for="nome">Nome do anime:</label>
         <input value="${nome}" type="text" id="nome" name="nome" placeholder="Digite o nome*" required>
     </div> 

     <div class="field">
         <label for="episodios">Episódios</label>
         <input value="${episodios}" type="number" id="episodios" name="episodios" placeholder="Qtde. episódios">
     </div>

     <div class="field">
         <label for="genero">Genero</label>
         <input value="${genero}" type="text" id="genero" name="genero" placeholder="Especifique o gênero*" required>
     </div>

     <div class="field">
        <label for="produtora">Produtora</label>
        <input value="${produtora}" type="text" id="produtora" name="produtora" placeholder="Especifique a produtora*" required>
     </div>

     <div class="field">
         <label for="imagem">Imagem</label>
         <input  value="${imagem}" type="text" id="imagem" name="imagem" placeholder="Especifique um link para imagem*" required>
     </div>

     <input type="submit" value="Salvar">
 </form> 
`

const form = document.querySelector('.editAnime')
form.innerHTML=formEdit

}



function handleDelete(idAnime){
    console.log('deletando...')
 axios.delete(`http://localhost:3000/animes/${idAnime}`)
 .then(resp => window.location.href="http://localhost:3000")
 .catch(err=>{
    console.log(err)
  })

}
