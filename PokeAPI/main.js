const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Referenciamos el DOM
const main_container = document.getElementById("main_container");
const Prev_Button = document.getElementById("previus");
const Sig_Button = document.getElementById("next");

//definimos variables para paginaciòn
let limit = 20;
let offset = 0;

async function Main_Pokemon(page = 0){
  try {
    const response = await fetch(`${BASE_URL}?offset=${page}&limit=${limit}`);
    //const response = await fetch(`${BASE_URL}?offset=${page}&limit=20`
    const data = await response.json();
    //return data.results;

   // const list = await Main_Pokemon();
    const details = await Promise.all(
    data.results.map(pokemon => getPokemon(pokemon.url))
    );
  renderPokemon(details);
  updateButtons(page);
    
  } 

  catch (error) {
    console.error('Error al consultar los pokémons', error);
    return [];
  }

}


async function getPokemon(pokemonUrl){
  try {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    //renderPokemon(data);
    return {
      name: data.name,
      order: data.id,
      image: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      abilities: data.abilities.map(a => a.ability.name),
    }
    
  } 
  catch (error) {
    console.error('Error al consultar los Pokémons', pokemonUrl, error);
    return null;
  }
}


function renderPokemon(Poke)
{
  main_container.innerHTML = ""; // limpiamos el contenedor
  
  Poke.forEach(parameter => 
    {
    
    const card = document.createElement("div");

    card.className = "card"; 

    
    card.innerHTML = `  
         <h2>${parameter.order}</h2>
         <h2>${parameter.name}</h2>
         <img class="character-image" src="${parameter.image}" alt="${parameter.name}" />  
         <p style="font-size: 1.2rem;"> 📛 Tipos: ${parameter.types.join(`, `)}</p>
         <p style="font-size: 1.2rem;"> 📍 Habilidades: ${parameter.abilities.join(`, `)}</p>
        `;
        
        main_container.appendChild(card); // añadir la tarjeta al contenedor de personajes
  });

}

function updateButtons(pagina){
  Prev_Button.disabled = pagina === 0;
  Sig_Button.disabled = pagina === 200;
  
}

Prev_Button.addEventListener('click', () => 
  {
      if(offset > 0){
          offset = offset - 20; // disminuir la página actual
          //offsetFin = offsetFin -20;
         Main_Pokemon(offset);
          
      }
  })
  
  // Evento click para el botón "siguiente"
  Sig_Button.addEventListener('click', () => {
      if(offset <= 200 ){
          offset = offset + 20;
         // offsetFin = offsetFin + 20;
          Main_Pokemon(offset); 
      }
  })








Main_Pokemon();