import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import Banner from "../src/assets/poke-banner.jpg";

function App() {
	const [pokemons, setPokemons] = useState([]);
	const [nextURL, setNextURL] = useState(
		"https://pokeapi.co/api/v2/pokemon?limit=20"
	);
	const [initialLoad, setInitialLoad] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [searched, setSearched] = useState(false);
	const [pokedex, setPokedex] = useState([]);
	const [showingPokedex, setShowingPokedex] = useState(false);

	const addToPokedex = (pokemon) => {
		setPokedex((prevPokedex) => [...prevPokedex, pokemon]);
		console.log(pokedex);
	};

	const showPokedexPokemon = () => {
		console.log(pokemons);
		setShowingPokedex(true);
		setPokemons([]);
		setPokemons((prevPokemon) => [...prevPokemon, ...pokedex]);
	};

	const handleSearch = () => {
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
			.then((response) => {
				const result = response.data;
				setPokemons([result]);
				setSearched(true);
				setShowingPokedex(false);
			})
			.catch((err) => console.error(err));
	};

	const fetchPokes = () => {
		setSearched(false);
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
				setPokemons([]);
				setPokemons((prev) => [...prev, ...detailedPokemons]);
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
					className="m-3 px-2 border-2 border-amber-400 rounded text-2xl hover:bg-amber-300 hover:text-slate-800 active:scale-90 transition"
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
			{searched || showingPokedex ? (
				<button onClick={fetchPokes}>Go Back</button>
			) : (
				""
			)}
			{/* Render InfiniteScroll only after the initial load */}
			{!initialLoad || showingPokedex ? (
				<PokemonList
					pokemons={pokemons}
					addToPokedex={addToPokedex}
				></PokemonList>
			) : (
				<InfiniteScroll
					dataLength={pokemons.length}
					next={loadMorePokemon}
					hasMore={Boolean(nextURL)}
					loader={""}
					endMessage={<p>No more Pokémon</p>}
				>
					<PokemonList
						pokemons={pokemons}
						addToPokedex={addToPokedex}
					></PokemonList>
				</InfiniteScroll>
			)}
		</div>
	);
}

export default App;
