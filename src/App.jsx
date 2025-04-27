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
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="text-center py-8 bg-gradient-to-r from-indigo-400 to-purple-400">
				<h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white">
					Pokedex
				</h1>
			</header>

			{/* Banner */}
			<div
				className="w-full h-64 bg-center bg-cover"
				style={{ backgroundImage: `url(${Banner})` }}
			/>

			{/* Controls */}
			<div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-6 px-4">
				{!showingPokedex && (
					<button
						onClick={showPokedexPokemon}
						className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 active:scale-95"
					>
						View Team
					</button>
				)}
				<SearchBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					handleSearch={handleSearch}
				/>
				<button
					onClick={handleGoBack}
					className="px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg shadow hover:bg-indigo-500 hover:text-white active:scale-95"
				>
					Go Back
				</button>
			</div>

			{/* Content */}
			<main className="px-4">
				{!selectedPokemon ? (
					<InfiniteScroll
						dataLength={pokemons.length}
						next={loadMorePokemon}
						hasMore={Boolean(nextURL)}
						loader={<p className="text-center text-indigo-500">Loading...</p>}
						endMessage={
							<p className="text-center text-indigo-500">No more Pokémon</p>
						}
					>
						<PokemonList
							pokemons={pokemons}
							onPokemonSelect={handlePokemonSelect}
						/>
					</InfiniteScroll>
				) : (
					<PokemonDetails
						pokemon={selectedPokemon}
						addToPokedex={addToPokedex}
					/>
				)}
			</main>
		</div>
	);
}

export default App;
