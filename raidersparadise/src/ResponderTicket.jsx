import React, { useState } from "react";

/**
 * HU 14 - Responder Ticket
 * Muestra el detalle de un ticket y un hilo de mensajes,
 * permitiendo a un agente (o al cliente) responder y cambiar el estado.
 *
 * Props:
 * - ticket: objeto ticket { id, asunto, categoria, prioridad, descripcion, estado, creadoEn }
 * - mensajesIniciales: array opcional de mensajes previos
 * - onResponder(mensaje, ticketActualizado): callback al enviar respuesta
 */
const ESTADOS = ["Abierto", "En proceso", "Resuelto", "Cerrado"];

const estadoEstilos = {
  Abierto: "bg-blue-100 text-blue-700",
  "En proceso": "bg-amber-100 text-amber-700",
  Resuelto: "bg-emerald-100 text-emerald-700",
  Cerrado: "bg-slate-200 text-slate-600",
};

const prioridadEstilos = {
  Baja: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Media: "bg-amber-50 text-amber-700 border-amber-200",
  Alta: "bg-red-50 text-red-700 border-red-200",
};

const ticketPorDefecto = {
  id: "TCK-1042",
  asunto: "Mi pedido llegó incompleto",
  categoria: "Pedido",
  prioridad: "Alta",
  descripcion:
    "Compré 3 unidades del producto y solo llegaron 2. Adjunto la guía de envío como referencia.",
  estado: "Abierto",
  creadoEn: new Date().toISOString(),
  cliente: "Laura Gómez",
};

export default function ResponderTicket({
  ticket = ticketPorDefecto,
  mensajesIniciales = [],
  onResponder,
}) {
  const [mensajes, setMensajes] = useState(
    mensajesIniciales.length
      ? mensajesIniciales
      : [
          {
            autor: ticket.cliente || "Cliente",
            rol: "cliente",
            texto: ticket.descripcion,
            fecha: ticket.creadoEn,
          },
        ]
  );
  const [respuesta, setRespuesta] = useState("");
  const [estado, setEstado] = useState(ticket.estado);
  const [error, setError] = useState("");

  const formatearFecha = (iso) =>
    new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!respuesta.trim()) {
      setError("Escribe una respuesta antes de enviar.");
      return;
    }

    const nuevoMensaje = {
      autor: "Agente de soporte",
      rol: "agente",
      texto: respuesta.trim(),
      fecha: new Date().toISOString(),
    };

    const nuevosMensajes = [...mensajes, nuevoMensaje];
    setMensajes(nuevosMensajes);
    setRespuesta("");
    setError("");

    if (onResponder) {
      onResponder(nuevoMensaje, { ...ticket, estado, mensajes: nuevosMensajes });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Encabezado */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-slate-400">{ticket.id}</p>
            <h2 className="text-xl font-bold text-slate-800 mt-0.5">{ticket.asunto}</h2>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${estadoEstilos[estado]}`}>
            {estado}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {ticket.categoria}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${prioridadEstilos[ticket.prioridad]}`}
          >
            Prioridad {ticket.prioridad}
          </span>
          {ticket.cliente && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {ticket.cliente}
            </span>
          )}
        </div>
      </div>

      {/* Hilo de mensajes */}
      <div className="p-6 space-y-4 max-h-80 overflow-y-auto bg-slate-50/60">
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.rol === "agente" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.rol === "agente"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.texto}</p>
              <p
                className={`text-[11px] mt-1 ${
                  m.rol === "agente" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                {m.autor} · {formatearFecha(m.fecha)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cambiar estado + responder */}
      <div className="p-6 border-t border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            Estado del ticket
          </label>
          <div className="flex gap-2 flex-wrap">
            {ESTADOS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEstado(e)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  estado === e
                    ? estadoEstilos[e] + " ring-2 ring-offset-1 ring-indigo-400"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleEnviar} className="space-y-2">
          <textarea
            rows={3}
            value={respuesta}
            onChange={(e) => {
              setRespuesta(e.target.value);
              setError("");
            }}
            placeholder="Escribe tu respuesta al cliente..."
            className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-indigo-500/40 ${
              error ? "border-red-400" : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              Enviar respuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
