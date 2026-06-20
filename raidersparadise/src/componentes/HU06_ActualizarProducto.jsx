import React, { useState } from "react";
import { CATEGORIAS, MARCAS, PRODUCTOS_INICIALES } from "./mockData";

/**
 * HU 06 — Actualizar producto
 * Permite seleccionar un producto existente del catálogo y editar su
 * información. El SKU se muestra como dato fijo (no editable), ya que
 * identifica la pieza igual que un número de chasis.
 *
 * Props:
 * - productos: arreglo de productos (por defecto usa PRODUCTOS_INICIALES).
 * - onActualizar(producto): callback con el producto ya editado.
 */
export default function HU06_ActualizarProducto({
  productos = PRODUCTOS_INICIALES,
  onActualizar,
}) {
  const [seleccionadoId, setSeleccionadoId] = useState(productos[0]?.id || "");
  const productoActual = productos.find((p) => p.id === seleccionadoId);

  const [form, setForm] = useState(() => ({ ...productoActual }));
  const [errores, setErrores] = useState({});
  const [guardado, setGuardado] = useState(false);

  const seleccionarProducto = (id) => {
    const prod = productos.find((p) => p.id === id);
    setSeleccionadoId(id);
    setForm({ ...prod });
    setErrores({});
    setGuardado(false);
  };

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setGuardado(false);
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre?.trim()) nuevosErrores.nombre = "El nombre no puede quedar vacío.";
    if (!form.categoria) nuevosErrores.categoria = "Selecciona una categoría.";
    if (!form.marca) nuevosErrores.marca = "Selecciona una marca.";
    if (!form.precio || Number(form.precio) <= 0)
      nuevosErrores.precio = "Ingresa un precio mayor a 0.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const productoEditado = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo),
    };

    if (onActualizar) onActualizar(productoEditado);
    setGuardado(true);
  };

  if (!productoActual) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] flex items-center justify-center px-6">
        <p className="text-[#8A877E]">No hay productos disponibles para editar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] px-6 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.3em] text-[#C9A24B] uppercase font-medium">
            Catálogo · Edición de ficha
          </p>
          <h1
            className="text-3xl uppercase tracking-wide mt-1"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Actualizar producto
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Selector de producto */}
          <div className="border border-[#2A2A2D]">
            <div className="px-4 py-3 border-b border-[#2A2A2D]">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#8A877E]">
                Seleccionar pieza
              </p>
            </div>
            <ul>
              {productos.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => seleccionarProducto(p.id)}
                    className={`w-full text-left px-4 py-3 border-b border-[#2A2A2D] last:border-b-0 transition-colors ${
                      seleccionadoId === p.id
                        ? "bg-[#C9A24B]/10 border-l-2 border-l-[#C9A24B]"
                        : "hover:bg-[#161618] border-l-2 border-l-transparent"
                    }`}
                  >
                    <p className="text-sm text-[#EDEAE3] leading-tight">{p.nombre}</p>
                    <p
                      className="text-[11px] text-[#8A877E] mt-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {p.sku}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulario de edición */}
          <div className="border border-[#2A2A2D] p-6">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#2A2A2D]">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#8A877E]">
                  Código de chasis (no editable)
                </p>
                <p
                  className="text-lg text-[#C9A24B] mt-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {form.sku}
                </p>
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider px-3 py-1 border ${
                  form.activo
                    ? "border-[#C9A24B]/40 text-[#C9A24B]"
                    : "border-[#8A877E]/40 text-[#8A877E]"
                }`}
              >
                {form.activo ? "Activo" : "Inactivo"}
              </span>
            </div>

            {guardado && (
              <div className="mb-5 border border-[#C9A24B]/40 bg-[#C9A24B]/5 px-4 py-3 text-sm flex items-center gap-2">
                <span className="text-[#C9A24B]">✓</span>
                Cambios guardados correctamente.
              </div>
            )}

            <form onSubmit={manejarSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={form.nombre || ""}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                  className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errores.nombre
                      ? "border-[#B5482A] focus:ring-[#B5482A]"
                      : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  }`}
                />
                {errores.nombre && (
                  <p className="text-xs text-[#B5482A] mt-1.5">{errores.nombre}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Categoría
                  </label>
                  <select
                    value={form.categoria || ""}
                    onChange={(e) => actualizarCampo("categoria", e.target.value)}
                    className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errores.categoria
                        ? "border-[#B5482A] focus:ring-[#B5482A]"
                        : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                    }`}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Marca
                  </label>
                  <select
                    value={form.marca || ""}
                    onChange={(e) => actualizarCampo("marca", e.target.value)}
                    className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errores.marca
                        ? "border-[#B5482A] focus:ring-[#B5482A]"
                        : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                    }`}
                  >
                    {MARCAS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio ?? ""}
                    onChange={(e) => actualizarCampo("precio", e.target.value)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errores.precio
                        ? "border-[#B5482A] focus:ring-[#B5482A]"
                        : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                    }`}
                  />
                  {errores.precio && (
                    <p className="text-xs text-[#B5482A] mt-1.5">{errores.precio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Stock actual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock ?? ""}
                    onChange={(e) => actualizarCampo("stock", e.target.value)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  />
                  <p className="text-[11px] text-[#8A877E] mt-1.5">
                    Usa "Actualizar inventario" para movimientos de stock.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stockMinimo ?? ""}
                    onChange={(e) => actualizarCampo("stockMinimo", e.target.value)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion || ""}
                  onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                  rows={3}
                  className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm text-[#8A877E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.activo}
                    onChange={(e) => actualizarCampo("activo", e.target.checked)}
                    className="accent-[#C9A24B] w-4 h-4"
                  />
                  Producto activo en catálogo
                </label>

                <button
                  type="submit"
                  className="bg-[#C9A24B] text-[#0C0C0D] px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-[#dab464] transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
