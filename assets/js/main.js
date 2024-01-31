const pokemonListHtml = document.getElementById('pokemonList');
const divListHtml = document.getElementById('list');
const divDetailstHtml = document.getElementById('details');
const loadingHtml = document.getElementById('loading');
const contentHtml = document.getElementById('content');

const maxRecords = 151; //Get only first generation
const limit = 10;
let offset = 0;

function convertPokemonToHtml(pokemon) {
  return `<li class="pokemon ${pokemon.type}" onclick="getDetails(${pokemon.order})">
        <span class="number">#${pokemon.order}</span>
        <span class="name">${capitalizeFirstLetter(pokemon.name)}</span>

        <div class="detail">
          <ol class="types">
            ${pokemon.types.map(type => `<li class="type ${type}">${capitalizeFirstLetter(type)}</li>`).join('')}
          </ol>
          <img src="${pokemon.imageUrl}" alt="${capitalizeFirstLetter(pokemon.name)}">
        </div>
      </li>`
}

function convertPokemonCardToHtml(pokemon) {
  return `  <div class="card ${pokemon.type}">
              <div class="card-arrow-back" onclick="toggleComponents()">
                <span><img src="./assets/imgs/arrow_left.svg" alt="Back"></span>
              </div>
              <div class="card-header">
                <div class="card-header-info">
                  <span class="name card-name">${capitalizeFirstLetter(pokemon.name)}</span>
                  <div class="card-types">
                    ${pokemon.types.map(type => `<span class="type ${type}">${capitalizeFirstLetter(type)}</span>`).join('')}
                  </div>
                </div>
                <div class="card-number">
                  <span>#${pokemon.order}</span>
                </div>
              </div>
              <div class="card-header-img">
                <img src="${pokemon.imageUrl}" alt="${capitalizeFirstLetter(pokemon.name)}">
              </div>
              <div class="card-body-info">
                <p>About</p>
                <span><strong>Base experience: </strong>${pokemon.experience}</span>
                <span><strong>Height: </strong>${pokemon.height}</span>
                <span><strong>Weigth: </strong>${pokemon.weight}</span>
                <span><strong>Abilities: </strong>${pokemon.abilities.map(ability =>`${capitalizeFirstLetter(ability)}`).join(', ')}</span>
                <p>Images</p>
                <div class="card-body-images">
                  ${pokemon.sprites.map(sprite => `<img src="${sprite}" alt="${pokemon.name}">`).join('')}
                </div>
              </div>
            </div>
          `
}

function getPokemons(offset, limit) {
  enableLoading();
  pokeApi.getPokemons(offset, limit)
  .then((pokemons = []) => {
    pokemonListHtml.innerHTML += pokemons.map(convertPokemonToHtml).join('');
  })
  .finally(() => {
    setTimeout(() => {
      disableLoading();
      divListHtml.scrollIntoView(false)
      ,3000});
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDetails(id) {
  enableLoading();
  pokeApi.getPokemonDetailById(id)
    .then((pokemon) => divDetailstHtml.innerHTML = convertPokemonCardToHtml(pokemon))
    .finally(() => {
      disableLoading();
      toggleComponents();
    })
}

function loadMore() {
  offset += limit
  const qtdRecordsNextPage = offset + limit

  if (qtdRecordsNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    getPokemons(offset, newLimit);

    loadMoreBtnHtml.parentElement.removeChild(loadMoreBtnHtml);
    return;

  } else {
    getPokemons(offset, limit);
  }
}

function toggleComponents() {
  divListHtml.classList.toggle('d-none');
  divDetailstHtml.classList.toggle('d-none');
}

function enableLoading() {
  loadingHtml.classList.remove('d-none');
  contentHtml.classList.add('d-none');
}

function disableLoading() {
  loadingHtml.classList.add('d-none');
  contentHtml.classList.remove('d-none');
}

getPokemons(offset, limit);
