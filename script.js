const pokemonList = document.querySelector('#pokemonList');
const typeFilter = document.querySelector('#typeFilter');
const resetButton = document.querySelector('#resetButton');
const searchBar = document.querySelector('#searchBar');

// async function fetchs(){
//     const res =  await fetch('https://pokeapi.co/api/v2/pokemon/16/');
//     const data = await res.json();
//     console.log(data);
//  }
//  fetchs()



let pokemonArray = [];

// Fetch Pokémon and Populate List
const fetchPokemon = async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type/');
        const data = await response.json();

        // Populate Type Filter
        data.results.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            typeFilter.appendChild(option);
        });

        let cardCount = 0; // Counter to limit the cards
        for (let type of data.results) {
            if (cardCount >= 150) break; // Stop fetching if 150 cards are reached

            const res = await fetch(type.url);
            const typeData = await res.json();
console.log(typeData);

            typeData.pokemon.forEach(async (pokemonObj) => {
                if (cardCount >= 150) return; // Stop processing once limit is reached

                const pokemon = pokemonObj.pokemon;
                const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

                // Fetch additional details for sprites
                const pokemonDetailResponse = await fetch(pokemon.url);
                const pokemonDetails = await pokemonDetailResponse.json();

                // Collect sprites for generation III
                const generationIII = pokemonDetails.sprites['versions']['generation-iii'];
                const spriteImages = {
                    colosseum: generationIII?.colosseum?.front_default || '',
                    emerald: generationIII?.emerald?.front_default || '',
                    fireredLeafgreen: generationIII?.['firered-leafgreen']?.front_default || '',
                    rubySapphire: generationIII?.['ruby-sapphire']?.front_default || '',
                    xd: generationIII?.xd?.front_default || '',
                };

                pokemonArray.push({
                    id: pokemonId,
                    name: pokemon.name,
                    type: type.name,
                    sprites: spriteImages,
                });

                cardCount++; // Increment the card count
                if (cardCount <= 150) displayPokemon(pokemonArray); // Display only if under limit
            });
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
};

// Display Pokémon Cards
const displayPokemon = (pokemonListArray) => {
    pokemonList.innerHTML = '';
    const limitedArray = pokemonListArray.slice(0, 150); // Limit to 150 cards

    if (limitedArray.length === 0) {
        pokemonList.innerHTML = `<p>No Pokémon found!</p>`;
        return;
    }

    limitedArray.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        // Add Flip Interaction
        pokemonCard.addEventListener('click', () => {
            pokemonCard.classList.toggle('flipped');
        });

        pokemonCard.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <p>Type: ${pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)}</p>
                    <div class="sprite-container">
                        <img src="${pokemon.sprites.colosseum}" alt="Colosseum Sprite" title="Colosseum">
                        <img src="${pokemon.sprites.emerald}" alt="Emerald Sprite" title="Emerald">
                        <img src="${pokemon.sprites.fireredLeafgreen}" alt="FireRed/LeafGreen Sprite" title="FireRed/LeafGreen">
                        <img src="${pokemon.sprites.rubySapphire}" alt="Ruby/Sapphire Sprite" title="Ruby/Sapphire">
                        <img src="${pokemon.sprites.xd}" alt="XD Sprite" title="XD">
                    </div>
                </div>
                <div class="card-back">
                    <p>Abilities, Stats, or Evolutions Coming Soon!</p>
                </div>
            </div>
        `;
        pokemonList.appendChild(pokemonCard);
    });
};

// Search Pokémon by Name
searchBar.addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredPokemon = pokemonArray.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchQuery)
    );
    displayPokemon(filteredPokemon);
});

// Filter by Type
typeFilter.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    if (selectedType) {
        const filteredPokemon = pokemonArray.filter(pokemon => pokemon.type === selectedType);
        displayPokemon(filteredPokemon);
    }
});

// Reset Button
resetButton.addEventListener('click', () => {
    displayPokemon(pokemonArray);
    searchBar.value = '';
    typeFilter.value = '';
});

// Initialize Pokémon List
fetchPokemon();
