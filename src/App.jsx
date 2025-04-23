import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import Banner from "../src/assets/poke-banner.jpg";
import PokemonDetails from "./components/PokemonDetails";

function App() {
	const [pokemons, setPokemons] = useState([]);
	const [nextURL, setNextURL] = useState(
		"https://pokeapi.co/api/v2/pokemon?limit=20"
	);
	const [initialLoad, setInitialLoad] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPokemon, setSelectedPokemon] = useState(null);
	const [pokedex, setPokedex] = useState([]);
	const [showingPokedex, setShowingPokedex] = useState(false);

	const handlePokemonSelect = (pokemon) => {
		setSelectedPokemon(pokemon);
		console.log(pokemon);
	};

	const handleGoBack = () => {
		setSelectedPokemon(null);
		setShowingPokedex(false);
		setSearchTerm("");
		fetchPokes();
	};

	const addToPokedex = (pokemonWithMoves) => {
		setPokedex((prevPokedex) => [...prevPokedex, pokemonWithMoves]);
		console.log(pokedex);
	};
	useEffect(() => {
		console.log("pokedex updated", pokedex);
	}, [pokedex]);

	const showPokedexPokemon = () => {
		console.log(pokemons);
		setShowingPokedex(true);
		setSelectedPokemon(null);
		setPokemons(pokedex);
		setNextURL(null);
	};

	const handleSearch = () => {
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
			.then((response) => {
				const result = response.data;
				setPokemons([result]);
				setSelectedPokemon(result);
				setShowingPokedex(false);
			})
			.catch((err) => console.error(err));
	};

	const fetchPokes = () => {
		setSearchTerm("");
		setShowingPokedex(false);
		axios
			.get("https://pokeapi.co/api/v2/pokemon?limit=20")
			.then((response) => {
				const results = response.data.results;
				setNextURL(response.data.next);
				return Promise.all(
					results.map((pokemon) =>
						axios.get(pokemon.url).then((res) => res.data)
					)
				);
			})
			.then((detailedPokemons) => {
				setShowingPokedex(false);
				setPokemons(detailedPokemons);
				setInitialLoad(true); // Mark that initial data has loaded.
			})
			.catch((err) => console.error(err));
	};

	const loadMorePokemon = () => {
		if (nextURL) {
			axios
				.get(nextURL)
				.then((response) => {
					const results = response.data.results;
					setNextURL(response.data.next);
					return Promise.all(
						results.map((pokemon) =>
							axios.get(pokemon.url).then((res) => res.data)
						)
					);
				})
				.then((detailedPokemons) => {
					setShowingPokedex(false);
					setPokemons((prev) => [...prev, ...detailedPokemons]);
				})
				.catch((err) => console.error(err));
		}
	};

	useEffect(() => {
		fetchPokes();
	}, []);

	return (
		<div className="App bg-amber-50">
			<div className="w-full h-40 flex justify-around">
				<h1 className="boldonse-regular text-8xl p-10 bg-gradient-to-r from-cyan-300 to-amber-600 bg-clip-text text-transparent">
					Pokedex
				</h1>
			</div>
			<div
				className="w-full h-96 bg-center bg-cover"
				style={{ backgroundImage: `url(${Banner})` }}
			></div>
			{!showingPokedex ? (
				<button
					className="m-3 px-2 border-2 border-emerald-600 rounded text-2xl hover:bg-emerald-600 hover:text-white active:scale-90 transition hover:cursor-pointer"
					onClick={showPokedexPokemon}
				>
					Team
				</button>
			) : (
				""
			)}
			<SearchBar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleSearch={handleSearch}
			></SearchBar>
			<button
				onClick={handleGoBack}
				className="border rounded border-sky-600 hover:bg-sky-600 hover:text-white transition hover:cursor-pointer"
			>
				Go Back
			</button>
			{!selectedPokemon ? (
				<InfiniteScroll
					dataLength={pokemons.length}
					next={loadMorePokemon}
					hasMore={Boolean(nextURL)}
					loader={""}
					endMessage={<p>No more Pokémon</p>}
				>
					<PokemonList
						pokemons={pokemons}
						onPokemonSelect={handlePokemonSelect}
					/>
				</InfiniteScroll>
			) : (
				<div>
					<PokemonDetails
						pokemon={selectedPokemon}
						addToPokedex={addToPokedex}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
