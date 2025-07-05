const pokemonId = localStorage.getItem('selectedPokemonId'); //Coleto o ID armazenado na chamada index/main;
if (!pokemonId) {
    alert("ID do Pokemón não encontrado;")
    window.location.href = 'index.html'
}
console.log(pokemonId)

async function fetchPokemonDetails (id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Erro ao buscar Pokemon:", error);
    }
};

function populateBasicInfo(pokemon) {
    // Nome
    document.querySelector('#dados h1').textContent = pokemon.name;

    // Número
    document.querySelector('#number span').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

    // Tipos
    const tipoContainer = document.querySelector('#dados div');
    const primaryType = pokemon.types[0].type.name.toLowerCase();
    setHeaderGradient(primaryType);
    tipoContainer.innerHTML = ''; // limpa antes
    pokemon.types.forEach(t => {
    const span = document.createElement('span');
    span.textContent = t.type.name;
    span.classList.add(`${t.type.name.toLowerCase()}`);
    tipoContainer.appendChild(span);
    });

    // Imagem
    document.querySelector('#imgPokemon').src = pokemon.sprites.other.home.front_default;
    document.querySelector('#imgPokemon').alt = pokemon.name;
}

async function init() {
    const pokemon = await fetchPokemonDetails(pokemonId);
    if (!pokemon) return;

    populateBasicInfo(pokemon);

    const speciesData = await fetchSpeciesData(pokemon.species.url);
    if (speciesData) {
        populateAboutTab(pokemon, speciesData);
    }

    populateStatusTab(pokemon);
}

// Botão de voltar
document.getElementById('backButton').addEventListener('click', function() {
    console.log("cliquei aqui")
    window.location.href = 'index.html';
});

function setHeaderGradient(type) {
    const root = document.documentElement;
    const typeColors = {
        normal: '#a6a877',
        grass: '#77c850',
        fire: '#ee7f30',
        water: '#678fee',
        electric: '#f7cf2e',
        ground: '#dfdf69',
        flying: '#a98ff0',
        poison: '#a040a0',
        fighting: '#bf3029',
        ice: '#98e4f1',
        psychic: '#f65687',
        dark: '#725847',
        rock: '#b8a137',
        bug: '#a8b720',
        ghost: '#6e5896',
        stell: '#b9b7cf',
        dragon: '#6f38f6',
        fairy: '#f9aec7'
    };
    const selectedColor = typeColors[type] || '#78C850'; // fallback: grass
    root.style.setProperty('--dinamic-color', selectedColor);
}

// Coração de favoritar.
const heartIcon = document.getElementById('heartIcon');
    if (heartIcon) {
        heartIcon.addEventListener('click', () => {
        heartIcon.classList.toggle('bi-heart');
        heartIcon.classList.toggle('bi-heart-fill');
        heartIcon.classList.toggle('favorited'); // Adiciona a classe favorited para aplicação de CSS
    }
)}

async function fetchSpeciesData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar species data:', error);
    }
}

function populateAboutTab(pokemon, speciesData) {
    // Altura e peso
    document.getElementById('height').textContent = (pokemon.height / 10).toFixed(1) + ' m';
    document.getElementById('weigth').textContent = (pokemon.weight / 10).toFixed(1) + ' kg';

  // Habilidades
    const abilitiesDiv = document.querySelector('.abilities');
    abilitiesDiv.innerHTML = '';
    pokemon.abilities.forEach(a => {
        const span = document.createElement('span');
        span.classList.add('ability');
        span.textContent = a.ability.name;
        abilitiesDiv.appendChild(span);
    });

    // Espécie
    const genus = speciesData.genera.find(g => g.language.name === 'en');
    document.getElementById('species').textContent = genus ? genus.genus : 'Unknown';

    // Descrição
    document.getElementById('description').textContent = getDescription(speciesData);

    // Gênero
    const genderRate = speciesData.gender_rate;
    const malePercent = ((8 - genderRate) / 8 * 100).toFixed(1) + '%';
    const femalePercent = ((genderRate / 8) * 100).toFixed(1) + '%';
    document.querySelector('.gender.male span').textContent = malePercent;
    document.querySelector('.gender.female span').textContent = femalePercent;

    // Egg Groups
    const eggContainer = document.querySelector('.egg-groups');
    eggContainer.innerHTML = '';
    speciesData.egg_groups.forEach(group => {
        const span = document.createElement('span');
        span.classList.add('egg-group');
        span.textContent = group.name;
        eggContainer.appendChild(span);
    });

    // Ciclos
    const hatchCounter = speciesData.hatch_counter;
    const minSteps = 255 * hatchCounter;
    const maxSteps = 255 * (hatchCounter + 1);
    document.querySelector('.breeding-grid .info-group:last-child p').textContent =
        `${hatchCounter} (${minSteps.toLocaleString()}–${maxSteps.toLocaleString()} passos)`;
}

function getDescription(speciesData) {
    const entry = speciesData.flavor_text_entries.find(
        e => e.language.name === 'en'
    );
    return entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : 'Descrição não encontrada.';
}

function populateStatusTab(pokemon) {
    const statMap = {
        hp: 'stsHp',
        attack: 'stsAttack',
        defense: 'stsDefense',
        'special-attack': 'stsSpAtk',
        'special-defense': 'stsSpDef',
        speed: 'stsSpeed'
    };

    let total = 0;

    pokemon.stats.forEach(s => {
        const value = s.base_stat;
        total += value;

        const statId = statMap[s.stat.name];
        if (statId) {
        document.getElementById(statId).textContent = value;
        
        const bar = document.querySelector(`#${statId}`).previousElementSibling.querySelector('.stat-bar');
        if (bar) {
            bar.style.width = `${value / 2}%`; // ajusta escala: valor máximo 200
        }
        }
    });

    // Atualiza Total
    document.getElementById('stsTotal').textContent = total;
    const totalBar = document.querySelector('#stsTotal').previousElementSibling.querySelector('.stat-bar');
    if (totalBar) {
        totalBar.style.width = `${(total / 720) * 100}%`; // baseado em total máximo possível
    }
}

// Inicia todo o processo.
init();