import { useState } from "react";
import {
  Users, Plus, Search, MoreVertical, Edit2, Trash2, UserCheck,
  UserX, X, ChevronLeft, ChevronRight, Shield, AlertCircle, Check
} from "lucide-react";

const INITIAL_USERS = [
  { id: 1, nombre: "Ana García", email: "ana.garcia@empresa.com", rol: "Administrador", estado: true, avatar: "AG", fecha: "12 ene 2026" },
  { id: 2, nombre: "Carlos López", email: "carlos.lopez@empresa.com", rol: "Editor", estado: true, avatar: "CL", fecha: "28 feb 2026" },
  { id: 3, nombre: "María Rodríguez", email: "maria.rodriguez@empresa.com", rol: "Visor", estado: false, avatar: "MR", fecha: "05 mar 2026" },
  { id: 4, nombre: "Pedro Martínez", email: "pedro.martinez@empresa.com", rol: "Editor", estado: true, avatar: "PM", fecha: "17 abr 2026" },
  { id: 5, nombre: "Lucía Fernández", email: "lucia.fernandez@empresa.com", rol: "Visor", estado: true, avatar: "LF", fecha: "02 may 2026" },
];

const ROLES = ["Administrador", "Editor", "Visor"];
const AVATARS_BG = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-rose-500", "bg-teal-500"];

const emptyForm = { nombre: "", email: "", rol: "Visor", estado: true };

export default function GestionUsuarios() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [modal, setModal] = useState(null); // null | "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRol = filterRol === "Todos" || u.rol === filterRol;
    return matchSearch && matchRol;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openCreate = () => { setForm(emptyForm); setFormError(""); setModal("create"); };
  const openEdit = (u) => { setSelected(u); setForm({ nombre: u.nombre, email: u.email, rol: u.rol, estado: u.estado }); setFormError(""); setModal("edit"); setMenuOpen(null); };
  const openDelete = (u) => { setSelected(u); setModal("delete"); setMenuOpen(null); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const validateForm = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!form.email.includes("@")) return "Ingresa un correo válido.";
    return "";
  };

  const handleCreate = () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    const newUser = {
      id: Date.now(), nombre: form.nombre, email: form.email,
      rol: form.rol, estado: form.estado,
      avatar: form.nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      fecha: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setUsers([newUser, ...users]);
    closeModal();
  };

  const handleEdit = () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setUsers(users.map((u) => u.id === selected.id ? { ...u, ...form } : u));
    closeModal();
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selected.id));
    closeModal();
  };

  const toggleEstado = (id) => {
    setUsers(users.map((u) => u.id === id ? { ...u, estado: !u.estado } : u));
    setMenuOpen(null);
  };

  const bgIdx = (name) => Math.abs(name.charCodeAt(0) + name.charCodeAt(1)) % AVATARS_BG.length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-blue-600 w-5 h-5" />
              <span className="text-blue-600 text-sm font-medium">AdminSuite</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
            <p className="text-slate-500 text-sm mt-0.5">{users.length} usuarios registrados</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Nuevo usuario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRol}
            onChange={(e) => { setFilterRol(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option>Todos</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-slate-500 font-medium px-5 py-3.5">Usuario</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3.5">Rol</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3.5">Estado</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3.5">Creado</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-400 py-12">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  paginated.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATARS_BG[bgIdx(u.nombre)]}`}>
                            {u.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{u.nombre}</p>
                            <p className="text-slate-400 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          u.rol === "Administrador" ? "bg-blue-50 text-blue-700"
                          : u.rol === "Editor" ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-medium ${
                          u.estado ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.estado ? "bg-green-500" : "bg-red-400"}`} />
                          {u.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{u.fecha}</td>
                      <td className="px-5 py-4 relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {menuOpen === u.id && (
                          <div className="absolute right-4 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-10 w-44 overflow-hidden">
                            <button onClick={() => openEdit(u)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                              <Edit2 className="w-4 h-4 text-slate-400" /> Editar
                            </button>
                            <button onClick={() => toggleEstado(u.id)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                              {u.estado ? <UserX className="w-4 h-4 text-orange-400" /> : <UserCheck className="w-4 h-4 text-green-500" />}
                              {u.estado ? "Desactivar" : "Activar"}
                            </button>
                            <button onClick={() => openDelete(u)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">
              {filtered.length === 0 ? "0" : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)}`} de {filtered.length} usuarios
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">{modal === "create" ? "Nuevo usuario" : "Editar usuario"}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
                <input
                  value={form.nombre}
                  onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setFormError(""); }}
                  placeholder="Ej. Juan Pérez"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormError(""); }}
                  placeholder="correo@empresa.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, estado: !form.estado })}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${form.estado ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.estado ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm text-slate-700">Usuario activo</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button
                onClick={modal === "create" ? handleCreate : handleEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> {modal === "create" ? "Crear usuario" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {modal === "delete" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="text-red-500 w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Eliminar usuario</h3>
            <p className="text-slate-500 text-sm mb-6">
              ¿Estás seguro de eliminar a <strong>{selected?.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-sm font-semibold">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen && <div className="fixed inset-0 z-[5]" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
