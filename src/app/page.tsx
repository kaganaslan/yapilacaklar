"use client";

import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { usePhotos } from "@/hooks/usePhotos";
import FloatingHearts from "@/components/FloatingHearts";
import ItemCard from "@/components/ItemCard";
import Lightbox from "@/components/Lightbox";
import PasswordGate, { UserKey, clearStoredUser } from "@/components/PasswordGate";
import { HeartIcon, PlusIcon } from "@/components/Icons";

const USER_META: Record<UserKey, { emoji: string; label: string }> = {
  serra: { emoji: "🌸", label: "Serra" },
  kagan: { emoji: "⚡", label: "Kağan" },
};

function App({ user }: { user: UserKey }) {
  const { items, loading, addItem, toggleDone, updateNote, removeItem } =
    useItems(user);
  const { removePhoto } = usePhotos();

  const [newText, setNewText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newText.trim()) return;
    addItem(newText.trim());
    setNewText("");
  };

  const handleToggle = (id: string, current: boolean) => {
    if (!current) {
      setJustCompleted(id);
      setTimeout(() => setJustCompleted(null), 1500);
    }
    toggleDone(id, current);
  };

  const handleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setEditingNote(null);
  };

  const handleEditNote = (id: string, currentNote: string) => {
    setEditingNote(id);
    setNoteText(currentNote || "");
  };

  const handleSaveNote = (id: string) => {
    updateNote(id, noteText);
    setEditingNote(null);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    if (expandedId === id) setExpandedId(null);
  };

  const handleLogout = () => {
    clearStoredUser();
    window.location.reload();
  };

  const pending = items.filter((i) => !i.done);
  const completed = items.filter((i) => i.done);
  const progress =
    items.length > 0 ? Math.round((completed.length / items.length) * 100) : 0;

  const meta = USER_META[user];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #f5f0e8 0%, #ede8df 20%, #eae4d8 40%, #f0ebe2 60%, #ece5d8 80%, #f2ede5 100%)",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingHearts />

      {lightbox && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}

      {/* User badge + logout */}
      <div
        style={{
          position: "fixed",
          top: "14px",
          right: "14px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.75rem",
            color: "#a09580",
            background: "rgba(255,255,252,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(200,185,160,0.3)",
            borderRadius: "20px",
            padding: "4px 10px",
          }}
        >
          {meta.emoji} {meta.label}
        </span>
        <button
          onClick={handleLogout}
          title="Çıkış"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.7rem",
            color: "#c9b8a4",
            background: "rgba(255,255,252,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(200,185,160,0.25)",
            borderRadius: "20px",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          çıkış
        </button>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "520px",
          margin: "0 auto",
          padding: "24px 16px 60px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            animation: "fadeInUp 0.6s ease",
          }}
        >
          <div
            style={{
              animation: "headerFloat 4s ease-in-out infinite",
              marginBottom: "6px",
            }}
          >
            <HeartIcon size={34} filled color="#c9785d" />
          </div>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 300,
              color: "#3d3429",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            yapılacaklar
          </h1>
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "1.15rem",
              fontWeight: 500,
              color: "#c9785d",
              marginTop: "2px",
            }}
          >
            ama seninle ✨
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: "18px", padding: "0 20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.72rem",
                  color: "#a09580",
                }}
              >
                {completed.length} / {items.length} tamamlandı
              </span>
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#c9785d",
                }}
              >
                {progress}%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "#ddd5c8",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #d9a08a, #c9785d)",
                  borderRadius: "4px",
                  transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Add input */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            animation: "fadeInUp 0.6s ease 0.1s both",
          }}
        >
          <input
            type="text"
            placeholder="Yeni bir hayal ekle..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{
              flex: 1,
              padding: "11px 16px",
              border: "1.5px solid #d4cabb",
              borderRadius: "14px",
              fontSize: "0.9rem",
              fontFamily: "'Nunito', sans-serif",
              background: "rgba(255,255,252,0.7)",
              color: "#3d3429",
              backdropFilter: "blur(8px)",
            }}
          />
          <button
            onClick={handleAdd}
            className="add-btn"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #c9785d, #d9a08a)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PlusIcon />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#b8aa94",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.85rem",
            }}
          >
            yükleniyor...
          </div>
        )}

        {/* Pending items */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {pending.map((item, idx) => (
              <ItemCard
                key={item.id}
                item={item}
                index={idx}
                isDone={false}
                isExpanded={expandedId === item.id}
                isEditing={editingNote === item.id}
                noteText={noteText}
                justCompleted={justCompleted === item.id}
                onToggle={() => handleToggle(item.id, item.done)}
                onExpand={() => handleExpand(item.id)}
                onRemove={() => handleRemove(item.id)}
                onEditNote={() => handleEditNote(item.id, item.note)}
                onNoteChange={setNoteText}
                onSaveNote={() => handleSaveNote(item.id)}
                onCancelNote={() => setEditingNote(null)}
                onPhotoAdded={() => {}}
                onRemovePhoto={(photoId, storagePath) =>
                  removePhoto(photoId, storagePath)
                }
                onLightbox={setLightbox}
              />
            ))}
          </div>
        )}

        {/* Completed items */}
        {!loading && completed.length > 0 && (
          <div style={{ marginTop: "28px" }}>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#a09580",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "10px",
                padding: "4px 0",
              }}
            >
              <HeartIcon size={13} filled color="#c9785d" />
              {completed.length} anı biriktirdik
              <span
                style={{
                  transform: showCompleted ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  display: "inline-block",
                  fontSize: "0.6rem",
                }}
              >
                ▼
              </span>
            </button>
            {showCompleted && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {completed.map((item, idx) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={idx}
                    isDone={true}
                    isExpanded={expandedId === item.id}
                    isEditing={editingNote === item.id}
                    noteText={noteText}
                    justCompleted={justCompleted === item.id}
                    onToggle={() => handleToggle(item.id, item.done)}
                    onExpand={() => handleExpand(item.id)}
                    onRemove={() => handleRemove(item.id)}
                    onEditNote={() => handleEditNote(item.id, item.note)}
                    onNoteChange={setNoteText}
                    onSaveNote={() => handleSaveNote(item.id)}
                    onCancelNote={() => setEditingNote(null)}
                    onPhotoAdded={() => {}}
                    onRemovePhoto={(photoId, storagePath) =>
                      removePhoto(photoId, storagePath)
                    }
                    onLightbox={setLightbox}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            padding: "20px 0",
            animation: "fadeInUp 0.6s ease 0.3s both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #ccc0ad)",
              }}
            />
            <HeartIcon size={12} filled color="#d4b8a4" />
            <div
              style={{
                width: "30px",
                height: "1px",
                background: "linear-gradient(90deg, #ccc0ad, transparent)",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "1rem",
              color: "#b8aa94",
            }}
          >
            seninle her an bir macera 💫
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PasswordGate>
      {(user) => <App user={user} />}
    </PasswordGate>
  );
}
