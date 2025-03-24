export default function PokemonList({ pokemons, addToPokedex }) {
	return (
		<div>
			{pokemons.map((pokemon) => (
				<div
					key={pokemon.id}
					style={{
						border: "1px solid #ccc",
						margin: "10px",
						padding: "10px",
					}}
				>
					<h2>
						{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
					</h2>
					<img src={pokemon.sprites.front_default} alt={pokemon.name} />
					<p>
						<strong>Height:</strong> {pokemon.height}
					</p>
					<p>
						<strong>Weight:</strong> {pokemon.weight}
					</p>
					<p>
						<strong>Hp</strong>{" "}
						{pokemon.stats.find((s) => s.stat.name === "hp").base_stat}
					</p>
					<p>
						<strong>Moves:</strong>{" "}
						{pokemon.moves
							.slice(0, 15)
							.map((move) => move.move.name)
							.join(", ")}
					</p>
					<button onClick={() => addToPokedex(pokemon)}>Add to Pokedex</button>
				</div>
			))}
		</div>
	);
}
