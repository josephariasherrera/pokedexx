
import { useEffect, useState } from 'react'
import './RegistroUsuarios.css'

const CLAVE_USUARIOS = 'pokedex-usuarios'

function cargarUsuarios() {
  try {
    const datos = localStorage.getItem(CLAVE_USUARIOS)
    const usuarios = datos ? JSON.parse(datos) : []
    return Array.isArray(usuarios) ? usuarios : []
  } catch {
    return []
  }
}

function RegistroUsuarios({ onUsuariosChange }) {
  const [usuarios, setUsuarios] = useState(cargarUsuarios)
  const [identificacion, setIdentificacion] = useState('')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('exito')
  const [errores, setErrores] = useState({})

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
      onUsuariosChange?.(usuarios.length)
    } catch {
      setMensaje('No fue posible guardar los usuarios en el navegador.')
      setTipoMensaje('error')
    }
  }, [usuarios, onUsuariosChange])

  function mostrarMensaje(texto, tipo = 'exito') {
    setMensaje(texto)
    setTipoMensaje(tipo)
  }

  function limpiarFormulario() {
    setIdentificacion('')
    setNombre('')
    setCorreo('')
    setEditandoId(null)
    setErrores({})
  }

  function validarFormulario() {
    const nuevosErrores = {}
    const idLimpio = identificacion.trim()
    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim()

    if (!idLimpio) {
      nuevosErrores.identificacion = 'La identificación es obligatoria.'
    } else if (!/^[a-zA-Z0-9-]{4,20}$/.test(idLimpio)) {
      nuevosErrores.identificacion =
        'Usa entre 4 y 20 letras, números o guiones.'
    } else if (
      usuarios.some(
        (usuario) =>
          usuario.identificacion.toLowerCase() === idLimpio.toLowerCase() &&
          usuario.id !== editandoId
      )
    ) {
      nuevosErrores.identificacion =
        'Ya existe un usuario con esta identificación.'
    }

    if (!nombreLimpio) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
    } else if (nombreLimpio.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.'
    }

    if (!correoLimpio) {
      nuevosErrores.correo = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      nuevosErrores.correo = 'Escribe un correo electrónico válido.'
    } else if (
      usuarios.some(
        (usuario) =>
          usuario.correo.toLowerCase() === correoLimpio.toLowerCase() &&
          usuario.id !== editandoId
      )
    ) {
      nuevosErrores.correo = 'Este correo ya está registrado.'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function guardarUsuario(evento) {
    evento.preventDefault()
    setMensaje('')

    if (!validarFormulario()) return

    const usuario = {
      id: editandoId ?? `${Date.now()}-${Math.random()}`,
      identificacion: identificacion.trim(),
      nombre: nombre.trim(),
      correo: correo.trim()
    }

    if (editandoId !== null) {
      setUsuarios((anteriores) =>
        anteriores.map((item) => item.id === editandoId ? usuario : item)
      )
      mostrarMensaje('Los datos del usuario se actualizaron correctamente.')
    } else {
      setUsuarios((anteriores) => [...anteriores, usuario])
      mostrarMensaje('Usuario registrado correctamente.')
    }

    limpiarFormulario()
  }

  function editarUsuario(usuario) {
    setIdentificacion(usuario.identificacion)
    setNombre(usuario.nombre)
    setCorreo(usuario.correo)
    setEditandoId(usuario.id)
    setErrores({})
    setMensaje('Estás editando los datos de este usuario.')
    setTipoMensaje('informacion')

    document.getElementById('formulario-usuarios')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  function eliminarUsuario(usuario) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`
    )

    if (!confirmar) return

    setUsuarios((anteriores) =>
      anteriores.filter((item) => item.id !== usuario.id)
    )

    if (editandoId === usuario.id) limpiarFormulario()

    mostrarMensaje('El usuario se eliminó correctamente.')
  }

  return (
    <section className="registro-usuarios">
      <div className="registro-encabezado">
        <span className="registro-etiqueta">GESTIÓN DE CUENTAS</span>
        <h2>Registro de usuarios</h2>
        <p>
          Registra y administra los usuarios de la Pokédex.
          Los datos se guardan en este navegador.
        </p>
      </div>

      <div className="registro-resumen">
        <div className="resumen-icono">♙</div>
        <div>
          <strong>{usuarios.length}</strong>
          <span>
            {usuarios.length === 1 ? 'Usuario registrado' : 'Usuarios registrados'}
          </span>
        </div>
      </div>

      {mensaje && (
        <div
          className={`registro-mensaje mensaje-${tipoMensaje}`}
          role="status"
        >
          <span>{mensaje}</span>
          <button
            type="button"
            onClick={() => setMensaje('')}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <form
        id="formulario-usuarios"
        className="formulario-usuarios"
        onSubmit={guardarUsuario}
        noValidate
      >
        <h3>{editandoId !== null ? 'Editar usuario' : 'Registrar usuario'}</h3>

        <div className="campo-usuario">
          <label htmlFor="identificacion">Identificación</label>
          <input
            id="identificacion"
            name="identificacion"
            value={identificacion}
            onChange={(evento) => setIdentificacion(evento.target.value)}
            placeholder="Ej. CC123456"
            autoComplete="off"
            aria-invalid={Boolean(errores.identificacion)}
            aria-describedby={errores.identificacion ? 'error-identificacion' : undefined}
          />
          {errores.identificacion && (
            <span id="error-identificacion" className="error-campo">
              {errores.identificacion}
            </span>
          )}
        </div>

        <div className="campo-usuario">
          <label htmlFor="nombre-usuario">Nombre completo</label>
          <input
            id="nombre-usuario"
            name="nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Escribe el nombre completo"
            autoComplete="name"
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? 'error-nombre' : undefined}
          />
          {errores.nombre && (
            <span id="error-nombre" className="error-campo">
              {errores.nombre}
            </span>
          )}
        </div>

        <div className="campo-usuario">
          <label htmlFor="correo-usuario">Correo electrónico</label>
          <input
            id="correo-usuario"
            name="correo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="nombre@correo.com"
            autoComplete="email"
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? 'error-correo' : undefined}
          />
          {errores.correo && (
            <span id="error-correo" className="error-campo">
              {errores.correo}
            </span>
          )}
        </div>

        <div className="acciones-formulario">
          <button className="boton-guardar-usuario" type="submit">
            {editandoId !== null ? 'Guardar cambios' : 'Registrar usuario'}
          </button>

          {editandoId !== null && (
            <button
              className="boton-cancelar-usuario"
              type="button"
              onClick={() => {
                limpiarFormulario()
                mostrarMensaje('Edición cancelada.', 'informacion')
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="tabla-usuarios">
        <div className="tabla-usuarios-encabezado">
          <h3>Usuarios registrados</h3>
          <span>{usuarios.length} en total</span>
        </div>

        {usuarios.length === 0 ? (
          <div className="usuarios-vacios">
            <span>♙</span>
            <h4>Aún no hay usuarios</h4>
            <p>Completa el formulario para registrar el primero.</p>
          </div>
        ) : (
          <div className="tabla-desplazable">
            <table>
              <thead>
                <tr>
                  <th>Identificación</th>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td data-label="Identificación">{usuario.identificacion}</td>
                    <td data-label="Nombre">{usuario.nombre}</td>
                    <td data-label="Correo">{usuario.correo}</td>
                    <td data-label="Acciones">
                      <div className="acciones-tabla">
                        <button
                          type="button"
                          className="boton-editar-usuario"
                          onClick={() => editarUsuario(usuario)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="boton-eliminar-usuario"
                          onClick={() => eliminarUsuario(usuario)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default RegistroUsuarios
