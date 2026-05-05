import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell, LogIn } from "lucide-react";
import { type FormEvent, useState } from "react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/109165107/VcNY2f88iSvmUCDJYXfGZH/workout-generator-dice-emblem-UFnusHbekkgQDjGYSNTFR3.webp";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Introduce usuario y contraseña.");
      return;
    }
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (!ok) setError("Usuario o contraseña incorrectos.");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <Dumbbell className="w-8 h-8 text-zinc-900" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
              Workout Generator
            </h1>
            <p className="text-xs text-zinc-400 tracking-widest uppercase mt-1">
              Acceso privado
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Usuario
            </label>
            <Input
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="border-zinc-300 focus:border-zinc-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Contraseña
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-zinc-300 focus:border-zinc-900"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-700 text-white uppercase tracking-widest text-xs font-bold h-10"
          >
            {loading ? (
              "Verificando…"
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Entrar
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-300 mt-8 tracking-widest uppercase">
          Acceso restringido
        </p>
      </div>
    </div>
  );
}
