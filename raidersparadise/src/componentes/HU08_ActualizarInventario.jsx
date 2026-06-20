import React, { useState } from "react";
import { PRODUCTOS_INICIALES, formatoMoneda } from "./mockData";

/**
 * HU 08 — Actualizar inventario
 * Panel tipo "control de taller" para registrar movimientos de stock
 * (entradas y salidas) sobre el catálogo, con historial de movimientos
 * de la sesión y alerta visual cuando una pieza queda en o por debajo
 * de su stock mínimo.
 *
 * Props:
 * - productosIniciales: arreglo de productos (por defecto PRODUCTOS_INICIALES).
 * - onActualizarInventario(producto, movimiento): callback opcional.
 */
export default function HU08_ActualizarInventario({
  productosIniciales = PRODUCTOS_INICIALES,
  onActualizarInventario,
}) {
  const [productos, setProductos] = useState(productosIniciales);
  const [seleccionadoId, setSeleccionadoId] = useState(productosIniciales[0]?.id || "");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");

  const productoActual = productos.find((p) => p.id === seleccionadoId);

  const registrarMovimiento = (e) => {
    e.preventDefault();
    setError("");

    const cant = Number(cantidad);
    if (!cant || cant <= 0) {
      setError("Ingresa una cantidad mayor a 0.");
      return;
    }

    if (tipoMovimiento === "salida" && cant > productoActual.stock) {
      setError(
        `No puedes retirar ${cant} unidades. Stock disponible: ${productoActual.stock}.`
      );
      return;
    }

    const nuevoStock =
      tipoMovimiento === "entrada"
        ? productoActual.stock + cant
        : productoActual.stock - cant;

    const productoActualizado = { ...productoActual, stock: nuevoStock };

    setProductos((prev) =>
      prev.map((p) => (p.id === seleccionadoId ? productoActualizado : p))
    );

    const movimiento = {
      id: `m-${Date.now()}`,
      productoId: seleccionadoId,
      nombre: productoActual.nombre,
      sku: productoActual.sku,
      tipo: tipoMovimiento,
      cantidad: cant,
      motivo: motivo.trim() || "Sin especificar",
      stockResultante: nuevoStock,
      fecha: new Date().toLocaleString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setHistorial((prev) => [movimiento, ...prev]);
    if (onActualizarInventario) onActualizarInventario(productoActualizado, movimiento);

    setCantidad("");
    setMotivo("");
  };

  if (!productoActual) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] flex items-center justify-center px-6">
        <p className="text-[#8A877E]">No hay productos disponibles para gestionar inventario.</p>
      </div>
    );
  }

  const stockBajo = productoActual.stock <= productoActual.stockMinimo;
  const agotado = productoActual.stock === 0;

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] px-6 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.3em] text-[#C9A24B] uppercase font-medium">
            Taller · Control de existencias
          </p>
          <h1
            className="text-3xl uppercase tracking-wide mt-1"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Actualizar inventario
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Columna principal: selección + movimiento */}
          <div className="space-y-6">
            <div className="border border-[#2A2A2D] p-6">
              <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                Pieza a actualizar
              </label>
              <select
                value={seleccionadoId}
                onChange={(e) => {
                  setSeleccionadoId(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] mb-5"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.sku}
                  </option>
                ))}
              </select>

              {/* Velocímetro de stock */}
              <div
                className={`border p-5 flex items-center justify-between ${
                  agotado
                    ? "border-[#B5482A]/50 bg-[#B5482A]/5"
                    : stockBajo
                    ? "border-[#C9A24B]/50 bg-[#C9A24B]/5"
                    : "border-[#2A2A2D]"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8A877E]">
                    Stock actual
                  </p>
                  <p
                    className={`text-4xl mt-1 ${
                      agotado
                        ? "text-[#B5482A]"
                        : stockBajo
                        ? "text-[#C9A24B]"
                        : "text-[#EDEAE3]"
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {String(productoActual.stock).padStart(3, "0")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-[#8A877E]">
                    Mínimo requerido
                  </p>
                  <p
                    className="text-lg text-[#8A877E] mt-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {String(productoActual.stockMinimo).padStart(3, "0")}
                  </p>
                  {(agotado || stockBajo) && (
                    <p
                      className={`text-[11px] uppercase tracking-wider mt-2 ${
                        agotado ? "text-[#B5482A]" : "text-[#C9A24B]"
                      }`}
                    >
                      {agotado ? "⚠ Pieza agotada" : "⚠ Reabastecer pronto"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Formulario de movimiento */}
            <form
              onSubmit={registrarMovimiento}
              className="border border-[#2A2A2D] p-6 space-y-5"
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#8A877E]">
                Registrar movimiento
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoMovimiento("entrada")}
                  className={`py-3 text-sm uppercase tracking-wider border transition-colors ${
                    tipoMovimiento === "entrada"
                      ? "border-[#7A9B76] bg-[#7A9B76]/10 text-[#7A9B76]"
                      : "border-[#2A2A2D] text-[#8A877E] hover:border-[#8A877E]"
                  }`}
                >
                  + Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setTipoMovimiento("salida")}
                  className={`py-3 text-sm uppercase tracking-wider border transition-colors ${
                    tipoMovimiento === "salida"
                      ? "border-[#B5482A] bg-[#B5482A]/10 text-[#B5482A]"
                      : "border-[#2A2A2D] text-[#8A877E] hover:border-[#8A877E]"
                  }`}
                >
                  − Salida
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="0"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                    Motivo (opcional)
                  </label>
                  <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej. Compra a proveedor, venta, ajuste"
                    className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-[#B5482A] border border-[#B5482A]/40 bg-[#B5482A]/5 px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#C9A24B] text-[#0C0C0D] py-3 text-sm uppercase tracking-widest font-medium hover:bg-[#dab464] transition-colors"
              >
                Confirmar movimiento
              </button>
            </form>
          </div>

          {/* Historial de movimientos */}
          <div className="border border-[#2A2A2D]">
            <div className="px-5 py-4 border-b border-[#2A2A2D]">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#8A877E]">
                Historial de la sesión
              </p>
            </div>
            {historial.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[#8A877E]">
                  Aún no hay movimientos registrados.
                </p>
              </div>
            ) : (
              <ul className="max-h-[560px] overflow-y-auto">
                {historial.map((m) => (
                  <li
                    key={m.id}
                    className="px-5 py-4 border-b border-[#2A2A2D] last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#EDEAE3] leading-tight">{m.nombre}</p>
                        <p
                          className="text-[11px] text-[#8A877E] mt-1"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {m.sku}
                        </p>
                      </div>
                      <span
                        className={`text-xs uppercase tracking-wider shrink-0 ${
                          m.tipo === "entrada" ? "text-[#7A9B76]" : "text-[#B5482A]"
                        }`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {m.tipo === "entrada" ? "+" : "−"}
                        {m.cantidad}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#8A877E]">
                      <span>{m.motivo}</span>
                      <span>{m.fecha}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
