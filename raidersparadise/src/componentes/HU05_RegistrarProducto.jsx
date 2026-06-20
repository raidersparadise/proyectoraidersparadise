import React, { useState } from "react";
import { CATEGORIAS, MARCAS, generarSKU } from "./mockData";

/**
 * HU 05 — Registrar producto
 * Formulario tipo "ficha técnica" para dar de alta un nuevo accesorio de lujo
 * en el catálogo. Genera automáticamente un SKU (código de chasis) a partir
 * de la categoría y la marca, y valida los campos obligatorios antes de
 * permitir el registro.
 *
 * Props:
 * - onRegistrar(producto): callback que recibe el producto ya armado.
 */
export default function HU05_RegistrarProducto({ onRegistrar }) {
  const estadoInicial = {
    nombre: "",
    categoria: "",
    marca: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    descripcion: "",
    imagen: "",
  };

  const [form, setForm] = useState(estadoInicial);
  const [sku, setSku] = useState("");
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState(null);

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => {
      const nuevo = { ...prev, [campo]: valor };
      if (campo === "categoria" || campo === "marca") {
        setSku(generarSKU(nuevo.categoria, nuevo.marca));
      }
      return nuevo;
    });
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: null }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "Escribe el nombre del producto.";
    if (!form.categoria) nuevosErrores.categoria = "Selecciona una categoría.";
    if (!form.marca) nuevosErrores.marca = "Selecciona una marca.";
    if (!form.precio || Number(form.precio) <= 0)
      nuevosErrores.precio = "Ingresa un precio mayor a 0.";
    if (form.stock === "" || Number(form.stock) < 0)
      nuevosErrores.stock = "Ingresa una cantidad inicial válida.";
    if (form.stockMinimo === "" || Number(form.stockMinimo) < 0)
      nuevosErrores.stockMinimo = "Ingresa un mínimo de stock válido.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!validar()) {
      setConfirmacion(null);
      return;
    }

    const skuFinal = sku || generarSKU(form.categoria, form.marca);
    const nuevoProducto = {
      id: `p-${Date.now()}`,
      sku: skuFinal,
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      marca: form.marca,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo),
      descripcion: form.descripcion.trim(),
      imagen: form.imagen.trim(),
      activo: true,
    };

    if (onRegistrar) onRegistrar(nuevoProducto);

    setConfirmacion(skuFinal);
    setForm(estadoInicial);
    setSku("");
  };

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EDEAE3] px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado tipo placa de chasis */}
        <div className="border border-[#2A2A2D] mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2D]">
            <div>
              <p className="text-[11px] tracking-[0.3em] text-[#C9A24B] uppercase font-medium">
                Catálogo · Alta de producto
              </p>
              <h1
                className="text-3xl uppercase tracking-wide mt-1"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Registrar accesorio
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] tracking-[0.25em] text-[#8A877E] uppercase">
                Código de chasis
              </p>
              <p
                className="text-xl text-[#C9A24B] mt-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {sku || "—— · ——— · ———"}
              </p>
            </div>
          </div>
        </div>

        {confirmacion && (
          <div className="mb-6 border border-[#C9A24B]/40 bg-[#C9A24B]/5 px-5 py-4 flex items-start gap-3">
            <span className="text-[#C9A24B] mt-0.5">✓</span>
            <div>
              <p className="text-sm text-[#EDEAE3]">
                Producto registrado correctamente.
              </p>
              <p
                className="text-xs text-[#8A877E] mt-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                SKU asignado: {confirmacion}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={manejarSubmit} className="space-y-6">
          {/* Datos principales */}
          <fieldset className="border border-[#2A2A2D] p-6">
            <legend className="text-[11px] tracking-[0.25em] uppercase text-[#8A877E] px-2 -ml-2">
              Identificación
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                  placeholder="Ej. Casco Arai RX-7V Oro Imperial"
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

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Categoría
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) => actualizarCampo("categoria", e.target.value)}
                  className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errores.categoria
                      ? "border-[#B5482A] focus:ring-[#B5482A]"
                      : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errores.categoria && (
                  <p className="text-xs text-[#B5482A] mt-1.5">{errores.categoria}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Marca
                </label>
                <select
                  value={form.marca}
                  onChange={(e) => actualizarCampo("marca", e.target.value)}
                  className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errores.marca
                      ? "border-[#B5482A] focus:ring-[#B5482A]"
                      : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  }`}
                >
                  <option value="">Selecciona una marca</option>
                  {MARCAS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {errores.marca && (
                  <p className="text-xs text-[#B5482A] mt-1.5">{errores.marca}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Precio e inventario */}
          <fieldset className="border border-[#2A2A2D] p-6">
            <legend className="text-[11px] tracking-[0.25em] uppercase text-[#8A877E] px-2 -ml-2">
              Precio e inventario inicial
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Precio (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => actualizarCampo("precio", e.target.value)}
                  placeholder="0.00"
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
                  Stock inicial
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => actualizarCampo("stock", e.target.value)}
                  placeholder="0"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errores.stock
                      ? "border-[#B5482A] focus:ring-[#B5482A]"
                      : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  }`}
                />
                {errores.stock && (
                  <p className="text-xs text-[#B5482A] mt-1.5">{errores.stock}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Stock mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stockMinimo}
                  onChange={(e) => actualizarCampo("stockMinimo", e.target.value)}
                  placeholder="0"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`w-full bg-[#161618] border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                    errores.stockMinimo
                      ? "border-[#B5482A] focus:ring-[#B5482A]"
                      : "border-[#2A2A2D] focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                  }`}
                />
                {errores.stockMinimo && (
                  <p className="text-xs text-[#B5482A] mt-1.5">{errores.stockMinimo}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Detalle */}
          <fieldset className="border border-[#2A2A2D] p-6">
            <legend className="text-[11px] tracking-[0.25em] uppercase text-[#8A877E] px-2 -ml-2">
              Detalle
            </legend>

            <div className="grid grid-cols-1 gap-5 mt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                  rows={3}
                  placeholder="Materiales, acabados, edición, detalles que justifiquen el precio premium."
                  className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A877E] mb-2">
                  URL de imagen (opcional)
                </label>
                <input
                  type="text"
                  value={form.imagen}
                  onChange={(e) => actualizarCampo("imagen", e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#161618] border border-[#2A2A2D] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#8A877E]">
              Todos los campos marcados son obligatorios.
            </p>
            <button
              type="submit"
              className="bg-[#C9A24B] text-[#0C0C0D] px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-[#dab464] transition-colors"
            >
              Registrar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
