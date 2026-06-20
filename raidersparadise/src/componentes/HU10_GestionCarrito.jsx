import { useState } from "react";

const catalogoInicial = [
  { id: 1, nombre: "Laptop Dell XPS 13", categoria: "Electrónica", precio: 1299.99, stock: 8, imagen: "💻" },
  { id: 2, nombre: "Mouse Inalámbrico Logitech", categoria: "Periféricos", precio: 25.5, stock: 15, imagen: "🖱️" },
  { id: 3, nombre: "Papel A4 75g (resma)", categoria: "Papelería", precio: 8.99, stock: 50, imagen: "📄" },
  { id: 4, nombre: "Tóner HP LaserJet", categoria: "Impresión", precio: 89.0, stock: 6, imagen: "🖨️" },
  { id: 5, nombre: "Monitor 24\" Samsung", categoria: "Electrónica", precio: 220.0, stock: 4, imagen: "🖥️" },
  { id: 6, nombre: "Teclado Mecánico", categoria: "Periféricos", precio: 75.0, stock: 9, imagen: "⌨️" },
  { id: 7, nombre: "Cable HDMI 2m", categoria: "Accesorios", precio: 9.99, stock: 20, imagen: "🔌" },
  { id: 8, nombre: "Webcam HD 1080p", categoria: "Periféricos", precio: 55.0, stock: 7, imagen: "📷" },
];

export default function GestionCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [vistaCarrito, setVistaCarrito] = useState(false);
  const [itemAgregado, setItemAgregado] = useState(null);

  const categorias = ["Todas", ...new Set(catalogoInicial.map((p) => p.categoria))];

  const catalogoFiltrado = catalogoInicial.filter((p) => {
    const coincide = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cat = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return coincide && cat;
  });

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) {
        if (existe.cantidad >= producto.stock) return prev;
        return prev.map((i) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setItemAgregado(producto.id);
    setTimeout(() => setItemAgregado(null), 1500);
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
        .filter((i) => i.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((i) => i.id !== id));
  };

  const limpiarCarrito = () => setCarrito([]);

  const cantidadEnCarrito = (id) => carrito.find((i) => i.id === id)?.cantidad || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-none">Gestión de Carrito</h1>
              <p className="text-xs text-slate-400">HU-10</p>
            </div>
          </div>
          <button
            onClick={() => setVistaCarrito(!vistaCarrito)}
            className="relative flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {vistaCarrito ? "Ver Catálogo" : "Ver Carrito"}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!vistaCarrito ? (
          <>
            {/* Filtros catálogo */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl transition ${
                      categoriaFiltro === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catalogoFiltrado.map((producto) => {
                const enCarrito = cantidadEnCarrito(producto.id);
                const agregado = itemAgregado === producto.id;
                const sinStock = producto.stock === 0;

                return (
                  <div key={producto.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 h-28 flex items-center justify-center text-5xl">
                      {producto.imagen}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{producto.categoria}</span>
                      <h3 className="font-semibold text-slate-800 text-sm mt-2 leading-snug">{producto.nombre}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-slate-900">${producto.precio.toFixed(2)}</span>
                        <span className={`text-xs ${producto.stock <= 5 ? "text-orange-600" : "text-slate-400"}`}>
                          Stock: {producto.stock}
                        </span>
                      </div>
                      <div className="mt-3">
                        {enCarrito > 0 ? (
                          <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-3 py-1.5">
                            <button onClick={() => cambiarCantidad(producto.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-indigo-700 font-bold hover:bg-indigo-100 transition text-lg leading-none">
                              −
                            </button>
                            <span className="font-bold text-indigo-700 text-sm">{enCarrito}</span>
                            <button
                              onClick={() => agregarAlCarrito(producto)}
                              disabled={enCarrito >= producto.stock}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-indigo-700 font-bold hover:bg-indigo-100 transition disabled:opacity-40 text-lg leading-none"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={sinStock}
                            className={`w-full py-2 rounded-xl text-sm font-semibold transition ${
                              agregado
                                ? "bg-green-100 text-green-700"
                                : sinStock
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            {agregado ? "✓ Agregado" : sinStock ? "Sin stock" : "Agregar"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Vista carrito */
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Mi Carrito ({totalItems} ítem{totalItems !== 1 ? "s" : ""})</h2>
              {carrito.length > 0 && (
                <button onClick={limpiarCarrito} className="text-sm text-red-500 hover:text-red-700 font-medium transition">
                  Vaciar carrito
                </button>
              )}
            </div>

            {carrito.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-slate-500 font-medium mb-4">El carrito está vacío</p>
                <button onClick={() => setVistaCarrito(false)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
                  Ver catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Items */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {item.imagen}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{item.nombre}</p>
                        <p className="text-xs text-slate-400">${item.precio.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => cambiarCantidad(item.id, -1)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">
                          −
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800 text-sm">{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, 1)} disabled={item.cantidad >= item.stock} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold disabled:opacity-40">
                          +
                        </button>
                      </div>
                      <div className="w-20 text-right">
                        <p className="font-bold text-slate-800 text-sm">${(item.precio * item.cantidad).toFixed(2)}</p>
                      </div>
                      <button onClick={() => eliminarDelCarrito(item.id)} className="text-slate-300 hover:text-red-500 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-700 mb-4">Resumen del pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalItems} ítem{totalItems !== 1 ? "s" : ""})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IVA (19%)</span>
                      <span>${iva.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between font-bold text-slate-900 text-base">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
                    Proceder al pago →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
