import React, { useState } from "react";
import CrearTicket from "./CrearTicket";
import ResponderTicket from "./ResponderTicket";
import CalificarProducto from "./CalificarProducto";

/**
 * HU 16 - Unir todos los módulos
 * Componente raíz que integra CrearTicket, ResponderTicket y
 * CalificarProducto en un solo flujo, con navegación por pestañas
 * y una lista de tickets creados en memoria.
 */
const TABS = [
  { id: "crear", label: "Crear ticket" },
  { id: "responder", label: "Tickets" },
  { id: "calificar", label: "Calificar producto" },
];

export default function App() {
  const [tabActiva, setTabActiva] = useState("crear");
  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  const handleCrearTicket = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const handleResponder = (mensaje, ticketActualizado) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketActualizado.id ? { ...t, ...ticketActualizado } : t))
    );
  };

  const handleCalificar = (resultado) => {
    console.log("Producto calificado:", resultado);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Centro de soporte</h1>
            <p className="text-xs text-slate-400">Tickets y calificaciones de producto</p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} creado{tickets.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Navegación por pestañas */}
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTabActiva(tab.id);
                if (tab.id !== "responder") setTicketSeleccionado(null);
              }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                tabActiva === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {tabActiva === "crear" && (
          <CrearTicket
            onCreate={(ticket) => {
              handleCrearTicket(ticket);
              setTabActiva("responder");
              setTicketSeleccionado(ticket);
            }}
          />
        )}

        {tabActiva === "responder" && (
          <div>
            {tickets.length === 0 ? (
              <div className="max-w-xl mx-auto text-center py-16">
                <p className="text-slate-500 text-sm">
                  Aún no hay tickets. Crea uno desde la pestaña{" "}
                  <span className="font-semibold text-indigo-600">Crear ticket</span>.
                </p>
              </div>
            ) : !ticketSeleccionado ? (
              <div className="max-w-xl mx-auto space-y-3">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTicketSeleccionado(t)}
                    className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 text-sm">{t.asunto}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {t.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.id} · {t.categoria} · Prioridad {t.prioridad}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setTicketSeleccionado(null)}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  ← Volver a la lista
                </button>
                <ResponderTicket ticket={ticketSeleccionado} onResponder={handleResponder} />
              </div>
            )}
          </div>
        )}

        {tabActiva === "calificar" && <CalificarProducto onCalificar={handleCalificar} />}
      </main>
    </div>
  );
}
