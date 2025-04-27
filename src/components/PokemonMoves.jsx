import React from "react";

export default function PokemonMoves({ pokemonMoves }) {
	return (
		<div className="flex flex-wrap gap-3">
			{pokemonMoves.map((pokeMove, index) => (
				<div
					key={index}
					className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col space-y-1 text-blue-900 shadow-sm"
				>
					<h4 className="text-lg font-semibold capitalize">{pokeMove.name}</h4>
					<p className="text-sm">Power: {pokeMove.power ?? "N/A"}</p>
					<p className="text-sm">Accuracy: {pokeMove.accuracy ?? "N/A"}</p>
					<p className="text-sm">PP: {pokeMove.pp ?? "N/A"}</p>
				</div>
			))}
		</div>
	);
}
