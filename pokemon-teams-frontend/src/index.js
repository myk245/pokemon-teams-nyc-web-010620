const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainerContainer = document.getElementById("main")

document.addEventListener("DOMContentLoaded", function(event){
   getTrainers()
   // add a listener on the “add pokemon” buttons that triggers a post to that pokemon’s path
   trainerContainer.addEventListener("click", function(event) {
      if (event.target.className === "add-pokemon") {
         addPokemon(event.target.dataset.trainerId)
      }
      if (event.target.className === "release") {
         // when we click on the delete button, we want to delete the event target's parent node
         event.target.parentNode.remove()
         releasePokemon(event.target.dataset.pokemonId)
      }
   })
}); //closing for DOMContentLoaded 

// we need  to handle the request: GET trainers
function getTrainers() {
   fetch(TRAINERS_URL)
   // after fetching the URL, we need to turn the reponse into a JSON object
   .then(function(response) {
      return response.json()
   })
   // now we handle the data and tell the server how we want to handle it 
   // remember that the returned data is an array, so we need to iterate through each element in the array
   .then(function(data) {
      data.forEach(function(trainer) {
         return renderTrainer(trainer)
      })
   })
}

// here we abstract out the renderTrainer function to make our code a bit cleaner
// this function tells the server what to do with the data and how to render everything 
function renderTrainer(trainer) {
// here we are setting up the pokemonTrainerCard element which contains a list we are also creating
   const pokemonTrainerCard = document.createElement("div")
   pokemonTrainerCard.className = "card"
   pokemonTrainerCard.dataset.id = trainer.id
   pokemonTrainerCard.innerHTML = `
   <p>${trainer.name}</p>
   <button class="add-pokemon" data-trainer-id=${trainer.id}>Add Pokemon</button>
   `
   // now we can append the div to the main element 
   trainerContainer.append(pokemonTrainerCard)

   // on each pokemonTrainerCard, we want a list of that trainer's pokemons
   const pokemonList = document.createElement("ul")
   pokemonList.dataset.id = trainer.id
   // append the list to the card 
   pokemonTrainerCard.append(pokemonList)
   // we have to iterate through the trainer's pokemons and create a li element for each one
   // each list element should display the pokemon's nickname and species
   trainer.pokemons.forEach(function(pokemon){
      const pokemonListElement = document.createElement("li")
      pokemonListElement.innerHTML = `
      ${pokemon.nickname}(${pokemon.species}) 
      <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
      ` 
      // here we are appending the lis to the ul
      pokemonList.append(pokemonListElement)
   })
} //closing for handleTrainer function 

// now we handle a POST request to /pokemons
function addPokemon(trainerId) {    
// post to that pokemon's path with its trainerId 
// render the returned data as an li in the correct ul 
   fetch(POKEMONS_URL, {
      method: "POST", 
      headers: {
         "Content-Type": "application/json", 
         "Accept": "application/json"
      }, 
      body: JSON.stringify({ 
         trainer_id: trainerId 
      })  
   })
   .then(function(response) {
      return response.json()
   })
   .then(function(pokemon) {
      if (!pokemon.error) {
         const div = document.querySelector(`[data-id="${pokemon.trainer_id}"]`)
         const ul = div.getElementsByTagName('ul')[0]
         const li = document.createElement("li")

         li.innerHTML = `
         ${pokemon.nickname} (${pokemon.species})
         <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
       `
       ul.append(li)
     } else {
       alert("TOO MANY POKEMON!")
     }
   })
}

function releasePokemon(pokemonId) {  
  fetch(`${POKEMONS_URL}/${pokemonId}`, {
     method: "DELETE"
  })
  .then(response => response.json())
  .then(response => console.log(response))
}
  




// [x] When a user loads the page, they should see all trainers, 
// [x] with their current team of Pokemon.
// [x] Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
// [x] Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.