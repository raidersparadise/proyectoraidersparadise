import { useState } from "react";
import { Shield, Mail, KeyRound, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const STEPS = ["email", "code", "password", "success"];

export default function RecuperacionContrasena() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ nueva: "", confirmar: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const simulate = async (next) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setStep(next);
  };

  const handleCodeChange = (val, idx) => {
    const next = [...code];
    next[idx] = val.replace(/\D/, "").slice(-1);
    setCode(next);
    if (val && idx < 5) document.getElementById(`code-${idx + 1}`)?.focus();
  };

  const handleCodeKey = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`code-${idx - 1}`)?.focus();
    }
  };

  const submitEmail = () => {
    if (!email.includes("@")) { setError("Ingresa un correo electrónico válido."); return; }
    simulate("code");
  };

  const submitCode = () => {
    if (code.join("").length < 6) { setError("Ingresa el código completo de 6 dígitos."); return; }
    simulate("password");
  };

  const submitPassword = () => {
    if (passwords.nueva.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (passwords.nueva !== passwords.confirmar) { setError("Las contraseñas no coinciden."); return; }
    simulate("success");
  };

  const strength = (() => {
    const p = passwords.nueva;
    if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["Muy débil", "Débil", "Moderada", "Fuerte"][strength - 1] || "";
  const strengthColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength - 1] || "";

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Branding */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #1d4ed8 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AdminSuite</span>
        </div>
        <div>
          <KeyRound className="text-blue-300 w-12 h-12 mb-6" />
          <h1 className="text-white text-3xl font-bold leading-tight mb-4">
            Recupera el acceso a tu cuenta de forma segura
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            Te enviaremos un código de verificación. Sigue los pasos para restablecer tu contraseña.
          </p>
        </div>
        <p className="text-blue-300 text-sm">© 2026 AdminSuite.</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Progress */}
          {step !== "success" && (
            <div className="flex items-center gap-2 mb-8">
              {["Correo", "Código", "Contraseña"].map((label, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      i < stepIndex
                        ? "bg-blue-600 text-white"
                        : i === stepIndex
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${i <= stepIndex ? "text-blue-600 font-medium" : "text-slate-400"}`}>{label}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 ${i < stepIndex ? "bg-blue-600" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step: email */}
          {step === "email" && (
            <div>
              <div className="bg-blue-50 p-3 rounded-2xl w-fit mb-5">
                <Mail className="text-blue-600 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">¿Olvidaste tu contraseña?</h2>
              <p className="text-slate-500 text-sm mb-8">Ingresa tu correo y te enviaremos un código de verificación.</p>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="correo@empresa.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-5"
              />
              <button
                onClick={submitEmail}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Enviando código..." : "Enviar código"}
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mt-5 mx-auto">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </button>
            </div>
          )}

          {/* Step: code */}
          {step === "code" && (
            <div>
              <div className="bg-blue-50 p-3 rounded-2xl w-fit mb-5">
                <KeyRound className="text-blue-600 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Verifica tu identidad</h2>
              <p className="text-slate-500 text-sm mb-2">
                Ingresa el código de 6 dígitos enviado a <span className="font-medium text-slate-700">{email}</span>.
              </p>
              <div className="flex gap-2 my-6">
                {code.map((c, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    value={c}
                    onChange={(e) => handleCodeChange(e.target.value, i)}
                    onKeyDown={(e) => handleCodeKey(e, i)}
                    maxLength={1}
                    className="flex-1 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                  />
                ))}
              </div>
              <button
                onClick={submitCode}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 mb-4"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verificando..." : "Verificar código"}
              </button>
              <p className="text-center text-sm text-slate-500">
                ¿No recibiste el código?{" "}
                <button className="text-blue-600 font-medium hover:underline">Reenviar</button>
              </p>
            </div>
          )}

          {/* Step: new password */}
          {step === "password" && (
            <div>
              <div className="bg-blue-50 p-3 rounded-2xl w-fit mb-5">
                <KeyRound className="text-blue-600 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Nueva contraseña</h2>
              <p className="text-slate-500 text-sm mb-8">Crea una contraseña segura para tu cuenta.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={passwords.nueva}
                      onChange={(e) => { setPasswords({ ...passwords, nueva: e.target.value }); setError(""); }}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.nueva && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`flex-1 h-1 rounded-full ${i <= strength ? strengthColor : "bg-slate-200"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Seguridad: <span className="font-medium">{strengthLabel}</span></p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={passwords.confirmar}
                      onChange={(e) => { setPasswords({ ...passwords, confirmar: e.target.value }); setError(""); }}
                      placeholder="Repite tu contraseña"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={submitPassword}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Guardando..." : "Guardar contraseña"}
                </button>
              </div>
            </div>
          )}

          {/* Step: success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Contraseña actualizada!</h2>
              <p className="text-slate-500 text-sm mb-8">Tu contraseña fue restablecida exitosamente. Ya puedes iniciar sesión.</p>
              <button
                onClick={() => { setStep("email"); setEmail(""); setCode(["","","","","",""]); setPasswords({ nueva: "", confirmar: "" }); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                Ir al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
