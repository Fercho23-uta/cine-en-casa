# Plan B — Cine en casa

Una página de ejemplo en React que recomienda películas según el ánimo, la compañía y el tiempo disponible. Los títulos son una lista de muestra y no indican disponibilidad en plataformas.

## Abrir en Visual Studio Code

1. Descomprime `cine-en-casa.zip`.
2. En VS Code, usa **Archivo > Abrir carpeta...** y selecciona la carpeta `cine-en-casa`.
3. Abre **Terminal > Nueva terminal** y ejecuta:

   ```bash
   npm install
   npm run dev
   ```

4. Visita la dirección local que indique la terminal, normalmente `http://localhost:5173`.

## Hooks de React que practica

- `useState` guarda los filtros, la búsqueda, la lista de favoritos, la vista seleccionada y la película de detalle.
- `useEffect` guarda favoritos en `localStorage` y registra/retira el evento de teclado del detalle.
- `useMemo` filtra la lista según las opciones elegidas.
