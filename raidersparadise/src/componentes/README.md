# Componentes — Catálogo de Accesorios de Lujo para Motos

4 componentes React (JSX) + Tailwind CSS, con estado local y datos mock.
No requieren backend: todo funciona en memoria (al recargar la página se
reinicia el estado).

## Archivos

| Archivo                        | Historia de usuario          |
|---------------------------------|-------------------------------|
| `mockData.js`                   | Datos compartidos (no es un componente, es la base de datos simulada) |
| `HU05_RegistrarProducto.jsx`    | HU 05 — Registrar producto    |
| `HU06_ActualizarProducto.jsx`   | HU 06 — Actualizar producto   |
| `HU07_ConsultarCatalogo.jsx`    | HU 07 — Consultar catálogo    |
| `HU08_ActualizarInventario.jsx` | HU 08 — Actualizar inventario |

## Identidad visual

Pensado como un "taller premium": fondo casi negro, acento dorado/latón
(`#C9A24B`), tipografía `Oswald` (títulos), `Inter` (texto) y
`JetBrains Mono` (SKU, precios, stock — como un velocímetro digital).
Cada producto se identifica con un SKU tipo "código de chasis".

## Requisitos

1. **Tailwind CSS** configurado en el proyecto (`npx tailwindcss init` o
   ya incluido si usas Vite/Next/CRA con Tailwind).
2. **Tipografías** (opcional pero recomendado para ver el diseño completo).
   Agrega esto en tu `index.html` o en tu CSS global:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Si no agregas las fuentes, los componentes funcionan igual — el navegador
usará una fuente de respaldo (`sans-serif` / `monospace`).

## Cómo usarlos

Todos los componentes tienen valores por defecto, así que puedes usarlos
sin pasarles nada:

```jsx
import HU05_RegistrarProducto from "./HU05_RegistrarProducto";
import HU06_ActualizarProducto from "./HU06_ActualizarProducto";
import HU07_ConsultarCatalogo from "./HU07_ConsultarCatalogo";
import HU08_ActualizarInventario from "./HU08_ActualizarInventario";

function App() {
  return <HU07_ConsultarCatalogo />;
}
```

### Conectar con callbacks (para cuando tengas backend)

```jsx
<HU05_RegistrarProducto
  onRegistrar={(producto) => {
    // producto = { id, sku, nombre, categoria, marca, precio, stock, stockMinimo, descripcion, imagen, activo }
    console.log("Nuevo producto:", producto);
    // Aquí harías tu fetch/POST a la API
  }}
/>

<HU06_ActualizarProducto
  productos={misProductos}
  onActualizar={(productoEditado) => {
    console.log("Producto editado:", productoEditado);
    // Aquí harías tu fetch/PUT a la API
  }}
/>

<HU07_ConsultarCatalogo productos={misProductos} />

<HU08_ActualizarInventario
  productosIniciales={misProductos}
  onActualizarInventario={(productoActualizado, movimiento) => {
    console.log(productoActualizado, movimiento);
    // Aquí harías tu fetch/PATCH a la API
  }}
/>
```

## Notas de cada componente

- **HU05 — Registrar producto**: genera un SKU automático al elegir
  categoría + marca, valida campos obligatorios y muestra confirmación
  con el SKU asignado.
- **HU06 — Actualizar producto**: lista lateral de productos existentes;
  el SKU se muestra fijo (no editable). El stock se puede ver pero el
  componente sugiere usar HU08 para movimientos de inventario.
- **HU07 — Consultar catálogo**: cuadrícula tipo "sala de exhibición"
  con búsqueda, filtros por categoría/marca, orden por precio/stock, y
  modal de detalle. Marca visualmente "Agotado" / "Stock bajo" / "Disponible".
- **HU08 — Actualizar inventario**: registra movimientos de entrada/salida
  con motivo, valida que no se pueda sacar más stock del disponible, y
  lleva un historial de movimientos de la sesión. Alerta cuando una pieza
  llega al mínimo o se agota.
