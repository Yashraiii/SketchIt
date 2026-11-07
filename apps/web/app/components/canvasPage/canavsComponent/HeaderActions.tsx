"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@dgmjs/core";
import { House, Moon, Sun, Copy, Check } from "lucide-react";

interface HeaderActionsProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  editor: Editor | null;
  isWsConnected?: boolean;
}

export default function HeaderActions({
  isDarkMode,
  setIsDarkMode,
  editor,
  isWsConnected,
}: HeaderActionsProps) {
  const [scale, setScale] = useState(100);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!editor) return;
    const handleScale = () => {
      setScale(Math.round(editor.getScale() * 100));
    };
    handleScale();
    editor.onRepaint.addListener(handleScale);
    return () => {
      editor.onRepaint.removeListener(handleScale);
    };
  }, [editor]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-2xl border border-white/8 bg-[#1e1e22]/90 px-3 py-1.5 backdrop-blur-xl shadow-2xl text-white">
      {/* Zoom scale */}
      <span className="min-w-10 text-center text-xs font-mono text-neutral-400">
        {scale}%
      </span>

      <div className="mx-1 h-4 w-px bg-white/10" />

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        title="Copy invite link"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition"
      >
        {isCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      </button>

      {/* Live status badge */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-white/5">
        <span
          className={`h-2 w-2 rounded-full ${
            isWsConnected ? "bg-emerald-500 shadow-sm shadow-emerald-500" : "bg-red-500"
          }`}
        />
        <span className="text-neutral-300">{isWsConnected ? "Live" : "Offline"}</span>
      </div>

      <div className="mx-1 h-4 w-px bg-white/10" />

      {/* Theme toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        title="Toggle Theme"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition"
      >
        {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {/* Dashboard button */}
      <button
        onClick={() => router.replace("/dashboard")}
        title="Dashboard"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition"
      >
        <House size={16} />
      </button>
    </div>
  );
}