export default function PokemonMoves({ pokemonMoves }) {
	return (
		<div>
			{pokemonMoves.map((pokeMove, index) => (
				<ul
					key={index}
					className="m-1 border border-blue-400 bg-blue-300 rounded text-white w-fit flex"
				>
					<li>{pokeMove.name}</li>
					<li>- Power: {pokeMove.power ?? "N/A"} </li>
					<li>- Accuracy: {pokeMove.accuracy ?? "N/A"} </li>
					<li>- PP: {pokeMove.pp ?? "N/A"} </li>
				</ul>
			))}
		</div>
	);
}
