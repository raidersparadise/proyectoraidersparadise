import React, { useState } from "react";

/**
 * HU 15 - Calificar Producto
 * Permite calificar un producto con estrellas, dejar un comentario
 * y opcionalmente subir una recomendación de compra.
 *
 * Props:
 * - producto: { nombre, imagenUrl } (opcional)
 * - onCalificar(calificacion): callback con { estrellas, comentario, recomienda }
 */
export default function CalificarProducto({
  producto = { nombre: "Audífonos inalámbricos X200", imagenUrl: "" },
  onCalificar,
}) {
  const [estrellas, setEstrellas] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [recomienda, setRecomienda] = useState(null);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const etiquetas = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (estrellas === 0) {
      setError("Selecciona una calificación en estrellas.");
      return;
    }

    const resultado = {
      producto: producto.nombre,
      estrellas,
      comentario: comentario.trim(),
      recomienda,
      fecha: new Date().toISOString(),
    };

    if (onCalificar) onCalificar(resultado);

    setEnviado(true);
    setError("");
  };

  const reiniciar = () => {
    setEstrellas(0);
    setComentario("");
    setRecomienda(null);
    setEnviado(false);
  };

  if (enviado) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl mb-4">
          ✓
        </div>
        <h3 className="text-lg font-bold text-slate-800">¡Gracias por tu calificación!</h3>
        <p className="text-sm text-slate-500 mt-1.5">
          Tu opinión ayuda a otros compradores a decidir mejor.
        </p>
        <button
          onClick={reiniciar}
          className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Calificar otro producto
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="mb-6">
        <span className="inline-block text-xs font-semibold tracking-wide text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Tu opinión cuenta
        </span>
        <h2 className="mt-3 text-xl font-bold text-slate-800">{producto.nombre}</h2>
        <p className="text-sm text-slate-500 mt-1">¿Qué te pareció este producto?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Estrellas */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setEstrellas(n);
                  setError("");
                }}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                className="text-3xl leading-none transition-transform hover:scale-110"
              >
                <span
                  className={
                    n <= (hover || estrellas) ? "text-amber-400" : "text-slate-200"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500 h-5">
            {(hover || estrellas) > 0 ? etiquetas[(hover || estrellas) - 1] : ""}
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {/* Recomendación */}
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-2">
            ¿Recomendarías este producto?
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRecomienda(true)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                recomienda === true
                  ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              Sí, la recomiendo
            </button>
            <button
              type="button"
              onClick={() => setRecomienda(false)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                recomienda === false
                  ? "bg-red-100 text-red-700 ring-2 ring-red-400"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              No la recomiendo
            </button>
          </div>
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-slate-700 mb-1.5">
            Comentario (opcional)
          </label>
          <textarea
            id="comentario"
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Cuéntanos qué te gustó o qué se podría mejorar..."
            className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.99]"
        >
          Enviar calificación
        </button>
      </form>
    </div>
  );
}
