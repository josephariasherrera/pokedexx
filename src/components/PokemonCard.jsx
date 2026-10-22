
import { Link } from 'react-router-dom'

const nombresTipos = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

function PokemonCard({ pokemon, esFavorito, onAlternarFavorito }) {
  if (!pokemon) return null

  const numero = String(pokemon.id).padStart(3, '0')
  const imagen =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  return (
    <article className="pokemon-card">
      <button
        type="button"
        className={`boton-favorito ${esFavorito ? 'es-favorito' : ''}`}
        onClick={() => onAlternarFavorito(pokemon.id)}
        aria-label={
          esFavorito
            ? `Quitar a ${pokemon.name} de favoritos`
            : `Agregar a ${pokemon.name} a favoritos`
        }
        title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {esFavorito ? '★' : '☆'}
      </button>

      <Link
        to={`/detalle/${pokemon.id}`}
        className="pokemon-card-enlace"
        aria-label={`Ver detalles de ${pokemon.name}`}
      >
        <span className="pokemon-numero">N.º {numero}</span>

        {imagen ? (
          <img
            className="pokemon-imagen"
            src={imagen}
            alt={pokemon.name}
            loading="lazy"
          />
        ) : (
          <div className="pokemon-imagen-placeholder">Sin imagen</div>
        )}

        <h3 className="pokemon-nombre">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>

        <div className="pokemon-tipos">
          {(pokemon.types || []).map(({ type }) => (
            <span
              key={type.name}
              className={`tipo tipo-${type.name}`}
            >
              {nombresTipos[type.name] || type.name}
            </span>
          ))}
        </div>
      </Link>
    </article>
  )
}

export default PokemonCard
