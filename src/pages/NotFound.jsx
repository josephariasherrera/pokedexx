
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="pagina-no-encontrada">
      <div className="error-404">404</div>

      <h1>¡Ups! Pokémon no encontrado</h1>

      <p>
        Parece que esta ruta no existe. Regresa a la Pokédex
        para seguir explorando.
      </p>

      <Link to="/" className="boton-principal">
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFound
