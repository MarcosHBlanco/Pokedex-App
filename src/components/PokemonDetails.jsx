import { useState } from "react";
import PokemonMoves from "./PokemonMoves";

export default function PokemonDetails({ pokemon, addToPokedex }) {
	const [pokeMoves, setPokeMoves] = useState([]);

	const handleMoves = (move) => {
		if (pokeMoves.length <= 3) {
			setPokeMoves((prevPokeMoves) => [...prevPokeMoves, move]);
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
				<p>
					<strong>Moves:</strong>{" "}
					{pokemon.moves.slice(0, 15).map((move, index) => (
						<button
							key={index}
							onClick={() => handleMoves(move)}
							className="border-2 border-blue-400 rounded m-1 p-1 hover:bg-blue-400 hover:text-white active:scale-90 transition"
						>
							{move.move.name}
						</button>
					))}
				</p>
				{pokeMoves && <PokemonMoves pokemonMoves={pokeMoves}></PokemonMoves>}

				<button
					className="m-3 px-2 border-2 border-emerald-600 rounded text-2xl hover:bg-emerald-600 hover:text-white active:scale-90 transition"
					onClick={() => addToPokedex(pokemon)}
				>
					Add to Pokedex
				</button>
			</div>
		</div>
	);
}
