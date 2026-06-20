import { useState } from "react";
import { Shield, Plus, Edit2, Trash2, X, Check, AlertCircle, ChevronDown, ChevronUp, Lock } from "lucide-react";

const PERMISOS_CATALOG = {
  "Usuarios": ["Ver usuarios", "Crear usuarios", "Editar usuarios", "Eliminar usuarios"],
  "Roles": ["Ver roles", "Crear roles", "Editar roles", "Eliminar roles"],
  "Reportes": ["Ver reportes", "Exportar reportes"],
  "Configuración": ["Ver configuración", "Editar configuración"],
  "Auditoría": ["Ver auditoría"],
};

const INITIAL_ROLES = [
  {
    id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema",
    color: "blue", protegido: true, usuarios: 3,
    permisos: Object.values(PERMISOS_CATALOG).flat(),
  },
  {
    id: 2, nombre: "Editor", descripcion: "Puede crear y editar contenido",
    color: "purple", protegido: false, usuarios: 5,
    permisos: ["Ver usuarios", "Ver roles", "Ver reportes", "Exportar reportes"],
  },
  {
    id: 3, nombre: "Visor", descripcion: "Solo lectura en el sistema",
    color: "emerald", protegido: false, usuarios: 8,
    permisos: ["Ver usuarios", "Ver reportes"],
  },
];

const COLORS = ["blue", "purple", "emerald", "orange", "rose", "teal"];
const COLOR_STYLES = {
  blue: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: "text-blue-500" },
  purple: { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500", icon: "text-purple-500" },
  emerald: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: "text-emerald-500" },
  orange: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500", icon: "text-orange-500" },
  rose: { badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", icon: "text-rose-500" },
  teal: { badge: "bg-teal-50 text-teal-700 border-teal-200", dot: "bg-teal-500", icon: "text-teal-500" },
};

const emptyForm = { nombre: "", descripcion: "", color: "blue", permisos: [] };

export default function GestionRoles() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [expandedModal, setExpandedModal] = useState({});

  const openCreate = () => { setForm(emptyForm); setFormError(""); setModal("create"); setExpandedModal({}); };
  const openEdit = (r) => {
    setSelected(r);
    setForm({ nombre: r.nombre, descripcion: r.descripcion, color: r.color, permisos: [...r.permisos] });
    setFormError(""); setModal("edit"); setExpandedModal({});
  };
  const openDelete = (r) => { setSelected(r); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const toggleExpanded = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const toggleExpandedModal = (cat) => setExpandedModal((p) => ({ ...p, [cat]: !p[cat] }));

  const togglePermiso = (permiso) => {
    setForm((f) => ({
      ...f,
      permisos: f.permisos.includes(permiso)
        ? f.permisos.filter((p) => p !== permiso)
        : [...f.permisos, permiso],
    }));
  };

  const toggleCategoria = (cat) => {
    const catPermisos = PERMISOS_CATALOG[cat];
    const allSelected = catPermisos.every((p) => form.permisos.includes(p));
    setForm((f) => ({
      ...f,
      permisos: allSelected
        ? f.permisos.filter((p) => !catPermisos.includes(p))
        : [...new Set([...f.permisos, ...catPermisos])],
    }));
  };

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre del rol es obligatorio.";
    if (form.permisos.length === 0) return "Asigna al menos un permiso al rol.";
    return "";
  };

  const handleCreate = () => {
    const err = validate(); if (err) { setFormError(err); return; }
    setRoles([...roles, { id: Date.now(), ...form, protegido: false, usuarios: 0 }]);
    closeModal();
  };

  const handleEdit = () => {
    const err = validate(); if (err) { setFormError(err); return; }
    setRoles(roles.map((r) => r.id === selected.id ? { ...r, ...form } : r));
    closeModal();
  };

  const handleDelete = () => {
    setRoles(roles.filter((r) => r.id !== selected.id));
    closeModal();
  };

  const allPermsCount = Object.values(PERMISOS_CATALOG).flat().length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-blue-600 w-5 h-5" />
              <span className="text-blue-600 text-sm font-medium">AdminSuite</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Roles</h1>
            <p className="text-slate-500 text-sm mt-0.5">Configura permisos y niveles de acceso</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Nuevo rol
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Roles activos", value: roles.length },
            { label: "Permisos disponibles", value: allPermsCount },
            { label: "Usuarios asignados", value: roles.reduce((a, r) => a + r.usuarios, 0) },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Roles list */}
        <div className="space-y-3">
          {roles.map((r) => {
            const cs = COLOR_STYLES[r.color] || COLOR_STYLES.blue;
            const isExp = expanded[r.id];
            const permisosPorCat = Object.entries(PERMISOS_CATALOG).map(([cat, perms]) => ({
              cat, activos: perms.filter((p) => r.permisos.includes(p)),
            })).filter((e) => e.activos.length > 0);

            return (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cs.badge} border`}>
                      <Shield className={`w-5 h-5 ${cs.icon}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{r.nombre}</h3>
                        {r.protegido && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Lock className="w-3 h-3" /> protegido
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{r.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{r.usuarios} usuarios</span>
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${cs.badge}`}>
                      {r.permisos.length} permisos
                    </span>
                    {!r.protegido && (
                      <>
                        <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDelete(r)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleExpanded(r.id)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                      {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Permisos asignados</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {permisosPorCat.map(({ cat, activos }) => (
                        <div key={cat}>
                          <p className="text-xs font-semibold text-slate-600 mb-1.5">{cat}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {activos.map((p) => (
                              <span key={p} className={`text-xs px-2.5 py-1 rounded-lg border ${cs.badge}`}>{p}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Create/Edit */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-semibold text-slate-800">{modal === "create" ? "Nuevo rol" : "Editar rol"}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del rol</label>
                <input
                  value={form.nombre}
                  onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setFormError(""); }}
                  placeholder="Ej. Supervisor"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
                <input
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Describe el propósito del rol"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Color del rol</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full transition-all ${COLOR_STYLES[c].dot} ${form.color === c ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "opacity-60 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">Permisos</label>
                  <span className="text-xs text-slate-400">{form.permisos.length} de {allPermsCount} seleccionados</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {Object.entries(PERMISOS_CATALOG).map(([cat, perms], idx) => {
                    const allSel = perms.every((p) => form.permisos.includes(p));
                    const someSel = perms.some((p) => form.permisos.includes(p));
                    const isOpen = expandedModal[cat];
                    return (
                      <div key={cat} className={idx > 0 ? "border-t border-slate-100" : ""}>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer" onClick={() => toggleExpandedModal(cat)}>
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleCategoria(cat); }}
                            className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition ${
                              allSel ? "bg-blue-600 border-blue-600" : someSel ? "bg-blue-200 border-blue-400" : "border-slate-300 bg-white"
                            }`}
                          >
                            {(allSel || someSel) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium text-slate-700 flex-1">{cat}</span>
                          <span className="text-xs text-slate-400">{perms.filter(p => form.permisos.includes(p)).length}/{perms.length}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                        {isOpen && (
                          <div className="px-4 py-2 space-y-1.5 bg-white">
                            {perms.map((p) => (
                              <label key={p} className="flex items-center gap-3 cursor-pointer py-1">
                                <div
                                  onClick={() => togglePermiso(p)}
                                  className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition ${
                                    form.permisos.includes(p) ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {form.permisos.includes(p) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm text-slate-600">{p}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6 pt-2 flex-shrink-0 border-t border-slate-100">
              <button onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button
                onClick={modal === "create" ? handleCreate : handleEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> {modal === "create" ? "Crear rol" : "Guardar cambios"}
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
            <h3 className="font-semibold text-slate-800 mb-2">Eliminar rol</h3>
            <p className="text-slate-500 text-sm mb-2">
              ¿Eliminar el rol <strong>{selected?.nombre}</strong>?
            </p>
            {selected?.usuarios > 0 && (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {selected.usuarios} usuarios tienen este rol asignado.
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-sm font-semibold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
