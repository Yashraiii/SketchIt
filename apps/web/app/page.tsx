import Link from "next/link";
import {
  Pencil,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Shield,
  Layers,
  Palette,
  Share2,
  MousePointer2,
  Hand,
  Square,
  Circle,
  Type,
  Eraser,
  CheckCircle2,
  Database,
  Server,
  Laptop,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-indigo-500/30 flex flex-col font-sans overflow-x-hidden">
      {/* ── Top Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/20 group-hover:scale-105 transition">
              <Pencil className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              SketchIt
            </span>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/canvas"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition px-2 py-1.5"
            >
              Solo Scratchpad
            </Link>

            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-white transition px-3 py-1.5"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-20 pb-28 flex flex-col items-center text-center">
        {/* Release / Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md">
          <Sparkles size={13} className="text-indigo-400" />
          <span>Real-Time Collaborative Whiteboard</span>
          <span className="h-1 w-1 rounded-full bg-indigo-400" />
          <span className="text-neutral-400">Zero Setup Required</span>
        </div>

        {/* Main Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-linear-to-b from-white via-neutral-100 to-neutral-400 leading-[1.1] mb-6">
          Draw, diagram & collaborate <br className="hidden sm:inline" />
          at the speed of thought.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed font-normal">
          An infinite virtual whiteboard for developers and product teams.
          Sketch system architectures, wireframe user journeys, and sync live with your team in 60 FPS.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-20">
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] text-sm"
          >
            <span>Start Free Room</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/canvas"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-neutral-300 hover:text-white border border-white/10 bg-white/4 hover:bg-white/8 transition-all text-sm"
          >
            <Pencil size={16} />
            <span>Open Solo Scratchpad</span>
          </Link>
        </div>

        {/* ── Realistic Interactive Canvas Mockup ── */}
        <div className="relative w-full max-w-5xl rounded-3xl border border-white/12 bg-[#101116] p-2 sm:p-4 shadow-2xl backdrop-blur-2xl overflow-hidden mb-28">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/40 border border-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/40 border border-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/40 border border-green-500/60" />
              <span className="ml-3 text-xs font-mono text-neutral-500">
                sketchit.app/canvas/arch-system-flow
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">2 Collaborators Live</span>
            </div>
          </div>

          {/* Whiteboard Workspace Interior */}
          <div className="h-110 sm:h-125 w-full rounded-2xl bg-[#0d0e12] border border-white/6 flex flex-col relative overflow-hidden select-none">
            {/* Dotted Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[20px_20px]" />

            {/* Floating Canvas Top Toolbar Mockup */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-xl border border-white/10 bg-[#181920]/95 backdrop-blur-md shadow-2xl">
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <MousePointer2 size={16} />
              </div>
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <Hand size={16} />
              </div>
              <div className="h-4 w-px bg-white/10 mx-0.5" />
              <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
                <Square size={16} />
              </div>
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <Circle size={16} />
              </div>
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <Pencil size={16} />
              </div>
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <Type size={16} />
              </div>
              <div className="p-2 rounded-lg text-neutral-400 hover:text-white transition">
                <Eraser size={16} />
              </div>
            </div>

            {/* Diagram Elements on Canvas */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14 max-w-3xl">
                {/* Node 1: Client App */}
                <div className="relative flex flex-col items-center p-5 rounded-2xl border-2 border-dashed border-indigo-400/50 bg-indigo-500/10 backdrop-blur-sm w-44">
                  <Laptop className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Next.js Client</span>
                  <span className="text-[10px] text-indigo-300 font-mono mt-1">DGM.js Canvas</span>
                </div>

                {/* Arrow Connector 1 */}
                <div className="flex sm:flex-row flex-col items-center text-neutral-500 gap-1">
                  <div className="h-8 w-px sm:h-px sm:w-12 bg-indigo-400/40 border-t border-indigo-400/40" />
                  <span className="text-[10px] font-mono text-indigo-400">WebSocket</span>
                  <div className="h-8 w-px sm:h-px sm:w-12 bg-indigo-400/40 border-t border-indigo-400/40" />
                </div>

                {/* Node 2: WS Backend */}
                <div className="relative flex flex-col items-center p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-600/15 backdrop-blur-sm shadow-xl shadow-indigo-500/10 w-44">
                  <Server className="w-8 h-8 text-indigo-300 mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">WS Hub Server</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1">60 FPS RAM Sync</span>
                </div>

                {/* Arrow Connector 2 */}
                <div className="flex sm:flex-row flex-col items-center text-neutral-500 gap-1">
                  <div className="h-8 w-px sm:h-px sm:w-12 bg-violet-400/40 border-t border-violet-400/40" />
                  <span className="text-[10px] font-mono text-violet-400">Prisma</span>
                  <div className="h-8 w-px sm:h-px sm:w-12 bg-violet-400/40 border-t border-violet-400/40" />
                </div>

                {/* Node 3: PostgreSQL */}
                <div className="relative flex flex-col items-center p-5 rounded-2xl border-2 border-dashed border-violet-400/50 bg-violet-500/10 backdrop-blur-sm w-44">
                  <Database className="w-8 h-8 text-violet-400 mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">PostgreSQL</span>
                  <span className="text-[10px] text-violet-300 font-mono mt-1">Auto-Saved Doc</span>
                </div>
              </div>

              
              <div className="absolute top-28 left-16 sm:left-24 flex items-center gap-1.5 animate-bounce">
                <MousePointer2 size={18} className="text-violet-400 fill-violet-400" />
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500 text-white shadow-md">
                  Yash (Architect)
                </span>
              </div>

              {/* Live Cursor 2: Alex */}
              <div className="absolute bottom-20 right-16 sm:right-28 flex items-center gap-1.5">
                <MousePointer2 size={18} className="text-emerald-400 fill-emerald-400" />
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500 text-black shadow-md font-sans">
                  Alex (Drawing)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bento Feature Grid ── */}
        <div className="w-full max-w-5xl text-left mb-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Built for speed, clarity, and teams.
            </h2>
            <p className="text-neutral-400 text-base max-w-lg mx-auto">
              Everything you need to turn vague thoughts into clear architecture diagrams and wireframes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl border border-white/8 bg-[#121318]/80 backdrop-blur-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Zap size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  60 FPS In-Memory Sync
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Real-time strokes stream directly between clients via Node.js WebSockets in memory,
                  avoiding database read-locks while you draw.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl border border-white/8 bg-[#121318]/80 backdrop-blur-xl hover:border-violet-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6 border border-violet-500/20">
                  <Palette size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  Hand-Drawn Aesthetics
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Natural sketchy strokes, customizable hachure fills, and clean geometry. Make diagrams that look polished yet approachable.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl border border-white/8 bg-[#121318]/80 backdrop-blur-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Shield size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  Decentralized Better-Auth
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Stateless public-key JWT verification using JWKS cryptography. Secure sessions with zero database lookups on every socket ping.
                </p>
              </div>
            </div>

            {/* Feature 4: Persistent Workspaces */}
            <div className="md:col-span-2 p-7 rounded-3xl border border-white/8 bg-[#121318]/80 backdrop-blur-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
                  <Layers size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  PostgreSQL Cloud Auto-Save
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
                  Exit to your dashboard or close your browser without fear. Every shape is automatically serialized and saved to your workspace database with Prisma upserts.
                </p>
              </div>
            </div>

            {/* Feature 5: Shareable Rooms */}
            <div className="p-7 rounded-3xl border border-white/8 bg-[#121318]/80 backdrop-blur-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/20">
                  <Share2 size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  1-Click Invite Slugs
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Generate simple 12-character slug links. Anyone with the code can jump directly into your canvas in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Call To Action ── */}
        <div className="w-full max-w-5xl rounded-3xl border border-indigo-500/30 bg-linear-to-b from-indigo-950/40 to-[#121318] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#6366f120_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Ready to sketch your next idea?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-md mb-8">
              Join teams and developers who whiteboard with zero friction. Free to use with live multiplayer.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] text-sm"
              >
                <span>Create Workspace</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/canvas"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-neutral-300 hover:text-white border border-white/10 bg-white/4 hover:bg-white/8 transition-all text-sm"
              >
                <span>Try Solo First</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Pencil size={12} />
            </div>
            <span className="font-semibold text-neutral-300">SketchIt</span>
            <span>— Virtual Collaborative Whiteboard</span>
          </div>
          <p>© {new Date().getFullYear()} SketchIt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}