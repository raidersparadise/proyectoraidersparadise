import { useState } from "react";

const proveedores = [
  { id: 1, nombre: "Tech Supplies S.A.S", contacto: "Juan Pérez", email: "juan@techsupplies.com", telefono: "601-234-5678" },
  { id: 2, nombre: "Papelería Central Ltda.", contacto: "María García", email: "maria@papelcentral.com", telefono: "601-987-6543" },
  { id: 3, nombre: "ImportaElec Colombia", contacto: "Carlos Ruiz", email: "carlos@importaelec.co", telefono: "601-456-7890" },
  { id: 4, nombre: "Muebles & Oficina SAS", contacto: "Ana López", email: "ana@mueblicina.com", telefono: "601-321-0987" },
];

const productosDisponibles = [
  { id: 1, nombre: "Laptop Dell XPS 13", unidad: "und", precio: 1299.99 },
  { id: 2, nombre: "Mouse Inalámbrico Logitech", unidad: "und", precio: 25.5 },
  { id: 3, nombre: "Papel A4 75g", unidad: "resma", precio: 8.99 },
  { id: 4, nombre: "Tóner HP LaserJet", unidad: "und", precio: 89.0 },
  { id: 5, nombre: "Monitor 24\" Samsung", unidad: "und", precio: 220.0 },
  { id: 6, nombre: "Teclado Mecánico", unidad: "und", precio: 75.0 },
  { id: 7, nombre: "Cable HDMI 2m", unidad: "und", precio: 9.99 },
  { id: 8, nombre: "Webcam HD 1080p", unidad: "und", precio: 55.0 },
  { id: 9, nombre: "Silla Ergonómica", unidad: "und", precio: 320.0 },
  { id: 10, nombre: "Hub USB-C 7 puertos", unidad: "und", precio: 42.0 },
];

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(valor * 4000);

const pasos = ["Proveedor", "Productos", "Condiciones", "Revisión"];

export default function CrearOrdenCompra() {
  const [pasoActual, setPasoActual] = useState(0);
  const [proveedor, setProveedor] = useState(null);
  const [items, setItems] = useState([]);
  const [condiciones, setCondiciones] = useState({
    fechaEntrega: "",
    metodoPago: "30dias",
    moneda: "USD",
    notas: "",
    urgente: false,
  });
  const [ordenCreada, setOrdenCreada] = useState(null);
  const [productoBuscado, setProductoBuscado] = useState("");
  const [errores, setErrores] = useState({});

  const agregarItem = (producto) => {
    if (items.find((i) => i.id === producto.id)) return;
    setItems((prev) => [...prev, { ...producto, cantidad: 1, precioUnitario: producto.precio, descuento: 0 }]);
  };

  const actualizarItem = (id, campo, valor) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [campo]: parseFloat(valor) || 0 } : i))
    );
  };

  const eliminarItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario * (1 - i.descuento / 100), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const validarPaso = () => {
    const e = {};
    if (pasoActual === 0 && !proveedor) e.proveedor = "Selecciona un proveedor";
    if (pasoActual === 1 && items.length === 0) e.items = "Agrega al menos un producto";
    if (pasoActual === 2) {
      if (!condiciones.fechaEntrega) e.fechaEntrega = "Ingresa la fecha de entrega";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const avanzar = () => {
    if (validarPaso()) setPasoActual((p) => p + 1);
  };

  const retroceder = () => {
    setErrores({});
    setPasoActual((p) => p - 1);
  };

  const crearOrden = () => {
    const num = `OC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setOrdenCreada({ numero: num, fecha: new Date().toLocaleDateString("es-CO") });
    setPasoActual(4);
  };

  const productosFiltrados = productosDisponibles.filter(
    (p) => p.nombre.toLowerCase().includes(productoBuscado.toLowerCase()) && !items.find((i) => i.id === p.id)
  );

  if (pasoActual === 4 && ordenCreada) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Orden Creada!</h2>
          <p className="text-slate-500 mb-1">Número de orden</p>
          <p className="text-3xl font-bold text-indigo-600 mb-1">{ordenCreada.numero}</p>
          <p className="text-sm text-slate-400 mb-6">Fecha: {ordenCreada.fecha}</p>
          <div className="bg-slate-50 rounded-2xl p-4 text-left text-sm mb-6 space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Proveedor</span><span className="font-semibold">{proveedor.nombre}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Productos</span><span className="font-semibold">{items.length} ítems</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total USD</span><span className="font-semibold">${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total COP</span><span className="font-semibold">{formatCOP(total)}</span></div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
              📄 Descargar PDF
            </button>
            <button
              onClick={() => { setOrdenCreada(null); setPasoActual(0); setProveedor(null); setItems([]); setCondiciones({ fechaEntrega: "", metodoPago: "30dias", moneda: "USD", notas: "", urgente: false }); }}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
            >
              Nueva orden
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Crear Orden de Compra</h1>
              <p className="text-sm text-slate-500">HU-11 · Generación de órdenes a proveedores</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {pasos.map((paso, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= pasoActual ? "text-violet-700" : "text-slate-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < pasoActual ? "bg-violet-600 text-white" : i === pasoActual ? "bg-violet-100 text-violet-700 ring-2 ring-violet-600" : "bg-slate-100 text-slate-400"
                }`}>
                  {i < pasoActual ? "✓" : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block">{paso}</span>
              </div>
              {i < pasos.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all ${i < pasoActual ? "bg-violet-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {/* Paso 0: Proveedor */}
          {pasoActual === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Seleccionar Proveedor</h2>
              <p className="text-sm text-slate-500 mb-5">Elige el proveedor para esta orden de compra</p>
              {errores.proveedor && <p className="text-xs text-red-600 mb-3 bg-red-50 px-3 py-2 rounded-lg">{errores.proveedor}</p>}
              <div className="grid gap-3">
                {proveedores.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProveedor(p)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      proveedor?.id === p.id
                        ? "border-violet-600 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{p.nombre}</p>
                        <p className="text-sm text-slate-500">{p.contacto} · {p.email}</p>
                        <p className="text-xs text-slate-400">{p.telefono}</p>
                      </div>
                      {proveedor?.id === p.id && (
                        <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 1: Productos */}
          {pasoActual === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Agregar Productos</h2>
              <p className="text-sm text-slate-500 mb-5">Busca y selecciona los productos para la orden</p>
              {errores.items && <p className="text-xs text-red-600 mb-3 bg-red-50 px-3 py-2 rounded-lg">{errores.items}</p>}

              {/* Buscador */}
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={productoBuscado}
                  onChange={(e) => setProductoBuscado(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Lista de productos disponibles */}
              {productosFiltrados.length > 0 && (
                <div className="border border-slate-200 rounded-xl mb-5 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {productosFiltrados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => agregarItem(p)}
                      className="w-full text-left px-4 py-2.5 hover:bg-violet-50 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.nombre}</p>
                        <p className="text-xs text-slate-400">{p.unidad}</p>
                      </div>
                      <span className="text-sm font-semibold text-violet-700">${p.precio.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Items seleccionados */}
              {items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Productos en la orden</p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="bg-slate-50 rounded-xl p-3 flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.nombre}</p>
                          <div className="flex gap-3 mt-2 flex-wrap">
                            <div>
                              <label className="text-xs text-slate-400">Cantidad</label>
                              <input
                                type="number" min="1" value={item.cantidad}
                                onChange={(e) => actualizarItem(item.id, "cantidad", e.target.value)}
                                className="block w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Precio Unit. (USD)</label>
                              <input
                                type="number" min="0" step="0.01" value={item.precioUnitario}
                                onChange={(e) => actualizarItem(item.id, "precioUnitario", e.target.value)}
                                className="block w-28 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-400">Descuento %</label>
                              <input
                                type="number" min="0" max="100" value={item.descuento}
                                onChange={(e) => actualizarItem(item.id, "descuento", e.target.value)}
                                className="block w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 mt-0.5"
                              />
                            </div>
                            <div className="flex items-end">
                              <div>
                                <label className="text-xs text-slate-400">Subtotal</label>
                                <p className="text-sm font-bold text-slate-800 mt-0.5 py-1">
                                  ${(item.cantidad * item.precioUnitario * (1 - item.descuento / 100)).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => eliminarItem(item.id)} className="text-slate-300 hover:text-red-500 transition mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Condiciones */}
          {pasoActual === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Condiciones de la Orden</h2>
              <p className="text-sm text-slate-500 mb-5">Define los términos y condiciones de entrega y pago</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de Entrega *</label>
                  <input
                    type="date"
                    value={condiciones.fechaEntrega}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCondiciones((p) => ({ ...p, fechaEntrega: e.target.value }))}
                    className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 ${errores.fechaEntrega ? "border-red-400" : "border-slate-200"}`}
                  />
                  {errores.fechaEntrega && <p className="text-xs text-red-500 mt-1">{errores.fechaEntrega}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Método de Pago</label>
                  <select
                    value={condiciones.metodoPago}
                    onChange={(e) => setCondiciones((p) => ({ ...p, metodoPago: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    <option value="contado">Contado</option>
                    <option value="15dias">15 días</option>
                    <option value="30dias">30 días</option>
                    <option value="60dias">60 días</option>
                    <option value="90dias">90 días</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Moneda</label>
                  <select
                    value={condiciones.moneda}
                    onChange={(e) => setCondiciones((p) => ({ ...p, moneda: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    <option value="USD">USD - Dólares</option>
                    <option value="COP">COP - Pesos colombianos</option>
                    <option value="EUR">EUR - Euros</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 w-full">
                    <input
                      type="checkbox"
                      id="urgente"
                      checked={condiciones.urgente}
                      onChange={(e) => setCondiciones((p) => ({ ...p, urgente: e.target.checked }))}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <label htmlFor="urgente" className="text-sm font-medium text-orange-700 cursor-pointer">
                      ⚡ Marcar como urgente
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas adicionales</label>
                  <textarea
                    value={condiciones.notas}
                    onChange={(e) => setCondiciones((p) => ({ ...p, notas: e.target.value }))}
                    rows={3}
                    placeholder="Instrucciones especiales para el proveedor..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Revisión */}
          {pasoActual === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Revisión Final</h2>
              <p className="text-sm text-slate-500 mb-5">Verifica los datos antes de crear la orden</p>
              <div className="space-y-4">
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-2">Proveedor</p>
                  <p className="font-semibold text-slate-800">{proveedor.nombre}</p>
                  <p className="text-sm text-slate-500">{proveedor.contacto} · {proveedor.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Productos ({items.length})</p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-700">{item.nombre} × {item.cantidad}</span>
                        <span className="font-medium text-slate-800">${(item.cantidad * item.precioUnitario * (1 - item.descuento / 100)).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-slate-500"><span>IVA (19%)</span><span>${iva.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-slate-900"><span>Total {condiciones.moneda}</span><span>${total.toFixed(2)}</span></div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Condiciones</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-slate-400">Entrega:</span> <span className="font-medium">{condiciones.fechaEntrega}</span></div>
                    <div><span className="text-slate-400">Pago:</span> <span className="font-medium">{condiciones.metodoPago}</span></div>
                    <div><span className="text-slate-400">Moneda:</span> <span className="font-medium">{condiciones.moneda}</span></div>
                    {condiciones.urgente && <div><span className="text-orange-600 font-semibold">⚡ Urgente</span></div>}
                  </div>
                  {condiciones.notas && <p className="text-sm text-slate-600 mt-2 bg-white p-2 rounded-lg">{condiciones.notas}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Botones navegación */}
          <div className="flex justify-between mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={retroceder}
              disabled={pasoActual === 0}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition disabled:opacity-40"
            >
              ← Anterior
            </button>
            {pasoActual < 3 ? (
              <button onClick={avanzar} className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                Siguiente →
              </button>
            ) : (
              <button onClick={crearOrden} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                ✓ Crear Orden
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
