"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@/components/Icons";

const USERS = [
  {
    key: "serra",
    label: "Serra",
    emoji: "🌸",
    password: process.env.NEXT_PUBLIC_SERRA_PASSWORD ?? "serra",
  },
  {
    key: "kagan",
    label: "Kağan",
    emoji: "⚡",
    password: process.env.NEXT_PUBLIC_KAGAN_PASSWORD ?? "kagan",
  },
] as const;

export type UserKey = "serra" | "kagan";

const STORAGE_KEY = "yapilacaklar_user";

export function getStoredUser(): UserKey | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(STORAGE_KEY);
  if (val === "serra" || val === "kagan") return val;
  return null;
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function PasswordGate({
  children,
}: {
  children: (user: UserKey) => React.ReactNode;
}) {
  const [user, setUser] = useState<UserKey | null>(null);
  const [selected, setSelected] = useState<UserKey | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USERS.find((u) => u.key === selected);
    if (found && input === found.password) {
      localStorage.setItem(STORAGE_KEY, found.key);
      setUser(found.key);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  if (!ready) return null;
  if (user) return <>{children(user)}</>;

  const selectedUser = USERS.find((u) => u.key === selected);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #f5f0e8 0%, #ede8df 20%, #eae4d8 40%, #f0ebe2 60%, #ece5d8 80%, #f2ede5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "48px 32px",
          background: "rgba(255,255,252,0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          border: "1px solid rgba(201,120,93,0.15)",
          width: "100%",
          maxWidth: "340px",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <HeartIcon size={36} filled color="#c9785d" />
        </div>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 300,
            color: "#3d3429",
            marginBottom: "4px",
          }}
        >
          yapılacaklar
        </h1>
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1.1rem",
            color: "#c9785d",
            marginBottom: "32px",
          }}
        >
          ama seninle ✨
        </p>

        {!selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.82rem",
                color: "#a09580",
                marginBottom: "4px",
              }}
            >
              kim giriyorsun?
            </p>
            {USERS.map((u) => (
              <button
                key={u.key}
                onClick={() => setSelected(u.key)}
                style={{
                  padding: "13px",
                  borderRadius: "14px",
                  border: "1.5px solid #d4cabb",
                  background: "rgba(255,255,252,0.7)",
                  color: "#3d3429",
                  fontSize: "1.1rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {u.emoji} {u.label}
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.9rem",
                color: "#3d3429",
                fontWeight: 600,
              }}
            >
              {selectedUser?.emoji} {selectedUser?.label}
            </p>
            <input
              type="password"
              placeholder="şifre..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              style={{
                padding: "12px 16px",
                border: `1.5px solid ${error ? "#c9785d" : "#d4cabb"}`,
                borderRadius: "14px",
                fontSize: "1rem",
                fontFamily: "'Nunito', sans-serif",
                background: "rgba(255,255,252,0.7)",
                color: "#3d3429",
                textAlign: "center",
                outline: "none",
              }}
            />
            {error && (
              <p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.8rem",
                  color: "#c9785d",
                  margin: 0,
                }}
              >
                yanlış şifre 🥺
              </p>
            )}
            <button
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #c9785d, #d9a08a)",
                color: "white",
                fontSize: "1rem",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              gir 💕
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setInput("");
                setError(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#a09580",
                fontSize: "0.78rem",
                fontFamily: "'Nunito', sans-serif",
                cursor: "pointer",
              }}
            >
              ← geri
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
