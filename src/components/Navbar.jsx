
import { NavLink, Link } from 'react-router-dom'

function Navbar({ favoritos = [], cantidadUsuarios = 0 }) {
  const enlaces = [
    { ruta: '/', texto: 'Inicio', exacto: true },
    { ruta: '/lista', texto: 'Pokédex' },
    {
      ruta: '/favoritos',
      texto: 'Favoritos',
      contador: favoritos.length,
    },
    {
      ruta: '/registro',
      texto: 'Registro',
      contador: cantidadUsuarios,
    },
  ]

  return (
    <header className="encabezado">
      <Link className="logo logo-boton" to="/" aria-label="Ir al inicio">
        <span className="pokeball" aria-hidden="true">◉</span>
        <span>POKÉDEX</span>
      </Link>

      <nav className="navegacion-principal" aria-label="Navegación principal">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.ruta}
            to={enlace.ruta}
            end={enlace.exacto}
            className={({ isActive }) =>
              `enlace-nav${isActive ? ' nav-activo' : ''}`
            }
          >
            <span>{enlace.texto}</span>

            {enlace.contador !== undefined && (
              <span className="contador-nav">{enlace.contador}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
