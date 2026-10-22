# Pokédex — Proyecto React

## Descripción

Esta aplicación web permite consultar información de Pokémon mediante la API pública PokéAPI. Cuenta con un catálogo interactivo, búsqueda, filtros por tipo, paginación, detalles individuales y gestión de favoritos. También incluye un módulo de registro de usuarios.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- HTML y CSS
- PokéAPI
- LocalStorage para conservar favoritos y registros en el navegador

## Funcionalidades

### 1. Inicio y navegación
- Página de inicio con acceso al catálogo.
- Navegación entre las secciones principales.
- Contadores de favoritos y usuarios registrados.

### 2. Catálogo de Pokémon
- Consulta de datos desde PokéAPI.
- Búsqueda por nombre o número.
- Filtro por tipo de Pokémon.
- Selección de 20, 40 u 80 resultados por página.
- Paginación para recorrer los resultados.

### 3. Detalles de cada Pokémon
- Imagen oficial.
- Número identificador.
- Tipos.
- Altura y peso.
- Experiencia base.
- Habilidades y estadísticas de combate.

### 4. Favoritos
- Agregar y quitar Pokémon de favoritos.
- Consultar una lista independiente de favoritos.
- Persistencia de los favoritos mediante LocalStorage.

### 5. Registro de usuarios
- Registro de usuarios con identificación, nombre y correo electrónico.
- Validación de campos.
- Prevención de identificaciones y correos duplicados.
- Edición y eliminación de registros.
- Almacenamiento local de los registros.

### 6. Manejo de rutas
- Rutas independientes para inicio, catálogo, favoritos, registro y detalles.
- Página de error 404 para rutas inexistentes.

## Instalación y ejecución

Requisitos previos: Node.js y npm.

1. Clonar el repositorio o descargar el proyecto.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección local que muestra Vite, normalmente `http://localhost:5173/`.

## Compilación para producción

Para generar la versión de producción:

```bash
npm run build
```

Para comprobar localmente la compilación:

```bash
npm run preview
```

## API utilizada

PokéAPI: https://pokeapi.co/

La aplicación consulta los datos de Pokémon mediante solicitudes HTTP a esta API pública.

## Persistencia de datos

Los favoritos y los registros de usuarios se guardan en LocalStorage del navegador. Por lo tanto, los datos son locales al navegador y no se sincronizan con una base de datos externa.

## Autor

Nombre del estudiante: [joseph daniel arias herrera]

Asignatura: [Tecnologias web]

Docente: [PATINO SAUCEDO JANNS ALVARO]
