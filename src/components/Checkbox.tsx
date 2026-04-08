import { CheckIcon } from "./Icons";

export default function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        border: `2px solid ${checked ? "#c9785d" : "#c4b8a4"}`,
        background: checked
          ? "linear-gradient(135deg, #c9785d, #d9a08a)"
          : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
        padding: 0,
        boxShadow: checked ? "0 2px 8px rgba(201,120,93,0.3)" : "none",
      }}
    >
      {checked && <CheckIcon />}
    </button>
  );
}
