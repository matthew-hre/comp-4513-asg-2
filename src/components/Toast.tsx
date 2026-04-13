type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  return (
    <div
      role="alert"
      style={{
        background: "var(--pico-primary-background)",
        borderRadius: "var(--pico-border-radius)",
        bottom: "1rem",
        color: "var(--pico-primary-inverse)",
        padding: "0.75rem 1.5rem",
        position: "fixed",
        right: "1rem",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}
