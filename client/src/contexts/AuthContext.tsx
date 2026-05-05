import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface StoredUser {
  username: string;
  passwordHash: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  users: string[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (username: string, password: string) => Promise<"ok" | "duplicate">;
  removeUser: (username: string) => void;
  changePassword: (username: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "wg_users";
const SESSION_KEY = "wg_session";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_KEY)
  );

  // Bootstrap default admin on first run
  useEffect(() => {
    const existing = loadUsers();
    if (existing.length > 0) {
      setStoredUsers(existing);
    } else {
      hashPassword("admin123").then((hash) => {
        const defaults: StoredUser[] = [{ username: "admin", passwordHash: hash }];
        saveUsers(defaults);
        setStoredUsers(defaults);
      });
    }
  }, []);

  async function login(username: string, password: string): Promise<boolean> {
    const hash = await hashPassword(password);
    const match = storedUsers.find(
      (u: StoredUser) => u.username === username && u.passwordHash === hash
    );
    if (match) {
      setCurrentUser(username);
      sessionStorage.setItem(SESSION_KEY, username);
      return true;
    }
    return false;
  }

  function logout(): void {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function addUser(
    username: string,
    password: string
  ): Promise<"ok" | "duplicate"> {
    const trimmed = username.trim();
    if (storedUsers.find((u: StoredUser) => u.username === trimmed)) return "duplicate";
    const hash = await hashPassword(password);
    const updated = [...storedUsers, { username: trimmed, passwordHash: hash }];
    saveUsers(updated);
    setStoredUsers(updated);
    return "ok";
  }

  function removeUser(username: string): void {
    if (username === "admin") return; // protect built-in admin
    const updated = storedUsers.filter((u: StoredUser) => u.username !== username);
    saveUsers(updated);
    setStoredUsers(updated);
  }

  async function changePassword(
    username: string,
    newPassword: string
  ): Promise<void> {
    const hash = await hashPassword(newPassword);
    const updated = storedUsers.map((u: StoredUser) =>
      u.username === username ? { ...u, passwordHash: hash } : u
    );
    saveUsers(updated);
    setStoredUsers(updated);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        currentUser,
        users: storedUsers.map((u: StoredUser) => u.username),
        login,
        logout,
        addUser,
        removeUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
