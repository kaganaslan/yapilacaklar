import { XIcon } from "./Icons";

const ROTATIONS = [-4, 3, -2.5, 4.5, -3, 2, -5, 3.5, -1.5, 4, -3.5, 2.5];
const getRotation = (idx: number) => ROTATIONS[idx % ROTATIONS.length];

export default function PolaroidPhoto({
  src,
  date,
  rotationSeed,
  onRemove,
  onClick,
}: {
  src: string;
  date: string;
  rotationSeed: number;
  onRemove?: () => void;
  onClick: () => void;
}) {
  const rot = getRotation(rotationSeed);

  return (
    <div
      className="polaroid-wrap"
      style={{
        display: "inline-block",
        background: "#fffef4",
        padding: "7px 7px 32px 7px",
        boxShadow:
          "1px 2px 12px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
        transform: `rotate(${rot}deg)`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        position: "relative",
        borderRadius: "1px",
        cursor: "pointer",
        flexShrink: 0,
        border: "1px solid rgba(210,200,180,0.5)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
        e.currentTarget.style.boxShadow = "2px 5px 20px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rot}deg)`;
        e.currentTarget.style.boxShadow =
          "1px 2px 12px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          overflow: "hidden",
          background: "#f0ebe0",
        }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "contrast(1.03) saturate(1.05)",
          }}
        />
      </div>
      <p
        style={{
          position: "absolute",
          bottom: "8px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Caveat', cursive",
          fontSize: "0.78rem",
          color: "#9a8a72",
          letterSpacing: "0.02em",
        }}
      >
        {date}
      </p>
      {onRemove && (
        <button
          className="polaroid-delete"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            position: "absolute",
            top: "-7px",
            right: "-7px",
            background: "#c9785d",
            border: "none",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            padding: 0,
          }}
        >
          <XIcon size={10} />
        </button>
      )}
    </div>
  );
}
