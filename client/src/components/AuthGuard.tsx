import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { clearWorkoutLogsByUser, getWorkoutLogsByUser } from "@/lib/workoutStorage";
import Login from "@/pages/Login";
import { DatabaseBackup, LogOut, Trash2, UserCog, UserPlus } from "lucide-react";
import { useState } from "react";

function ClearHistoryButton({ userId }: { userId: string }) {
  const count = getWorkoutLogsByUser(userId).length;
  const [confirming, setConfirming] = useState(false);

  if (count === 0) return null;

  return confirming ? (
    <span className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        title="Confirmar borrado"
        onClick={() => { clearWorkoutLogsByUser(userId); setConfirming(false); }}
        className="text-red-600 hover:text-red-800 hover:bg-red-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        title="Cancelar"
        onClick={() => setConfirming(false)}
        className="text-zinc-400 hover:text-zinc-600"
      >
        ✕
      </Button>
    </span>
  ) : (
    <Button
      variant="ghost"
      size="icon-sm"
      title={`Borrar historial (${count} sesión${count !== 1 ? "es" : ""})`}
      onClick={() => setConfirming(true)}
      className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
    >
      <DatabaseBackup className="w-3.5 h-3.5" />
    </Button>
  );
}

function UserManagementDialog() {
  const { users, currentUser, addUser, removeUser, changePassword } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [changingUser, setChangingUser] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const name = newUsername.trim();
    if (!name || !newPassword) {
      setAddError("Rellena usuario y contraseña.");
      return;
    }
    if (newPassword.length < 6) {
      setAddError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const result = await addUser(name, newPassword);
    if (result === "duplicate") {
      setAddError("El usuario ya existe.");
    } else {
      setAddSuccess(`Usuario "${name}" creado.`);
      setNewUsername("");
      setNewPassword("");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangeMsg("");
    if (!newPass || newPass.length < 6) {
      setChangeMsg("Mínimo 6 caracteres.");
      return;
    }
    await changePassword(changingUser!, newPass);
    setChangeMsg("Contraseña actualizada.");
    setNewPass("");
  }

  return (
    <Dialog onOpenChange={() => { setAddError(""); setAddSuccess(""); setChangingUser(null); setChangeMsg(""); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" title="Gestionar usuarios">
          <UserCog className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-xs font-black">
            Gestión de usuarios
          </DialogTitle>
        </DialogHeader>

        {/* User list */}
        <div className="space-y-1 mt-2">
          {users.map((u) => (
            <div
              key={u}
              className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-50 border border-zinc-100"
            >
              <span className="text-sm font-medium text-zinc-700">
                {u}
                {u === currentUser && (
                  <span className="ml-2 text-xs text-zinc-400">(tú)</span>
                )}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Cambiar contraseña"
                  onClick={() => {
                    setChangingUser(changingUser === u ? null : u);
                    setChangeMsg("");
                    setNewPass("");
                  }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </Button>
                <ClearHistoryButton userId={u} />
                {u !== "admin" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Eliminar usuario"
                    onClick={() => removeUser(u)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Change password inline form */}
        {changingUser && (
          <form onSubmit={handleChangePassword} className="space-y-2 border-t border-zinc-100 pt-3">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Nueva contraseña para <span className="text-zinc-800">{changingUser}</span>
            </p>
            <Input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              autoFocus
            />
            {changeMsg && (
              <p className={`text-xs font-medium ${changeMsg.includes("actualizada") ? "text-green-600" : "text-red-600"}`}>
                {changeMsg}
              </p>
            )}
            <Button
              type="submit"
              size="sm"
              className="w-full bg-zinc-800 hover:bg-zinc-600 text-white text-xs uppercase tracking-widest"
            >
              Guardar contraseña
            </Button>
          </form>
        )}

        {/* Add user form */}
        <form
          onSubmit={handleAddUser}
          className="space-y-2 border-t border-zinc-100 pt-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Añadir usuario
          </p>
          <Input
            type="text"
            placeholder="Usuario"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="off"
          />
          <Input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {addError && (
            <p className="text-xs text-red-600 font-medium">{addError}</p>
          )}
          {addSuccess && (
            <p className="text-xs text-green-600 font-medium">{addSuccess}</p>
          )}
          <Button
            type="submit"
            size="sm"
            className="w-full bg-zinc-900 hover:bg-zinc-700 text-white text-xs uppercase tracking-widest"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Crear usuario
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      {/* Top auth bar — hidden on print */}
      <div className="print:hidden flex items-center justify-end gap-2 px-4 py-2 bg-zinc-900 text-white">
        <span className="text-xs text-zinc-400 tracking-widest uppercase mr-auto">
          {currentUser}
        </span>
        <UserManagementDialog />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={logout}
          title="Cerrar sesión"
          className="text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
      {children}
    </>
  );
}
