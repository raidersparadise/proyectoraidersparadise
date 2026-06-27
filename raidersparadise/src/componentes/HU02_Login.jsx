import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Shield, AlertCircle, Loader2 } from "lucide-react";


export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
  if (!form.email || !form.password) {
    setError("Completa todos los campos para continuar.");
    return;
  }

  setLoading(true);

  await new Promise((r) => setTimeout(r, 1000));

  const success = login(form.email, form.password);

  setLoading(false);

  if (success) {
    alert("Bienvenido al sistema");
    setError("");
  } else {
    setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
  }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #1d4ed8 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AdminSuite</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Gestiona tu plataforma con total control
          </h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Accede a la administración de usuarios, roles y permisos desde un solo lugar, seguro y eficiente.
          </p>
          <div className="mt-10 flex gap-4">
            {["Usuarios activos", "Roles configurados", "Accesos hoy"].map((label, i) => (
              <div key={i} className="bg-white/10 rounded-2xl px-4 py-3 flex-1 text-center">
                <p className="text-white font-bold text-xl">{["1.2k", "18", "342"][i]}</p>
                <p className="text-blue-200 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-sm">© 2026 AdminSuite. Todos los derechos reservados.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="text-blue-600 w-6 h-6" />
            <span className="text-slate-800 font-semibold text-lg">AdminSuite</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-8">Ingresa tus credenciales para acceder al panel.</p>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                <button className="text-xs text-blue-600 hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
              <span className="text-sm text-slate-600">Mantener sesión iniciada</span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">
            Acceso restringido a personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
