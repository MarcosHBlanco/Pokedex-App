export default function PokemonList({ pokemons, onPokemonSelect }) {
	return (
		<div>
			{pokemons.map((pokemon) => (
				<div
					key={pokemon.id}
					style={{
						border: "1px solid #ccc",
						margin: "6px",
						padding: "6px",
					}}
					className="hover:cursor-pointer"
					onClick={() => onPokemonSelect(pokemon)}
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
					</div>
				</div>
			))}
		</div>
	);
}
