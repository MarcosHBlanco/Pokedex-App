import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonMoves from "./PokemonMoves";
import TypeBadge from "./TypeBadge";
import SearchBar from "./SearchBar";
import moveStatusImg from "../assets/move-status.png";
import movePhysicalImg from "../assets/move-physical.png";
import moveSpecialImg from "../assets/move-special.png";

export default function PokemonDetails({ pokemon, addToPokedex }) {
	const [allMoves, setAllMoves] = useState([]);
	const [selectedMoves, setSelectedMoves] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [displayedMoves, setDisplayedMoves] = useState([]);
	const [abilities, setAllAbilities] = useState([]);

	useEffect(() => {
		if (!pokemon?.abilities) return;
		const fetchAbilityEffects = async () => {
			try {
				const responses = await Promise.all(
					pokemon.abilities.map((a) => axios.get(a.ability.url))
				);

				const abilitiesWithEffects = responses.map((res) => {
					const englishEntry = res.data.effect_entries.find(
						(entry) => entry.language.name === "en"
					);
					return {
						name: res.data.name,
						effect: englishEntry?.effect ?? "No effect found",
						shortEffect: englishEntry?.short_effect,
					};
				});

				setAllAbilities(abilitiesWithEffects);
			} catch (err) {
				console.error(err);
			}
		};

		fetchAbilityEffects();
	}, [pokemon]);

	useEffect(() => {
		if (!pokemon?.moves) return;
		axios
			.all(pokemon.moves.map((m) => axios.get(m.move.url)))
			.then((responses) =>
				responses.map((r) => ({
					name: r.data.name,
					power: r.data.power,
					accuracy: r.data.accuracy,
					pp: r.data.pp,
					type: r.data.type,
					damage_class: r.data.damage_class,
				}))
			)
			.then(setAllMoves)
			.catch(console.error);
	}, [pokemon]);

	useEffect(() => {
		const term = searchTerm.toLowerCase().trim();
		setDisplayedMoves(
			allMoves.filter((m) => m.name.toLowerCase().includes(term))
		);
	}, [allMoves, searchTerm]);

	const handleMoveSearch = () => {};

	const handlePick = (move) => {
		if (
			selectedMoves.length < 4 &&
			!selectedMoves.some((m) => m.name === move.name)
		) {
			setSelectedMoves((prev) => [...prev, move]);
		}
	};

	return (
		<div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-6 text-gray-900">
			<div className="flex flex-col items-center">
				<img
					src={pokemon.sprites.front_default}
					alt={pokemon.name}
					className="w-32 h-32 mb-4"
				/>
				<h2 className="text-3xl font-bold mb-2 capitalize">{pokemon.name}</h2>
				<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 items-center">
					<p>
						<strong>Height:</strong> {(pokemon.height / 10).toFixed(1)}
						{"m"}
					</p>
					<p>
						<strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)}
						{"kg"}
					</p>
					<p>
						<strong>Type:</strong>{" "}
						{pokemon.types.map(({ slot, type }) => (
							<TypeBadge key={slot} typeName={type.name} />
						))}
					</p>
					<p>
						<strong>Attack:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "attack").base_stat}
					</p>
					<p>
						<strong>Defense:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "defense").base_stat}
					</p>
					<p>
						<strong>Speed:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "speed").base_stat}
					</p>
					<p>
						<strong>Sp. Attack:</strong>{" "}
						{
							pokemon.stats.find((s) => s.stat.name === "special-attack")
								.base_stat
						}
					</p>
					<p>
						<strong>Sp. Defense:</strong>{" "}
						{
							pokemon.stats.find((s) => s.stat.name === "special-defense")
								.base_stat
						}
					</p>
				</div>
			</div>
			<section className="mt-6">
				<h3 className="text-xl font-semibold mb-2 text-gray-800">Abilities</h3>
				{abilities.map((ability, index) => (
					<p key={index} className="m-2">
						<span className="font-bold">{ability.name}</span> : {ability.effect}
					</p>
				))}
			</section>

			<section className="mt-6">
				<h3 className="text-xl font-semibold mb-2 text-gray-800">
					Selected Moves
				</h3>
				{selectedMoves.length === 0 ? (
					<p className="text-gray-600">No moves selected</p>
				) : (
					<PokemonMoves pokemonMoves={selectedMoves} />
				)}
			</section>

			<section className="mt-5">
				<SearchBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					handleSearch={handleMoveSearch}
					placeHolder={"Search Moves..."}
				/>
			</section>
			<section className="mt-6">
				<h3 className="text-xl font-semibold mb-2 text-gray-800">All Moves</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
					{displayedMoves.map((m, i) => (
						<button
							key={i}
							onClick={() => handlePick(m)}
							className="bg-gray-100 rounded-lg p-2 text-xs hover:bg-gray-200 transition"
						>
							<p className=" font-bold capitalize text-gray-900">{m.name}</p>
							<p className="text-gray-700">Power: {m.power ?? "—"}</p>
							<p className="text-gray-700">Acc: {m.accuracy ?? "—"}</p>
							<p className="text-gray-700">PP: {m.pp ?? "—"}</p>
							<p className="text-gray-700">
								Attack Type:{" "}
								{m.type.name ? <TypeBadge typeName={m.type.name} /> : "—"}
							</p>
							<p className="text-gray-700 flex justify-center">
								Damage Type:{" "}
								{m.damage_class.name === "status" ? (
									<img className="w-6 mx-2" src={moveStatusImg} />
								) : m.damage_class.name === "physical" ? (
									<img className="w-6 mx-2" src={movePhysicalImg} />
								) : m.damage_class.name === "special" ? (
									<img className="w-6 mx-2" src={moveSpecialImg} />
								) : (
									""
								)}
							</p>
						</button>
					))}
				</div>
			</section>

			<button
				onClick={() => addToPokedex({ ...pokemon, moves: selectedMoves })}
				className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 active:scale-95"
			>
				Add to Pokedex
			</button>
		</div>
	);
}
