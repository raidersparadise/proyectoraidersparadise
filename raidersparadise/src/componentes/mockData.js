// mockData.js
// Datos de ejemplo compartidos por los componentes de catálogo de accesorios de lujo para motos.
// En producción, esto vendría de tu API / base de datos.

export const CATEGORIAS = [
  "Cascos",
  "Chaquetas de cuero",
  "Guantes",
  "Escapes",
  "Espejos",
  "Asientos",
  "Iluminación",
  "Accesorios de cromo",
];

export const MARCAS = [
  "Arai",
  "Akrapovič",
  "Rizoma",
  "Termignoni",
  "Belstaff",
  "Shoei",
  "Öhlins",
];

export const PRODUCTOS_INICIALES = [
  {
    id: "p-1001",
    sku: "HEL-ARA-GLD",
    nombre: "Casco Arai RX-7V Oro Imperial",
    categoria: "Cascos",
    marca: "Arai",
    precio: 2450.0,
    stock: 6,
    stockMinimo: 3,
    descripcion:
      "Edición limitada en fibra de carbono con acabado bañado en oro de 24k.",
    imagen:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    activo: true,
  },
  {
    id: "p-1002",
    sku: "EXH-AKR-TIT",
    nombre: "Escape Akrapovič Titanio Evolution",
    categoria: "Escapes",
    marca: "Akrapovič",
    precio: 3890.0,
    stock: 2,
    stockMinimo: 4,
    descripcion: "Sistema completo de titanio forjado, sonido grave profundo.",
    imagen:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80",
    activo: true,
  },
  {
    id: "p-1003",
    sku: "GLV-BEL-BLK",
    nombre: "Guantes Belstaff Piel Negra",
    categoria: "Guantes",
    marca: "Belstaff",
    precio: 420.0,
    stock: 18,
    stockMinimo: 5,
    descripcion: "Piel de cabra curtida a mano con forro térmico.",
    imagen:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
    activo: true,
  },
  {
    id: "p-1004",
    sku: "MIR-RIZ-CRM",
    nombre: "Espejos Rizoma Cromo Aerodinámicos",
    categoria: "Espejos",
    marca: "Rizoma",
    precio: 680.0,
    stock: 0,
    stockMinimo: 6,
    descripcion: "Aluminio mecanizado en CNC con acabado cromado espejo.",
    imagen:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80",
    activo: false,
  },
];

export function generarSKU(categoria, marca) {
  const catCode = (categoria || "GEN").slice(0, 3).toUpperCase();
  const marcaCode = (marca || "XXX").slice(0, 3).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${catCode}-${marcaCode}-${rand}`;
}

export function formatoMoneda(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(valor || 0);
}
