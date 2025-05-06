import React from "react";
import TypeBadge from "./TypeBadge";
import moveStatusImg from "../assets/move-status.png";
import movePhysicalImg from "../assets/move-physical.png";
import moveSpecialImg from "../assets/move-special.png";

export default function PokemonMoves({ pokemonMoves }) {
	return (
		<div className="flex flex-wrap gap-3">
			{pokemonMoves.map((pokeMove, index) => (
				<div
					key={index}
					className="bg-purple-50 hover:bg-purple-200 border border-purple-400 rounded-lg p-4 flex flex-col space-y-1 text-gray-700 shadow-sm"
				>
					<h4 className="text-lg font-semibold capitalize">{pokeMove.name}</h4>
					<p className="text-sm">Power: {pokeMove.power ?? "N/A"}</p>
					<p className="text-sm">Accuracy: {pokeMove.accuracy ?? "N/A"}</p>
					<p className="text-sm">PP: {pokeMove.pp ?? "N/A"}</p>
					<p className="text-gray-700">
						Attack Type:{" "}
						{pokeMove.type.name ? (
							<TypeBadge typeName={pokeMove.type.name} />
						) : (
							"—"
						)}
					</p>
					<p className="text-gray-700 flex justify-center">
						Damage Type:{" "}
						{pokeMove.damage_class.name === "status" ? (
							<img className="w-6 mx-2" src={moveStatusImg} />
						) : pokeMove.damage_class.name === "physical" ? (
							<img className="w-6 mx-2" src={movePhysicalImg} />
						) : pokeMove.damage_class.name === "special" ? (
							<img className="w-6 mx-2" src={moveSpecialImg} />
						) : (
							""
						)}
					</p>
				</div>
			))}
		</div>
	);
}
