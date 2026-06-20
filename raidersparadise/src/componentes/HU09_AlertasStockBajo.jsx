import { useState } from "react";

const productosIniciales = [
  { id: 1, nombre: "Laptop Dell XPS 13", categoria: "Electrónica", stock: 3, minimo: 5, precio: 1299.99, unidad: "und" },
  { id: 2, nombre: "Mouse Inalámbrico Logitech", categoria: "Periféricos", stock: 8, minimo: 10, precio: 25.5, unidad: "und" },
  { id: 3, nombre: "Papel A4 75g", categoria: "Papelería", stock: 2, minimo: 20, precio: 8.99, unidad: "resma" },
  { id: 4, nombre: "Tóner HP LaserJet", categoria: "Impresión", stock: 1, minimo: 3, precio: 89.0, unidad: "und" },
  { id: 5, nombre: "Silla Ergonómica", categoria: "Mobiliario", stock: 4, minimo: 4, precio: 320.0, unidad: "und" },
  { id: 6, nombre: "Monitor 24\" Samsung", categoria: "Electrónica", stock: 0, minimo: 2, precio: 220.0, unidad: "und" },
  { id: 7, nombre: "Teclado Mecánico", categoria: "Periféricos", stock: 6, minimo: 5, precio: 75.0, unidad: "und" },
  { id: 8, nombre: "Cable HDMI 2m", categoria: "Accesorios", stock: 12, minimo: 15, precio: 9.99, unidad: "und" },
];

const getNivelAlerta = (stock, minimo) => {
  if (stock === 0) return "critico";
  if (stock <= minimo * 0.5) return "alto";
  if (stock <= minimo) return "medio";
  return "ok";
};

const badges = {
  critico: { label: "Sin stock", bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  alto: { label: "Crítico", bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  medio: { label: "Bajo", bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  ok: { label: "Normal", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
};

export default function AlertasStockBajo() {
  const [productos, setProductos] = useState(productosIniciales);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [stockTemporal, setStockTemporal] = useState("");
  const [notificacionEnviada, setNotificacionEnviada] = useState([]);

  const productosFiltrados = productos.filter((p) => {
    const nivel = getNivelAlerta(p.stock, p.minimo);
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    if (filtro === "todos") return coincideBusqueda;
    if (filtro === "alertas") return coincideBusqueda && nivel !== "ok";
    return coincideBusqueda && nivel === filtro;
  });

  const resumen = {
    sinStock: productos.filter((p) => p.stock === 0).length,
    critico: productos.filter((p) => getNivelAlerta(p.stock, p.minimo) === "alto").length,
    bajo: productos.filter((p) => getNivelAlerta(p.stock, p.minimo) === "medio").length,
    total: productos.filter((p) => getNivelAlerta(p.stock, p.minimo) !== "ok").length,
  };

  const actualizarStock = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: parseInt(stockTemporal) || 0 } : p))
    );
    setProductoEditando(null);
    setStockTemporal("");
  };

  const enviarNotificacion = (id) => {
    setNotificacionEnviada((prev) => [...prev, id]);
    setTimeout(() => setNotificacionEnviada((prev) => prev.filter((i) => i !== id)), 3000);
  };

  const porcentajeStock = (stock, minimo) => Math.min((stock / minimo) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Alertas de Stock Bajo</h1>
              <p className="text-sm text-slate-500">HU-09 · Monitoreo de inventario en tiempo real</p>
            </div>
          </div>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Sin Stock", value: resumen.sinStock, color: "border-l-red-500", icon: "🚫" },
            { label: "Stock Crítico", value: resumen.critico, color: "border-l-orange-500", icon: "⚠️" },
            { label: "Stock Bajo", value: resumen.bajo, color: "border-l-yellow-500", icon: "📉" },
            { label: "Total Alertas", value: resumen.total, color: "border-l-slate-500", icon: "🔔" },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-xl p-4 border-l-4 ${item.color} shadow-sm`}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-3xl font-bold text-slate-800">{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar producto o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "todos", label: "Todos" },
                { key: "alertas", label: "Con alerta" },
                { key: "critico", label: "Sin stock" },
                { key: "alto", label: "Crítico" },
                { key: "medio", label: "Bajo" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                    filtro === f.key
                      ? "bg-red-600 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-slate-400">Última actualización: hace 5 min</span>
          </div>

          <div className="divide-y divide-slate-50">
            {productosFiltrados.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium">No hay productos con esta condición</p>
              </div>
            ) : (
              productosFiltrados.map((producto) => {
                const nivel = getNivelAlerta(producto.stock, producto.minimo);
                const badge = badges[nivel];
                const pct = porcentajeStock(producto.stock, producto.minimo);
                const editando = productoEditando === producto.id;
                const notificado = notificacionEnviada.includes(producto.id);

                return (
                  <div key={producto.id} className={`p-5 hover:bg-slate-50 transition-colors ${nivel !== "ok" ? "border-l-4 " + (nivel === "critico" ? "border-l-red-400" : nivel === "alto" ? "border-l-orange-400" : "border-l-yellow-400") : ""}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Info producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 text-sm truncate">{producto.nombre}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{producto.categoria}</span>
                          <span>•</span>
                          <span>${producto.precio.toFixed(2)} / {producto.unidad}</span>
                          <span>•</span>
                          <span>Mínimo: {producto.minimo} {producto.unidad}</span>
                        </div>
                        {/* Barra de progreso */}
                        <div className="mt-2">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-48">
                            <div
                              className={`h-full rounded-full transition-all ${nivel === "critico" ? "bg-red-500" : nivel === "alto" ? "bg-orange-500" : nivel === "medio" ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stock actual */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${nivel === "critico" ? "text-red-600" : nivel === "alto" ? "text-orange-600" : nivel === "medio" ? "text-yellow-600" : "text-green-600"}`}>
                            {producto.stock}
                          </div>
                          <div className="text-xs text-slate-400">en stock</div>
                        </div>

                        {/* Edición de stock */}
                        {editando ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={stockTemporal}
                              onChange={(e) => setStockTemporal(e.target.value)}
                              className="w-20 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              autoFocus
                            />
                            <button onClick={() => actualizarStock(producto.id)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 font-medium">
                              Guardar
                            </button>
                            <button onClick={() => setProductoEditando(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setProductoEditando(producto.id); setStockTemporal(producto.stock.toString()); }}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 font-medium transition"
                            >
                              Actualizar
                            </button>
                            {nivel !== "ok" && (
                              <button
                                onClick={() => enviarNotificacion(producto.id)}
                                disabled={notificado}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${notificado ? "bg-green-100 text-green-700" : "bg-red-600 text-white hover:bg-red-700"}`}
                              >
                                {notificado ? "✓ Enviado" : "Notificar"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
