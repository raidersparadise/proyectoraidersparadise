import React, { useMemo, useState } from "react";
import { CATEGORIAS, MARCAS, PRODUCTOS_INICIALES, formatoMoneda } from "./mockData";

/**
 * HU 07 — Consultar catálogo
 * Vista de catálogo tipo "sala de exhibición": cuadrícula de fichas con
 * filtro por categoría/marca, búsqueda por nombre o SKU, y orden por
 * precio o disponibilidad. Indica visualmente cuando una pieza está
 * agotada o por debajo del mínimo.
 *
 * Props:
 * - productos: arreglo de productos (por defecto usa PRODUCTOS_INICIALES).
 */
export default function HU07_ConsultarCatalogo({ productos = PRODUCTOS_INICIALES }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [marca, setMarca] = useState("Todas");
  const [orden, setOrden] = useState("relevancia");
  const [seleccionado, setSeleccionado] = useState(null);

  const resultados = useMemo(() => {
    let lista = productos.filter((p) => {
      const texto = busqueda.trim().toLowerCase();
      const coincideTexto =
        !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        p.sku.toLowerCase().includes(texto);
      const coincideCategoria = categoria === "Todas" || p.categoria === categoria;
      const coincideMarca = marca === "Todas" || p.marca === marca;
      return coincideTexto && coincideCategoria && coincideMarca;
    });

    if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (orden === "stock-desc") lista = [...lista].sort((a, b) => b.stock - a.stock);

    return lista;
  }, [productos, busqueda, categoria, marca, orden]);

  const estadoStock = (p) => {
    if (p.stock === 0) return { texto: "Agotado", color: "text-[#B5482A]", borde: "border-[#B5482A]/40" };
    if (p.stock <= p.stockMinimo)
      return { texto: "Stock bajo", color: "text-[#C9A24B]", borde: "border-[#C9A24B]/40" };
    return { texto: "Disponible", color: "text-[#7A9B76]", borde: "border-[#7A9B76]/40" };
  };

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#C9A24B] uppercase font-medium">
              Sala de exhibición
            </p>
            <h1
              className="text-3xl uppercase tracking-wide mt-1"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Catálogo de accesorios
            </h1>
          </div>
          <p className="text-sm text-[#8A877E]">
            {resultados.length} {resultados.length === 1 ? "pieza" : "piezas"} encontradas
          </p>
        </div>

        {/* Filtros */}
        <div className="border border-[#2A2A2D] p-5 mb-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="bg-[#161618] border border-[#2A2A2D] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-[#161618] border border-[#2A2A2D] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
          >
            <option value="Todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="bg-[#161618] border border-[#2A2A2D] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
          >
            <option value="Todas">Todas las marcas</option>
            {MARCAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="bg-[#161618] border border-[#2A2A2D] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
          >
            <option value="relevancia">Orden: relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="stock-desc">Más disponibilidad</option>
          </select>
        </div>

        {/* Cuadrícula de productos */}
        {resultados.length === 0 ? (
          <div className="border border-[#2A2A2D] py-16 text-center">
            <p className="text-[#8A877E]">
              No hay piezas que coincidan con esos filtros. Ajusta la búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resultados.map((p) => {
              const estado = estadoStock(p);
              return (
                <button
                  key={p.id}
                  onClick={() => setSeleccionado(p)}
                  className="text-left border border-[#2A2A2D] hover:border-[#C9A24B]/50 transition-colors group bg-[#161618]"
                >
                  <div className="aspect-[4/3] bg-[#0C0C0D] overflow-hidden border-b border-[#2A2A2D]">
                    {p.imagen ? (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#2A2A2D] text-4xl">
                        ⚙
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#8A877E]">
                        {p.marca}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${estado.borde} ${estado.color}`}
                      >
                        {estado.texto}
                      </span>
                    </div>
                    <h3 className="text-sm text-[#EDEAE3] leading-snug mb-2 min-h-[2.5rem]">
                      {p.nombre}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p
                        className="text-base text-[#C9A24B]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {formatoMoneda(p.precio)}
                      </p>
                      <p
                        className="text-[11px] text-[#8A877E]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {p.sku}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Panel de detalle */}
        {seleccionado && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            onClick={() => setSeleccionado(null)}
          >
            <div
              className="bg-[#161618] border border-[#2A2A2D] max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[16/9] bg-[#0C0C0D] border-b border-[#2A2A2D]">
                {seleccionado.imagen && (
                  <img
                    src={seleccionado.imagen}
                    alt={seleccionado.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#8A877E]">
                      {seleccionado.marca} · {seleccionado.categoria}
                    </p>
                    <h2
                      className="text-xl uppercase tracking-wide mt-1"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {seleccionado.nombre}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSeleccionado(null)}
                    className="text-[#8A877E] hover:text-[#EDEAE3] text-xl leading-none"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-[#8A877E] mb-5">{seleccionado.descripcion}</p>
                <div className="flex items-center justify-between border-t border-[#2A2A2D] pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#8A877E]">SKU</p>
                    <p
                      className="text-sm text-[#C9A24B]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {seleccionado.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A877E]">Precio</p>
                    <p
                      className="text-lg text-[#EDEAE3]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {formatoMoneda(seleccionado.precio)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
