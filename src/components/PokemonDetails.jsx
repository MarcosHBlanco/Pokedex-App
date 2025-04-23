import { useState, useEffect } from "react";
import PokemonMoves from "./PokemonMoves";
import axios from "axios";

export default function PokemonDetails({ pokemon, addToPokedex }) {
	const [allMoves, setAllMoves] = useState([]); // detailed data for every move
	const [selectedMoves, setSelected] = useState([]); // user‑picked subset

	// 1. fetch details for every move once pokemon arrives
	useEffect(() => {
		if (!pokemon?.moves) return;

		async function loadAllMoves() {
			try {
				const detailed = await Promise.all(
					pokemon.moves.map(async ({ move }) => {
						const { data } = await axios.get(move.url);
						return {
							name: move.name,
							power: data.power,
							accuracy: data.accuracy,
							pp: data.pp,
						};
					})
				);
				setAllMoves(detailed);
			} catch (err) {
				console.error("Couldn’t load move details", err);
			}
		}

		loadAllMoves();
	}, [pokemon.moves]);

	// 2. handler to pick a move into your selectedMoves
	const handlePick = (move) => {
		// no duplicates, max 4
		if (
			selectedMoves.length < 4 &&
			!selectedMoves.some((m) => m.name === move.name)
		) {
			setSelected((prev) => [...prev, move]);
		}
	};
	return (
		<div>
			<div
				key={pokemon.id}
				style={{
					border: "1px solid #ccc",
					margin: "10px",
					padding: "10px",
				}}
			>
				<h2>
					<strong>
						{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
					</strong>
				</h2>
				<div className="flex place-items-center">
					<div className="w-20 ">
						<img src={pokemon.sprites.front_default} alt={pokemon.name} />
					</div>
					<p>
						<strong>Height:</strong> {pokemon.height}
						{" | "}
					</p>
					<p>
						<strong>Weight:</strong> {pokemon.weight}
						{" | "}
					</p>
					<p>
						<strong>Type:</strong> {pokemon.types[0].type.name}
						{" | "}
					</p>
					<p>
						<strong>Hp:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "hp").base_stat}
						{" | "}
					</p>
					<p>
						<strong>Attack:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "attack").base_stat}
						{" | "}
					</p>
					<p>
						<strong>Defense:</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "defense").base_stat}
						{" | "}
					</p>
				</div>
				<section>
					<h3>Your selected moves:</h3>
					{selectedMoves.length === 0 ? (
						<p>No moves selected yet</p>
					) : (
						<PokemonMoves pokemonMoves={selectedMoves} />
					)}
				</section>
				<section>
					<h3>All Moves (click to pick):</h3>
					{allMoves.length === 0 ? (
						<p>Loading moves…</p>
					) : (
						<div className="flex flex-col">
							{allMoves.map((m, i) => (
								<button
									key={i}
									onClick={() => handlePick(m)}
									className="m-1 flex p-2 border-2 border-blue-400 rounded hover:bg-blue-400 hover:text-white hover:cursor-pointer"
								>
									<strong className="m-1">
										{m.name.charAt(0).toUpperCase() + m.name.slice(1)}
									</strong>
									<ul className="flex">
										<li className="m-1">Power: {m.power ?? "N/A"}</li>
										<li className="m-1">Accuracy: {m.accuracy ?? "N/A"}</li>
										<li className="m-1">PP: {m.pp ?? "N/A"}</li>
									</ul>
								</button>
							))}
						</div>
					)}
				</section>
				<button
					className="m-3 px-2 border-2 border-emerald-600 rounded text-2xl hover:bg-emerald-600 hover:text-white active:scale-90 transition"
					onClick={() => addToPokedex({ ...pokemon, moves: selectedMoves })}
				>
					Add to Pokedex
				</button>
			</div>
		</div>
	);
}
