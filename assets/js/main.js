const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 5;
let offset = 0;

function convertPokemonToList(pokemon) { // Adicionado onclick que chama a função de mostrar detalhes dos pokemons
    return `
        <li class="pokemon ${pokemon.type}" onclick="showPokemonDetail(${pokemon.number})">  
            <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonsItens (offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToList).join('');
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonsItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit
    
    const qtdeRecordNextPage = offset + limit;

    if (qtdeRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonsItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonsItens(offset, limit)
    }
})

// Redireciona para a página de detalhes ao clicar no em algum pokemon.
function showPokemonDetail(pokemonId) {
    // Armazena o ID do Pokémon que será usado na página de detalhes
    localStorage.setItem('selectedPokemonId', pokemonId);
    
    // Redireciona para a página de detalhes
    window.location.href = 'details.html';
}