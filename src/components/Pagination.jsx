
function Pagination({ paginaActual, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null

  const anterior = () => {
    if (paginaActual > 1) {
      onCambiarPagina(paginaActual - 1)
    }
  }

  const siguiente = () => {
    if (paginaActual < totalPaginas) {
      onCambiarPagina(paginaActual + 1)
    }
  }

  return (
    <nav className="paginacion" aria-label="Paginación de Pokémon">
      <button
        type="button"
        className="boton-secundario"
        onClick={anterior}
        disabled={paginaActual === 1}
      >
        ← Anterior
      </button>

      <span className="paginacion-info">
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        type="button"
        className="boton-secundario"
        onClick={siguiente}
        disabled={paginaActual === totalPaginas}
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default Pagination
