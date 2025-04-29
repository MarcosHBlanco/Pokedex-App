import React from "react";
import TypeBadge from "./TypeBadge";

export default function PokemonList({ pokemons, onPokemonSelect }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{pokemons.map((pokemon) => (
				<div
					key={pokemon.id}
					onClick={() => onPokemonSelect(pokemon)}
					className="bg-white rounded-xl shadow p-4 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
				>
					<h2 className="text-xl font-semibold mb-2 capitalize text-gray-900">
						{pokemon.name}
					</h2>
					<img
						src={pokemon.sprites.front_default}
						alt={pokemon.name}
						className="w-24 h-24 mx-auto mb-4"
					/>
					<div className="text-sm space-y-1 text-gray-700">
						<p>
							<strong>Type:</strong>{" "}
							{pokemon.types.map(({ slot, type }) => (
								<TypeBadge key={slot} typeName={type.name} />
							))}
						</p>

						<p>
							<strong>HP:</strong>{" "}
							{pokemon.stats.find((s) => s.stat.name === "hp").base_stat}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
