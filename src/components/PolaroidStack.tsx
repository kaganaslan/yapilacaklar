import { Photo } from "@/hooks/useItems";

const ROTATIONS = [-4, 3, -2.5, 4.5, -3, 2, -5, 3.5, -1.5, 4, -3.5, 2.5];
const getRotation = (idx: number) => ROTATIONS[idx % ROTATIONS.length];

export default function PolaroidStack({
  photos,
  onClick,
}: {
  photos: Photo[];
  onClick: () => void;
}) {
  const count = photos.length;
  if (count === 0) return null;
  const show = photos.slice(0, 3);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: "relative",
        width: "44px",
        height: "44px",
        background: "none",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
      }}
      title={`${count} fotoğraf`}
    >
      {show.map((photo, i) => {
        const src = photo.publicUrl || photo.storage_path;
        const rot = getRotation(i) * 1.8;
        const offset = i * 3;
        return (
          <div
            key={photo.id}
            style={{
              position: "absolute",
              top: `${offset}px`,
              left: `${offset}px`,
              width: "38px",
              height: "38px",
              background: "#fffef4",
              padding: "3px 3px 8px 3px",
              borderRadius: "1px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              transform: `rotate(${rot}deg)`,
              zIndex: show.length - i,
              border: "1px solid rgba(210,200,180,0.4)",
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "28px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        );
      })}
      {count > 1 && (
        <span
          style={{
            position: "absolute",
            bottom: "-4px",
            right: "-6px",
            background: "#c9785d",
            color: "white",
            fontSize: "0.6rem",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
