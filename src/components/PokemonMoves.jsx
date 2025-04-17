export default function PokemonMoves({ pokemonMoves }) {
	return (
		<ul>
			{pokemonMoves.map((pokeMove, index) => (
				<li
					key={index}
					className="m-1 border border-blue-400 bg-blue-300 rounded text-white w-30 flex justify-center"
				>
					{pokeMove.name} - Power: {pokeMove.power ?? "N/A"} - Accuracy:{" "}
					{pokeMove.power ?? "N/A"} - PP: {pokeMove.pp ?? "N/A"}
				</li>
			))}
		</ul>
	);
}
