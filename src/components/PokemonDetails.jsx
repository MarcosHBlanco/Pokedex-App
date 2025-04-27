import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonMoves from "./PokemonMoves";

export default function PokemonDetails({ pokemon, addToPokedex }) {
	const [allMoves, setAllMoves] = useState([]);
	const [selectedMoves, setSelectedMoves] = useState([]);

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
				}))
			)
			.then(setAllMoves)
			.catch(console.error);
	}, [pokemon]);

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
				<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
					<p>
						<strong>Height:</strong> {pokemon.height}
					</p>
					<p>
						<strong>Weight:</strong> {pokemon.weight}
					</p>
					<p>
						<strong>Type:</strong> {pokemon.types[0].type.name}
					</p>
					<p>
						<strong>Attack:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "attack").base_stat}
					</p>
					<p>
						<strong>Defense:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "defense").base_stat}
					</p>
				</div>
			</div>

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

			<section className="mt-6">
				<h3 className="text-xl font-semibold mb-2 text-gray-800">All Moves</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
					{allMoves.map((m, i) => (
						<button
							key={i}
							onClick={() => handlePick(m)}
							className="bg-gray-100 rounded-lg p-2 text-xs hover:bg-gray-200 transition"
						>
							<p className="font-medium capitalize text-gray-900">{m.name}</p>
							<p className="text-gray-700">Power: {m.power ?? "—"}</p>
							<p className="text-gray-700">Acc: {m.accuracy ?? "—"}</p>
							<p className="text-gray-700">PP: {m.pp ?? "—"}</p>
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
