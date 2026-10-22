
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

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

function PokemonDetails({ favoritos = [], onAlternarFavorito }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarPokemon() {
      setCargando(true)
      setError('')
      setPokemon(null)

      try {
        const respuesta = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`,
          { signal: controlador.signal }
        )

        if (!respuesta.ok) {
          throw new Error('No encontramos ese Pokémon.')
        }

        const datos = await respuesta.json()
        setPokemon(datos)
      } catch (errorPeticion) {
        if (errorPeticion.name !== 'AbortError') {
          setError(errorPeticion.message || 'No se pudo cargar el Pokémon.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarPokemon()

    return () => controlador.abort()
  }, [id])

  if (cargando) {
    return <p className="mensaje-carga">Cargando información del Pokémon...</p>
  }

  if (error || !pokemon) {
    return (
      <section className="mensaje-error">
        <h2>Pokémon no encontrado</h2>
        <p>{error || 'No hay información disponible.'}</p>
        <button
          type="button"
          className="boton-principal"
          onClick={() => navigate('/lista')}
        >
          Volver a la Pokédex
        </button>
      </section>
    )
  }

  const esFavorito = favoritos.some(
    (favorito) => Number(favorito.id) === pokemon.id
  )

  const imagen =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  const nombre =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

  return (
    <main className="detalle-pokemon">
      <button
        type="button"
        className="boton-secundario"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <section className="detalle-contenido">
        <div className="detalle-imagen">
          {imagen && <img src={imagen} alt={nombre} />}
          <p className="pokemon-numero">
            N.º {String(pokemon.id).padStart(3, '0')}
          </p>
        </div>

        <div className="detalle-informacion">
          <h1>{nombre}</h1>

          <div className="pokemon-tipos">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`tipo tipo-${type.name}`}
              >
                {nombresTipos[type.name] || type.name}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="boton-principal"
            onClick={() => onAlternarFavorito(pokemon.id)}
          >
            {esFavorito ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
          </button>

          <div className="detalle-datos">
            <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Experiencia base:</strong> {pokemon.base_experience ?? 'No disponible'}</p>
            <p>
              <strong>Habilidades:</strong>{' '}
              {pokemon.abilities
                .map(({ ability }) => ability.name)
                .join(', ')}
            </p>
          </div>

          <h2>Estadísticas</h2>

          <div className="detalle-estadisticas">
            {pokemon.stats.map(({ stat, base_stat }) => (
              <div className="estadistica" key={stat.name}>
                <span>{stat.name.replace('-', ' ')}</span>
                <div className="barra-estadistica">
                  <div
                    className="barra-estadistica-valor"
                    style={{
                      width: `${Math.min(base_stat, 150) / 150 * 100}%`,
                    }}
                  />
                </div>
                <strong>{base_stat}</strong>
              </div>
            ))}
          </div>

          <Link to="/lista" className="enlace-volver-lista">
            Ver todos los Pokémon
          </Link>
        </div>
      </section>
    </main>
  )
}

export default PokemonDetails
