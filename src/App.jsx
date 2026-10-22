
import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

import RegistroUsuarios from './RegistroUsuarios'
import Navbar from './components/Navbar'
import PokemonCard from './components/PokemonCard'
import Pagination from './components/Pagination'
import PokemonDetails from './components/PokemonDetails'
import NotFound from './pages/NotFound'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'
const CLAVE_FAVORITOS = 'pokedex-favoritos'
const CLAVE_USUARIOS = 'pokedex-usuarios'

const tiposDisponibles = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

const nombresTipos = {
  all: 'Todos los tipos',
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

function leerLocal(clave, valorInicial) {
  try {
    const dato = localStorage.getItem(clave)
    return dato === null ? valorInicial : JSON.parse(dato)
  } catch {
    return valorInicial
  }
}

function obtenerCantidadUsuarios() {
  const usuarios = leerLocal(CLAVE_USUARIOS, [])
  return Array.isArray(usuarios) ? usuarios.length : 0
}

function PiePagina() {
  return (
    <footer className="pie">
      <p>Pokédex · Proyecto de Tecnologías Web</p>
      <p>
        Datos proporcionados por{' '}
        <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
          PokéAPI
        </a>
      </p>
    </footer>
  )
}

function Inicio() {
  return (
    <section className="presentacion">
      <div>
        <span className="etiqueta">ENCICLOPEDIA POKÉMON</span>
        <h1>Encuentra tu Pokémon favorito</h1>
        <p>
          Explora especies, busca por nombre o número y guarda
          tus Pokémon preferidos.
        </p>
        <Link className="boton-explorar" to="/lista">
          Explorar catálogo →
        </Link>
      </div>

      <div className="pokeball-grande" aria-hidden="true">
        <span>●</span>
      </div>
    </section>
  )
}

function Catalogo({ favoritos, alternarFavorito, modoFavoritos = false }) {
  const [indice, setIndice] = useState([])
  const [detalles, setDetalles] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('all')
  const [porPagina, setPorPagina] = useState(20)
  const [pagina, setPagina] = useState(1)
  const [cargandoIndice, setCargandoIndice] = useState(true)
  const [cargandoDetalles, setCargandoDetalles] = useState(false)
  const [error, setError] = useState('')
  const [tiposIds, setTiposIds] = useState(null)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarIndice() {
      try {
        setCargandoIndice(true)
        setError('')

        const respuesta = await fetch(
          `${API_URL}?limit=2000&offset=0`,
          { signal: controlador.signal }
        )

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el catálogo.')
        }

        const datos = await respuesta.json()

        const lista = datos.results.map((pokemon) => {
          const coincidencia = pokemon.url.match(/pokemon\/(\d+)\/?$/)

          return {
            id: coincidencia ? Number(coincidencia[1]) : 0,
            name: pokemon.name,
            url: pokemon.url,
          }
        }).filter((pokemon) => pokemon.id > 0)

        setIndice(lista)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar Pokémon.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoIndice(false)
        }
      }
    }

    cargarIndice()
    return () => controlador.abort()
  }, [])

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarTipo() {
      if (tipoSeleccionado === 'all') {
        setTiposIds(null)
        return
      }

      try {
        setTiposIds(new Set())

        const respuesta = await fetch(
          `https://pokeapi.co/api/v2/type/${tipoSeleccionado}`,
          { signal: controlador.signal }
        )

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el filtro.')
        }

        const datos = await respuesta.json()
        const ids = datos.pokemon.map((item) => {
          const coincidencia = item.pokemon.url.match(/pokemon\/(\d+)\/?$/)
          return coincidencia ? Number(coincidencia[1]) : 0
        }).filter(Boolean)

        setTiposIds(new Set(ids))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al filtrar por tipo.')
          setTiposIds(null)
        }
      }
    }

    cargarTipo()
    return () => controlador.abort()
  }, [tipoSeleccionado])

  const pokemonesFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase()

    return indice.filter((pokemon) => {
      const coincideNombre = pokemon.name.includes(consulta)

      const coincideNumero =
        consulta !== '' &&
        /^\d+$/.test(consulta) &&
        String(pokemon.id).includes(consulta)

      const coincideBusqueda =
        consulta === '' || coincideNombre || coincideNumero

      const coincideTipo =
        tipoSeleccionado === 'all' ||
        (tiposIds !== null && tiposIds.has(pokemon.id))

      const coincideFavorito =
        !modoFavoritos || favoritos.includes(pokemon.id)

      return coincideBusqueda && coincideTipo && coincideFavorito
    })
  }, [
    indice,
    busqueda,
    tipoSeleccionado,
    tiposIds,
    modoFavoritos,
    favoritos,
  ])

  const totalPaginas = Math.max(
    1,
    Math.ceil(pokemonesFiltrados.length / porPagina)
  )

  const pokemonPagina = useMemo(() => {
    const inicio = (pagina - 1) * porPagina
    return pokemonesFiltrados.slice(inicio, inicio + porPagina)
  }, [pokemonesFiltrados, pagina, porPagina])

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarDetallesPagina() {
      if (pokemonPagina.length === 0) {
        setDetalles([])
        setCargandoDetalles(false)
        return
      }

      try {
        setCargandoDetalles(true)

        const resultados = await Promise.all(
          pokemonPagina.map(async (pokemon) => {
            const respuesta = await fetch(pokemon.url, {
              signal: controlador.signal,
            })

            if (!respuesta.ok) {
              throw new Error(`Error cargando ${pokemon.name}.`)
            }

            return respuesta.json()
          })
        )

        setDetalles(resultados)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDetalles([])
          setError(err.message || 'No se pudieron cargar los detalles.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoDetalles(false)
        }
      }
    }

    cargarDetallesPagina()
    return () => controlador.abort()
  }, [pokemonPagina])

  useEffect(() => {
    setPagina(1)
  }, [busqueda, tipoSeleccionado, porPagina, modoFavoritos])

  function cambiarPagina(nuevaPagina) {
    setPagina(Math.min(Math.max(1, nuevaPagina), totalPaginas))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function limpiarFiltros() {
    setBusqueda('')
    setTipoSeleccionado('all')
  }

  const primero = pokemonesFiltrados.length
    ? (pagina - 1) * porPagina + 1
    : 0

  const ultimo = Math.min(
    pagina * porPagina,
    pokemonesFiltrados.length
  )

  return (
    <>
      {!modoFavoritos && <Inicio />}

      <section className="catalogo">
        <div className="catalogo-titulo">
          <div>
            <h2>
              {modoFavoritos ? 'Mis Pokémon favoritos' : 'Explorar Pokémon'}
            </h2>
            <p>Busca, filtra y recorre el catálogo por páginas.</p>
          </div>

          <span className="contador">
            {pokemonesFiltrados.length.toLocaleString()} resultados
          </span>
        </div>

        <div className="buscador">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Nombre o número, por ejemplo Pikachu o 25..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            aria-label="Buscar Pokémon por nombre o número"
          />
        </div>

        <div className="filtros">
          <label htmlFor="filtro-tipo">Tipo:</label>
          <select
            id="filtro-tipo"
            value={tipoSeleccionado}
            onChange={(evento) => setTipoSeleccionado(evento.target.value)}
          >
            {tiposDisponibles.map((tipo) => (
              <option key={tipo} value={tipo}>
                {nombresTipos[tipo]}
              </option>
            ))}
          </select>

          <label htmlFor="cantidad-pagina">Por página:</label>
          <select
            id="cantidad-pagina"
            value={porPagina}
            onChange={(evento) => setPorPagina(Number(evento.target.value))}
          >
            <option value={20}>20 Pokémon</option>
            <option value={40}>40 Pokémon</option>
            <option value={80}>80 Pokémon</option>
          </select>

          <Link
            className={`boton-vista ${!modoFavoritos ? 'vista-activa' : ''}`}
            to="/lista"
          >
            Todos
          </Link>

          <Link
            className={`boton-vista ${modoFavoritos ? 'vista-activa' : ''}`}
            to="/favoritos"
          >
            ♥ Favoritos ({favoritos.length})
          </Link>

          {(busqueda || tipoSeleccionado !== 'all') && (
            <button
              type="button"
              className="limpiar-filtros"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {cargandoIndice && (
          <p className="mensaje">Cargando el catálogo completo...</p>
        )}

        {error && (
          <div className="mensaje error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Volver a intentar
            </button>
          </div>
        )}

        {cargandoDetalles && (
          <p className="mensaje">Cargando Pokémon de esta página...</p>
        )}

        {!cargandoIndice &&
          !error &&
          !cargandoDetalles &&
          pokemonesFiltrados.length === 0 && (
            <div className="sin-resultados">
              <span>♡</span>
              <h3>
                {modoFavoritos
                  ? 'Todavía no hay favoritos con estos filtros'
                  : 'No encontramos Pokémon'}
              </h3>
              <p>Prueba con otro nombre, número o filtro.</p>
            </div>
          )}

        <div className="rejilla">
          {detalles.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              esFavorito={favoritos.includes(pokemon.id)}
              onAlternarFavorito={alternarFavorito}
            />
          ))}
        </div>

        {!cargandoIndice && !error && pokemonesFiltrados.length > 0 && (
          <>
            <div className="resumen-pagina">
              Mostrando {primero}–{ultimo} de{' '}
              {pokemonesFiltrados.length.toLocaleString()} Pokémon
            </div>

            <Pagination
              paginaActual={pagina}
              totalPaginas={totalPaginas}
              onCambiarPagina={cambiarPagina}
            />
          </>
        )}
      </section>
    </>
  )
}

function App() {
  const [favoritos, setFavoritos] = useState(() => {
    const datos = leerLocal(CLAVE_FAVORITOS, [])
    return Array.isArray(datos) ? datos : []
  })

  const [cantidadUsuarios, setCantidadUsuarios] = useState(
    obtenerCantidadUsuarios
  )

  const location = useLocation()

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos))
    } catch {
      console.warn('No fue posible guardar los favoritos.')
    }
  }, [favoritos])

  useEffect(() => {
    setCantidadUsuarios(obtenerCantidadUsuarios())
  }, [location.pathname])

  function alternarFavorito(id) {
    setFavoritos((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((favorito) => favorito !== id)
        : [...anteriores, id]
    )
  }

  return (
    <main className="app">
      <Navbar
        favoritos={favoritos}
        cantidadUsuarios={cantidadUsuarios}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Catalogo
              favoritos={favoritos}
              alternarFavorito={alternarFavorito}
            />
          }
        />

        <Route
          path="/lista"
          element={
            <Catalogo
              favoritos={favoritos}
              alternarFavorito={alternarFavorito}
            />
          }
        />

        <Route
          path="/favoritos"
          element={
            <Catalogo
              favoritos={favoritos}
              alternarFavorito={alternarFavorito}
              modoFavoritos
            />
          }
        />

        <Route
          path="/registro"
          element={
            <RegistroUsuarios
              onUsuariosChange={setCantidadUsuarios}
            />
          }
        />

        <Route
          path="/detalle/:id"
          element={
            <PokemonDetails
              favoritos={favoritos}
              onAlternarFavorito={alternarFavorito}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <PiePagina />
    </main>
  )
}

export default App
