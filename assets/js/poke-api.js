const pokeApi = {};
let results = [];

function convertPokeApiToPokemonModel(pokeApiDetail) {
  const pokemon = new Pokemon();

  pokemon.order = pokeApiDetail.id;
  pokemon.name = pokeApiDetail.name;

  const types = pokeApiDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;
  pokemon.imageUrl = pokeApiDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

function convertPokeApiToPokemonModelCard(pokeApiDetail) {
  const pokemon = convertPokeApiToPokemonModel(pokeApiDetail);

  pokemon.abilities = pokeApiDetail.abilities.map((ability) => ability.ability.name);
  pokemon.experience = pokeApiDetail.base_experience;
  pokemon.height = pokeApiDetail.height;
  pokemon.weight = pokeApiDetail.weight;

  findStringInObj(pokeApiDetail.sprites, 'front_default');

  return pokemon;

  function findStringInObj(obj, string) {
    for (let i in obj) {
      if (obj[i] instanceof Object) { // If element is Object, find inside it too
        findStringInObj(obj[i], string);
      }
      else if (i === string) {
        pokemon.sprites.push(obj[string]);  // If element is string, get atribute
      }
    }
  }
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
          .then(res => res.json())
          .then(convertPokeApiToPokemonModel);
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {

  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(url)
          .then(res => res.json())
          .then(jsonBody => jsonBody.results)
          .then(pokemons => pokemons.map(pokeApi.getPokemonDetail))
          .then(detailRequests => Promise.all(detailRequests))
          .then(pokemonsDetails => pokemonsDetails)
}

pokeApi.getPokemonDetailById = (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  return fetch(url).then(res => res.json()).then(convertPokeApiToPokemonModelCard);
}