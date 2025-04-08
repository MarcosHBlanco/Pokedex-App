export default function PokemonMoves({ pokemonMoves }) {
	return (
		<ul>
			{pokemonMoves.map((pokeMove, index) => (
				<li key={index}>{pokeMove.move.name}</li>
			))}
		</ul>
	);
}
