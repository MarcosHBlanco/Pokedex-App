import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import Banner from "../src/assets/poke-banner.jpg";
import PokemonDetails from "./components/PokemonDetails";
import BUTTON_TYPES from "../src/assets/ButtonTypes.js";

function App() {
	const [allPokes, setAllPokes] = useState([]);
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

	// Serialize and prompt download
	const downloadPokedex = () => {
		const copyPokedexCleaned = pokedex.map(
			({ sprites, cries, game_indices, held_items, ...rest }) => rest
		);

		// copyPokedex.map((pokemon) => delete pokemon.sprites);
		// copyPokedex.map((pokemon) => delete pokemon.cries);
		// copyPokedex.map((pokemon) => delete pokemon.game_indices);
		// copyPokedex.map((pokemon) => delete pokemon.held_items);

		const data = JSON.stringify(copyPokedexCleaned, null, 2);
		const blob = new Blob([data], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "pokedex.txt";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const showPokedexPokemon = () => {
		console.log(pokedex);
		setShowingPokedex(true);
		setSelectedPokemon(null);
		setPokemons(pokedex);
		setNextURL(null);
	};

	const handleSearchByType = async (key) => {
		try {
			setSearchTerm("");
			setShowingPokedex(false);
			const { data } = await axios.get(
				`https://pokeapi.co/api/v2/type/${key.toLowerCase()}`
			);
			const pokemons = data.pokemon;
			const detailed = await Promise.all(
				pokemons.map(({ pokemon }) =>
					axios.get(pokemon.url).then((res) => res.data)
				)
			);
			setNextURL(null);
			setShowingPokedex(false);
			setSelectedPokemon(null);
			setPokemons(detailed);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSearchPoke = () => {
		const term = searchTerm.toLowerCase().trim();
		if (!term) return fetchPokes();

		const filtered = allPokes.filter((p) =>
			p.name.toLowerCase().includes(term)
		);

		if (filtered.length) {
			Promise.all(
				filtered.map((poke) => axios.get(poke.url).then((r) => r.data))
			)
				.then((detailed) => setPokemons(detailed))
				.catch(console.error);
		} else {
			setPokemons([]);
		}

		setSelectedPokemon(null);
		setShowingPokedex(false);
		setNextURL(null);
	};

	// const handleSearch = () => {
	// 	axios
	// 		.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
	// 		.then((response) => {
	// 			const result = response.data;
	// 			setPokemons([result]);
	// 			setSelectedPokemon(result);
	// 			setShowingPokedex(false);
	// 		})
	// 		.catch((err) => console.error(err));
	// };

	const fetchAllPokemons = () => {
		axios
			.get("https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0")
			.then(({ data }) => {
				setAllPokes(data.results);
			})
			.catch(console.error);
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
		fetchAllPokemons();
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
					handleSearch={handleSearchPoke}
					placeHolder={"Search Pokemon..."}
				/>
				<button
					onClick={handleGoBack}
					className="px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg shadow hover:bg-indigo-500 hover:text-white active:scale-95"
				>
					Go Back
				</button>
				{pokedex.length > 0 && (
					<button
						onClick={downloadPokedex}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 active:scale-95"
					>
						Download Team
					</button>
				)}
			</div>
			<div className="flex justify-center">
				<div className="m-5 grid lg:grid-cols-5 md:grid-cols-3 grid-rows-4 gap-2 w-1/2 grid-cols-2 ">
					{Object.entries(BUTTON_TYPES).map(([key, value]) => (
						<button
							key={key}
							style={{ backgroundColor: value, color: "white", margin: 4 }}
							className="border rounded "
							onClick={() => handleSearchByType(key)}
						>
							{key}
						</button>
					))}
				</div>
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
							<div className="flex justify-center">
								<p className=" m-2 p-2 border-indigo-600 rounded bg-indigo-500 text-white w-fit">
									No more Pokémon
								</p>
							</div>
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
