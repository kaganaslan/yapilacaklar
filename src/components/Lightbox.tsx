export default function Lightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        animation: "fadeInUp 0.2s ease",
      }}
      onClick={onClose}
    >
      <img
        src={src}
        alt=""
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          objectFit: "contain",
          borderRadius: "4px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
