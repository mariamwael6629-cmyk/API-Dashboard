export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-void-950">
      <div className="bg-grid absolute inset-0 opacity-40" />
    </div>
  );
}
