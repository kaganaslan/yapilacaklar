"use client";

import { useRef, useState } from "react";
import { Item } from "@/hooks/useItems";
import { usePhotos } from "@/hooks/usePhotos";
import Checkbox from "./Checkbox";
import PolaroidStack from "./PolaroidStack";
import PolaroidPhoto from "./PolaroidPhoto";
import { HeartIcon, CameraIcon, TrashIcon, NoteIcon } from "./Icons";

interface ItemCardProps {
  item: Item;
  index: number;
  isDone: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  noteText: string;
  justCompleted: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onRemove: () => void;
  onEditNote: () => void;
  onNoteChange: (text: string) => void;
  onSaveNote: () => void;
  onCancelNote: () => void;
  onPhotoAdded: () => Promise<void> | void;
  onRemovePhoto: (photoId: string, storagePath: string) => void;
  onLightbox: (src: string) => void;
}

export default function ItemCard({
  item,
  index,
  isDone,
  isExpanded,
  isEditing,
  noteText,
  justCompleted,
  onToggle,
  onExpand,
  onRemove,
  onEditNote,
  onNoteChange,
  onSaveNote,
  onCancelNote,
  onPhotoAdded,
  onRemovePhoto,
  onLightbox,
}: ItemCardProps) {
  const { uploadPhoto } = usePhotos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);

  const hasPhotos = item.photos && item.photos.length > 0;
  const hasNote = item.note && item.note.length > 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await uploadPhoto(item.id, file);
    await onPhotoAdded();
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div
      className="item-card"
      onClick={uploading ? undefined : onExpand}
      style={{
        background: isDone
          ? "rgba(255,255,252,0.35)"
          : "rgba(255,255,252,0.65)",
        backdropFilter: "blur(10px)",
        borderRadius: isExpanded ? "20px" : "14px",
        padding: isExpanded ? "16px 16px 14px" : "11px 14px",
        border: `1px solid rgba(200,185,160,${
          isDone ? "0.15" : isExpanded ? "0.35" : "0.22"
        })`,
        animationDelay: `${index * 0.04}s`,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
        boxShadow: isExpanded ? "0 6px 24px rgba(160,130,100,0.10)" : "none",
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Checkbox checked={isDone} onChange={onToggle} />
        <p
          style={{
            flex: 1,
            fontSize: isExpanded ? "0.95rem" : "0.9rem",
            color: isDone ? "#a09580" : "#3d3429",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: isDone ? 400 : isExpanded ? 500 : 400,
            lineHeight: 1.45,
            wordBreak: "break-word",
            textDecoration: isDone ? "line-through" : "none",
            textDecorationColor: "#d4c0aa",
            transition: "all 0.2s ease",
          }}
        >
          {item.text}
        </p>
        {!isExpanded && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            {hasNote && (
              <span
                style={{ fontSize: "0.7rem", color: "#b8aa94", opacity: 0.7 }}
              >
                📝
              </span>
            )}
            {hasPhotos && !isDone && (
              <PolaroidStack photos={item.photos} onClick={onExpand} />
            )}
            {hasPhotos && isDone && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#b8aa94",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                📸 {item.photos.length}
              </span>
            )}
            {item.created_by && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#b8aa94",
                  fontFamily: "'Nunito', sans-serif",
                  background: "rgba(200,185,160,0.15)",
                  borderRadius: "8px",
                  padding: "1px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                {item.created_by === "serra" ? "🐒" : "⚡"}
              </span>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: "10px",
            paddingLeft: "32px",
            animation: "expandIn 0.3s ease",
          }}
        >
          {hasNote && !isEditing && (
            <p
              style={{
                fontSize: "0.88rem",
                color: "#a09580",
                fontFamily: "'Caveat', cursive",
                fontStyle: "italic",
                marginBottom: "8px",
                lineHeight: 1.4,
              }}
            >
              &quot;{item.note}&quot;
            </p>
          )}
          {isEditing && (
            <div
              style={{ marginBottom: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Bir not bırak..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1.5px solid #d4cabb",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontFamily: "'Nunito', sans-serif",
                  resize: "vertical",
                  background: "rgba(255,255,252,0.8)",
                  color: "#3d3429",
                }}
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveNote();
                  }}
                  style={{
                    padding: "4px 14px",
                    background: "#c9785d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  kaydet
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelNote();
                  }}
                  style={{
                    padding: "4px 14px",
                    background: "transparent",
                    color: "#a09580",
                    border: "1px solid #d4cabb",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  iptal
                </button>
              </div>
            </div>
          )}
          {hasPhotos && (
            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                padding: "6px 0 8px",
                animation: "fadeInUp 0.3s ease 0.1s both",
              }}
            >
              {item.photos.map((photo, pIdx) => (
                <PolaroidPhoto
                  key={photo.id}
                  src={photo.publicUrl || photo.storage_path}
                  date={photo.date_label}
                  rotationSeed={pIdx}
                  onClick={() =>
                    onLightbox(photo.publicUrl || photo.storage_path)
                  }
                  onRemove={() =>
                    onRemovePhoto(photo.id, photo.storage_path)
                  }
                />
              ))}
            </div>
          )}
          {!isDone && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "6px",
                borderTop: "1px solid rgba(200,185,160,0.15)",
                paddingTop: "8px",
              }}
            >
              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditNote();
                }}
                style={{
                  height: "30px",
                  border: "none",
                  background: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#b8aa94",
                  fontSize: "0.72rem",
                  fontFamily: "'Nunito', sans-serif",
                  padding: "0 8px",
                }}
              >
                <NoteIcon /> not
              </button>
              <button
                className="action-btn"
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!uploading) fileInputRef.current?.click();
                }}
                style={{
                  height: "30px",
                  border: "none",
                  background: "transparent",
                  borderRadius: "8px",
                  cursor: uploading ? "default" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#b8aa94",
                  fontSize: "0.72rem",
                  fontFamily: "'Nunito', sans-serif",
                  padding: "0 8px",
                }}
              >
                <CameraIcon /> {uploading ? "yükleniyor..." : "foto"}
              </button>
              <div style={{ flex: 1 }} />
              {confirmDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "0.72rem", color: "#a09580", fontFamily: "'Nunito', sans-serif" }}>emin misin?</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    style={{ height: "26px", padding: "0 10px", border: "none", background: "#c9785d", color: "white", borderRadius: "8px", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", cursor: "pointer" }}
                  >evet</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    style={{ height: "26px", padding: "0 10px", border: "1px solid #d4cabb", background: "transparent", color: "#a09580", borderRadius: "8px", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", cursor: "pointer" }}
                  >hayır</button>
                </div>
              ) : (
                <button
                  className="action-btn"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                  style={{ height: "30px", border: "none", background: "transparent", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "#ccc0ad", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", padding: "0 8px" }}
                >
                  <TrashIcon /> sil
                </button>
              )}
            </div>
          )}
          {isDone && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "6px",
                borderTop: "1px solid rgba(200,185,160,0.1)",
                paddingTop: "8px",
              }}
            >
              <div style={{ flex: 1 }} />
              {confirmDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: "0.72rem", color: "#a09580", fontFamily: "'Nunito', sans-serif" }}>emin misin?</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    style={{ height: "26px", padding: "0 10px", border: "none", background: "#c9785d", color: "white", borderRadius: "8px", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", cursor: "pointer" }}
                  >evet</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    style={{ height: "26px", padding: "0 10px", border: "1px solid #d4cabb", background: "transparent", color: "#a09580", borderRadius: "8px", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", cursor: "pointer" }}
                  >hayır</button>
                </div>
              ) : (
                <button
                  className="action-btn"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                  style={{ height: "28px", border: "none", background: "transparent", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "#ccc0ad", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", padding: "0 8px" }}
                >
                  <TrashIcon /> sil
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {justCompleted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            animation: "celebrateHeart 0.8s ease",
          }}
        >
          <HeartIcon size={48} filled color="rgba(201,120,93,0.25)" />
        </div>
      )}
    </div>
  );
}
