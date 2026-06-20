import React, { useState } from "react";

/**
 * HU 13 - Crear Ticket
 * Permite al usuario crear un nuevo ticket de soporte indicando
 * asunto, categoría, prioridad y descripción del problema.
 *
 * Props:
 * - onCreate(ticket): callback que recibe el ticket creado (opcional)
 */
export default function CrearTicket({ onCreate }) {
  const [form, setForm] = useState({
    asunto: "",
    categoria: "Producto",
    prioridad: "Media",
    descripcion: "",
  });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const categorias = ["Producto", "Pedido", "Pago", "Envío", "Otro"];
  const prioridades = [
    { valor: "Baja", color: "bg-emerald-100 text-emerald-700" },
    { valor: "Media", color: "bg-amber-100 text-amber-700" },
    { valor: "Alta", color: "bg-red-100 text-red-700" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: null }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.asunto.trim()) nuevosErrores.asunto = "El asunto es obligatorio.";
    if (form.asunto.length > 80) nuevosErrores.asunto = "Máximo 80 caracteres.";
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = "Describe el problema con al menos 10 caracteres.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...form,
      estado: "Abierto",
      creadoEn: new Date().toISOString(),
    };

    if (onCreate) onCreate(ticket);

    setEnviado(true);
    setForm({ asunto: "", categoria: "Producto", prioridad: "Media", descripcion: "" });

    setTimeout(() => setEnviado(false), 3500);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="mb-6">
        <span className="inline-block text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Soporte al cliente
        </span>
        <h2 className="mt-3 text-2xl font-bold text-slate-800">Crear ticket</h2>
        <p className="text-sm text-slate-500 mt-1">
          Cuéntanos qué pasó. Te responderemos lo antes posible.
        </p>
      </div>

      {enviado && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="font-medium">¡Ticket creado!</span>
          <span>Recibirás una notificación cuando alguien lo responda.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Asunto */}
        <div>
          <label htmlFor="asunto" className="block text-sm font-medium text-slate-700 mb-1.5">
            Asunto
          </label>
          <input
            id="asunto"
            name="asunto"
            type="text"
            value={form.asunto}
            onChange={handleChange}
            placeholder="Ej: Mi pedido llegó incompleto"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-indigo-500/40 ${
              errores.asunto ? "border-red-400" : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          {errores.asunto && <p className="mt-1 text-xs text-red-600">{errores.asunto}</p>}
        </div>

        {/* Categoría + Prioridad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1.5">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Prioridad</span>
            <div className="flex gap-2">
              {prioridades.map((p) => (
                <button
                  type="button"
                  key={p.valor}
                  onClick={() => setForm((prev) => ({ ...prev, prioridad: p.valor }))}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                    form.prioridad === p.valor
                      ? p.color + " ring-2 ring-offset-1 ring-indigo-400"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {p.valor}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1.5">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={5}
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe el problema con el mayor detalle posible..."
            className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-indigo-500/40 ${
              errores.descripcion ? "border-red-400" : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errores.descripcion ? (
              <p className="text-xs text-red-600">{errores.descripcion}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-400">{form.descripcion.length}/500</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
        >
          Crear ticket
        </button>
      </form>
    </div>
  );
}
