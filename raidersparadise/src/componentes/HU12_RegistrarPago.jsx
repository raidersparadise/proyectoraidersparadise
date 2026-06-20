import { useState } from "react";

const ordenesPendientes = [
  { id: "OC-2024-1042", proveedor: "Tech Supplies S.A.S", fecha: "2024-11-15", vencimiento: "2024-12-15", total: 2599.98, pagado: 0, moneda: "USD" },
  { id: "OC-2024-1038", proveedor: "Papelería Central Ltda.", fecha: "2024-11-10", vencimiento: "2024-12-10", total: 449.5, pagado: 200.0, moneda: "USD" },
  { id: "OC-2024-1031", proveedor: "ImportaElec Colombia", fecha: "2024-10-28", vencimiento: "2024-11-28", total: 1320.0, pagado: 0, moneda: "USD" },
  { id: "OC-2024-1025", proveedor: "Muebles & Oficina SAS", fecha: "2024-10-15", vencimiento: "2024-11-15", total: 960.0, pagado: 960.0, moneda: "USD" },
  { id: "OC-2024-1019", proveedor: "Tech Supplies S.A.S", fecha: "2024-10-01", vencimiento: "2024-10-31", total: 875.0, pagado: 500.0, moneda: "USD" },
];

const metodosPago = [
  { id: "transferencia", label: "Transferencia Bancaria", icon: "🏦" },
  { id: "cheque", label: "Cheque", icon: "📝" },
  { id: "efectivo", label: "Efectivo", icon: "💵" },
  { id: "credito", label: "Tarjeta de Crédito", icon: "💳" },
  { id: "pse", label: "PSE", icon: "🌐" },
];

const getBancos = () => ["Bancolombia", "Davivienda", "BBVA Colombia", "Banco de Bogotá", "Colpatria", "Itaú", "Banco Popular"];

const getEstado = (orden) => {
  if (orden.pagado >= orden.total) return "pagado";
  const hoy = new Date();
  const venc = new Date(orden.vencimiento);
  if (hoy > venc) return "vencido";
  const diasRestantes = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
  if (diasRestantes <= 5) return "proximo";
  return "pendiente";
};

const estadoBadge = {
  pagado: { label: "Pagado", bg: "bg-green-100", text: "text-green-700" },
  vencido: { label: "Vencido", bg: "bg-red-100", text: "text-red-700" },
  proximo: { label: "Por vencer", bg: "bg-orange-100", text: "text-orange-700" },
  pendiente: { label: "Pendiente", bg: "bg-blue-100", text: "text-blue-700" },
};

export default function RegistrarPago() {
  const [ordenes, setOrdenes] = useState(ordenesPendientes);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [formulario, setFormulario] = useState({
    monto: "",
    metodo: "",
    banco: "",
    referencia: "",
    fecha: new Date().toISOString().split("T")[0],
    numeroCheque: "",
    notas: "",
  });
  const [errores, setErrores] = useState({});
  const [pagos, setPagos] = useState([]);
  const [pagoRegistrado, setPagoRegistrado] = useState(null);
  const [filtroPagos, setFiltroPagos] = useState("todos");

  const ordenesFiltradasVista = ordenes.filter((o) => {
    const estado = getEstado(o);
    if (filtroPagos === "todos") return true;
    return estado === filtroPagos;
  });

  const saldoPendiente = (orden) => Math.max(orden.total - orden.pagado, 0);

  const handleSeleccionarOrden = (orden) => {
    if (getEstado(orden) === "pagado") return;
    setOrdenSeleccionada(orden);
    setFormulario({
      monto: saldoPendiente(orden).toFixed(2),
      metodo: "",
      banco: "",
      referencia: "",
      fecha: new Date().toISOString().split("T")[0],
      numeroCheque: "",
      notas: "",
    });
    setErrores({});
    setPagoRegistrado(null);
  };

  const handleCambio = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: "" }));
  };

  const validar = () => {
    const e = {};
    const monto = parseFloat(formulario.monto);
    const saldo = saldoPendiente(ordenSeleccionada);
    if (!formulario.monto || isNaN(monto) || monto <= 0) e.monto = "Ingresa un monto válido";
    else if (monto > saldo) e.monto = `El monto no puede superar el saldo ($${saldo.toFixed(2)})`;
    if (!formulario.metodo) e.metodo = "Selecciona el método de pago";
    if ((formulario.metodo === "transferencia" || formulario.metodo === "pse") && !formulario.banco) e.banco = "Selecciona el banco";
    if (!formulario.referencia.trim()) e.referencia = "Ingresa el número de referencia";
    if (formulario.metodo === "cheque" && !formulario.numeroCheque.trim()) e.numeroCheque = "Ingresa el número de cheque";
    if (!formulario.fecha) e.fecha = "Selecciona la fecha";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const registrarPago = () => {
    if (!validar()) return;
    const monto = parseFloat(formulario.monto);
    const nuevoPago = {
      id: `PAG-${Date.now()}`,
      ordenId: ordenSeleccionada.id,
      proveedor: ordenSeleccionada.proveedor,
      monto,
      metodo: formulario.metodo,
      banco: formulario.banco,
      referencia: formulario.referencia,
      fecha: formulario.fecha,
      notas: formulario.notas,
      timestamp: new Date().toISOString(),
    };
    setPagos((prev) => [nuevoPago, ...prev]);
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === ordenSeleccionada.id ? { ...o, pagado: o.pagado + monto } : o
      )
    );
    setPagoRegistrado(nuevoPago);
    setOrdenSeleccionada(null);
  };

  const totalDeuda = ordenes.reduce((acc, o) => acc + saldoPendiente(o), 0);
  const totalPagado = ordenes.reduce((acc, o) => acc + o.pagado, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Registrar Pago</h1>
              <p className="text-sm text-slate-500">HU-12 · Gestión de pagos a proveedores</p>
            </div>
          </div>
        </div>

        {/* Notificación de pago exitoso */}
        {pagoRegistrado && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800">Pago registrado exitosamente</p>
              <p className="text-sm text-green-600">
                ${pagoRegistrado.monto.toFixed(2)} USD · Ref: {pagoRegistrado.referencia} · Orden: {pagoRegistrado.ordenId}
              </p>
            </div>
            <button onClick={() => setPagoRegistrado(null)} className="text-green-400 hover:text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Deuda total", value: `$${totalDeuda.toFixed(0)}`, sub: "USD pendiente", color: "border-l-red-500" },
            { label: "Total pagado", value: `$${totalPagado.toFixed(0)}`, sub: "USD pagado", color: "border-l-green-500" },
            { label: "Órdenes activas", value: ordenes.filter((o) => getEstado(o) !== "pagado").length, sub: "sin completar", color: "border-l-blue-500" },
            { label: "Pagos registrados", value: pagos.length, sub: "en esta sesión", color: "border-l-violet-500" },
          ].map((m, i) => (
            <div key={i} className={`bg-white rounded-xl p-4 border-l-4 ${m.color} shadow-sm`}>
              <div className="text-2xl font-bold text-slate-800">{m.value}</div>
              <div className="text-sm font-medium text-slate-600">{m.label}</div>
              <div className="text-xs text-slate-400">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lista de órdenes */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-semibold text-slate-800">Órdenes de Compra</h2>
                <div className="flex gap-2">
                  {["todos", "pendiente", "vencido", "proximo", "pagado"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltroPagos(f)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition capitalize ${
                        filtroPagos === f ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f === "todos" ? "Todas" : f === "proximo" ? "Por vencer" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {ordenesFiltradasVista.map((orden) => {
                  const estado = getEstado(orden);
                  const badge = estadoBadge[estado];
                  const saldo = saldoPendiente(orden);
                  const pctPagado = Math.min((orden.pagado / orden.total) * 100, 100);
                  const seleccionada = ordenSeleccionada?.id === orden.id;

                  return (
                    <div
                      key={orden.id}
                      onClick={() => handleSeleccionarOrden(orden)}
                      className={`p-4 cursor-pointer transition-all ${
                        estado === "pagado" ? "opacity-60 cursor-default" : "hover:bg-slate-50"
                      } ${seleccionada ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-sm font-bold text-slate-700">{orden.id}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                            {seleccionada && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Seleccionada</span>}
                          </div>
                          <p className="text-sm text-slate-600 truncate">{orden.proveedor}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Vence: {orden.vencimiento}</p>
                          {/* Barra de progreso */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Pagado: ${orden.pagado.toFixed(2)}</span>
                              <span>Total: ${orden.total.toFixed(2)}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pctPagado}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-sm ${saldo > 0 ? "text-red-600" : "text-green-600"}`}>
                            ${saldo.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">por pagar</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historial de pagos */}
            {pagos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-4">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Historial de Pagos ({pagos.length})</h2>
                </div>
                <div className="divide-y divide-slate-50">
                  {pagos.map((pago) => (
                    <div key={pago.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{pago.ordenId} · {pago.proveedor}</p>
                        <p className="text-xs text-slate-400">Ref: {pago.referencia} · {metodosPago.find((m) => m.id === pago.metodo)?.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">${pago.monto.toFixed(2)}</p>
                        <p className="text-xs text-slate-400">{pago.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-6">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Registrar Pago</h2>
                {ordenSeleccionada && (
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium">{ordenSeleccionada.id} · Saldo: ${saldoPendiente(ordenSeleccionada).toFixed(2)}</p>
                )}
              </div>

              {!ordenSeleccionada ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-sm font-medium">Selecciona una orden para registrar el pago</p>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Monto */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Monto a pagar (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={saldoPendiente(ordenSeleccionada)}
                        value={formulario.monto}
                        onChange={(e) => handleCambio("monto", e.target.value)}
                        className={`w-full pl-7 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errores.monto ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                      />
                    </div>
                    {errores.monto && <p className="text-xs text-red-500 mt-1">{errores.monto}</p>}
                    <button
                      onClick={() => handleCambio("monto", saldoPendiente(ordenSeleccionada).toFixed(2))}
                      className="text-xs text-emerald-600 hover:text-emerald-700 mt-1 font-medium"
                    >
                      Pagar total pendiente (${saldoPendiente(ordenSeleccionada).toFixed(2)})
                    </button>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Método de Pago *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {metodosPago.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleCambio("metodo", m.id)}
                          className={`p-2.5 rounded-xl border-2 text-left transition text-xs font-medium ${
                            formulario.metodo === m.id
                              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-base mr-1">{m.icon}</span> {m.label}
                        </button>
                      ))}
                    </div>
                    {errores.metodo && <p className="text-xs text-red-500 mt-1">{errores.metodo}</p>}
                  </div>

                  {/* Banco (condicional) */}
                  {(formulario.metodo === "transferencia" || formulario.metodo === "pse") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Banco *</label>
                      <select
                        value={formulario.banco}
                        onChange={(e) => handleCambio("banco", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${errores.banco ? "border-red-400" : "border-slate-200"}`}
                      >
                        <option value="">Seleccionar banco...</option>
                        {getBancos().map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      {errores.banco && <p className="text-xs text-red-500 mt-1">{errores.banco}</p>}
                    </div>
                  )}

                  {/* Número de cheque (condicional) */}
                  {formulario.metodo === "cheque" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">N° de Cheque *</label>
                      <input
                        type="text"
                        value={formulario.numeroCheque}
                        onChange={(e) => handleCambio("numeroCheque", e.target.value)}
                        placeholder="Ej: CHQ-001234"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errores.numeroCheque ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                      />
                      {errores.numeroCheque && <p className="text-xs text-red-500 mt-1">{errores.numeroCheque}</p>}
                    </div>
                  )}

                  {/* Referencia */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">N° de Referencia / Comprobante *</label>
                    <input
                      type="text"
                      value={formulario.referencia}
                      onChange={(e) => handleCambio("referencia", e.target.value)}
                      placeholder="Ej: TRF-20241201-001"
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errores.referencia ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                    />
                    {errores.referencia && <p className="text-xs text-red-500 mt-1">{errores.referencia}</p>}
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha del Pago *</label>
                    <input
                      type="date"
                      value={formulario.fecha}
                      onChange={(e) => handleCambio("fecha", e.target.value)}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errores.fecha ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errores.fecha && <p className="text-xs text-red-500 mt-1">{errores.fecha}</p>}
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas (opcional)</label>
                    <textarea
                      value={formulario.notas}
                      onChange={(e) => handleCambio("notas", e.target.value)}
                      rows={2}
                      placeholder="Observaciones del pago..."
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setOrdenSeleccionada(null)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={registrarPago}
                      className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
                    >
                      Registrar Pago
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
