export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void-950">
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="animate-float absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="animate-float absolute right-[-10%] top-[20%] h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-[120px] [animation-delay:1.2s]" />
      <div className="animate-float absolute bottom-[-15%] left-[30%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-[120px] [animation-delay:2.4s]" />
    </div>
  );
}
