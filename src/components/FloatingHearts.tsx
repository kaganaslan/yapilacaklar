import { HeartIcon } from "./Icons";

const hearts = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: (i * 10 + 5) % 100,
  delay: i * 0.8,
  duration: 7 + (i % 4) * 2,
  size: 9 + (i % 5) * 2,
  opacity: 0.05 + (i % 3) * 0.03,
}));

export default function FloatingHearts() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: "-30px",
            opacity: h.opacity,
            animation: `floatUp ${h.duration}s ease-in ${h.delay}s infinite`,
          }}
        >
          <HeartIcon size={h.size} filled color="#c9785d" />
        </div>
      ))}
    </div>
  );
}
