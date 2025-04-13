import axios from "axios";
import { useEffect, useState } from "react";

export default function PokemonMoves({ pokemonMoves }) {
	const [detailedMoves, setDetailedMoves] = useState([]);

	useEffect(() => {
		const fetchMoveDetails = async () => {
			const moveWithDetails = await Promise.all(
				pokemonMoves.map(async (pokeMove) => {
					try {
						const response = await axios.get(pokeMove.move.url);
						const detailedData = response.data;
						return {
							...pokeMove,
							move: {
								...pokeMove.move,
								power: detailedData.power,
								accuracy: detailedData.accuracy,
								pp: detailedData.pp,
							},
						};
					} catch (error) {
						console.log(
							`Error fetching details for ${pokeMove.move.name}`,
							error
						);
						return {
							...pokeMove,
							move: {
								...pokeMove.move,
								power: "N/A",
								accuracy: "N/A",
								pp: "N/A",
							},
						};
					}
				})
			);
			setDetailedMoves(moveWithDetails);
		};
		fetchMoveDetails();
	}, [pokemonMoves]);

	return (
		<ul>
			{detailedMoves.map((pokeMove, index) => (
				<li
					key={index}
					className="m-1 border border-blue-400 bg-blue-300 rounded text-white w-30 flex justify-center"
				>
					{pokeMove.move.name} - Power: {pokeMove.move.power ?? "N/A"} -
					Accuracy: {pokeMove.move.power ?? "N/A"} - PP:{" "}
					{pokeMove.move.pp ?? "N/A"}
				</li>
			))}
		</ul>
	);
}
