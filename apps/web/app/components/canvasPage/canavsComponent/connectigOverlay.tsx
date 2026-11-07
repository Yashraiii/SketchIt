interface ConnectingOverlayProps {
  title?: string;
  message?: string;
}

export default function ConnectingOverlay({
  title = "Joining Room",
  message = "Establishing live connection...",
}: ConnectingOverlayProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/8 bg-[#1a1a1f]/90 px-10 py-8 shadow-2xl backdrop-blur-2xl text-white">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-xs text-neutral-400">{message}</p>
        </div>
      </div>
    </div>
  );
}