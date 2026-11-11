"use client";

import React, { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderOpen,
  Clock,
  Search,
  Users,
  Loader2,
  UserPlus,
  Trash2,
  Copy,
  Check,
  LogOut,
  Pencil,
  X,
} from "lucide-react";
import api from "../../api";
import { authClient } from "../lib/auth-client";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  isShared?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinSlug, setJoinSlug] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
          router.replace("/login");
          return;
        }
        setUser(session.data.user);
        fetchWorkspaces();
      } catch {
        router.replace("/login");
      } finally {
        setIsSessionLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const fetchWorkspaces = async () => {
    setIsLoadingWorkspaces(true);
    try {
      const res = await api.get("/api/room/rooms");
      const list = res.data?.data || res.data || [];
      setWorkspaces(list);
    } catch (err: any) {
      console.error("Failed to load workspaces", err);
    } finally {
      setIsLoadingWorkspaces(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const res = await api.post("/api/room/room", { name: newRoomName.trim() });
      const created = res.data?.data;
      setIsCreateOpen(false);
      setNewRoomName("");
      if (created?.slug) {
        router.push(`/canvas/${created.slug}`);
      } else {
        fetchWorkspaces();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinSlug.trim()) return;
    setIsJoining(true);
    setErrorMsg(null);
    try {
      await api.post("/api/room/room/join", { slug: joinSlug.trim() });
      const slug = joinSlug.trim();
      setIsJoinOpen(false);
      setJoinSlug("");
      router.push(`/canvas/${slug}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Room not found or failed to join");
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await api.delete("/api/room/room", { data: { roomId } });
      setWorkspaces((prev) => prev.filter((w) => w.id !== roomId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete room", err);
    }
  };

  const handleCopy = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  const filtered = workspaces.filter((w) =>
    (w.name || w.slug).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  if (isSessionLoading) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white"
      >
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white flex flex-col selection:bg-indigo-500/30 overflow-hidden">
      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0d0e12]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Pencil className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              SketchIt
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-neutral-200">{user?.name || "User"}</div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 text-neutral-400 transition"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-white placeholder-neutral-500 outline-none focus:border-white/20 focus:bg-white/[0.07] transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setErrorMsg(null); setIsJoinOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 text-sm font-medium transition"
            >
              <UserPlus size={16} />
              <span>Join Room</span>
            </button>

            <button
              onClick={() => { setErrorMsg(null); setIsCreateOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 hover:bg-white text-gray-900 text-sm font-semibold transition"
            >
              <Plus size={16} />
              <span>New Canvas</span>
            </button>
          </div>
        </div>

        {/* Workspaces Grid */}
        {isLoadingWorkspaces ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl border border-white/6 bg-white/2 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((room) => (
              <div
                key={room.id}
                className="group relative rounded-2xl border border-white/8 bg-[#121318]/90 hover:border-white/20 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/40 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 text-neutral-400 flex items-center justify-center border border-white/10">
                    <FolderOpen size={18} />
                  </div>

                  <div className="flex items-center gap-2">
                    {room.isShared && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/8 text-neutral-400 border border-white/10">
                        <Users size={10} /> Shared
                      </span>
                    )}
                    <button
                      onClick={(e) => handleCopy(room.slug, e)}
                      title="Copy room code"
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-neutral-500 hover:text-white transition"
                    >
                      {copiedSlug === room.slug ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  {/* Only the name navigates to canvas */}
                  <Link
                    href={`/canvas/${room.slug}`}
                    className="block font-semibold text-base text-neutral-100 hover:text-white truncate mb-1 w-fit underline-offset-2 hover:underline"
                  >
                    {room.name || "Untitled Canvas"}
                  </Link>
                  <p className="text-xs text-neutral-600 font-mono mb-4">{room.slug}</p>

                  <div className="flex items-center justify-between border-t border-white/6 pt-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{formatDate(room.updatedAt || room.createdAt)}</span>
                    </div>

                    {confirmDeleteId === room.id ? (
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-400 hover:text-red-300 font-semibold text-xs"
                      >
                        Confirm Delete?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(room.id)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/2">
            <div className="h-14 w-14 rounded-2xl bg-white/5 text-neutral-500 flex items-center justify-center mb-4">
              <FolderOpen size={24} />
            </div>
            <h3 className="text-base font-semibold text-neutral-300 mb-1">No workspaces found</h3>
            <p className="text-sm text-neutral-500 mb-6">
              {searchQuery ? "No matches found for your search" : "Create your first canvas to start drawing"}
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 hover:bg-white text-gray-900 text-sm font-semibold transition"
            >
              <Plus size={16} />
              <span>Create Canvas</span>
            </button>
          </div>
        )}
      </main>

      {/* Modal: Create Room */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121318] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">New Workspace</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <p className="mb-4 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg">{errorMsg}</p>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Architecture Wireframe"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-white placeholder-neutral-500 outline-none focus:border-white/20 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-white/10 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-200 hover:bg-white text-black flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Create & Open"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Room */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121318] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Join Workspace</h3>
              <button onClick={() => setIsJoinOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <p className="mb-4 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg">{errorMsg}</p>
            )}

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Room Slug Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. abc-def-ghi"
                  value={joinSlug}
                  onChange={(e) => setJoinSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-white placeholder-neutral-500 outline-none focus:border-white/20 transition font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-white/10 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-200 hover:bg-white text-black flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isJoining ? <Loader2 size={16} className="animate-spin" /> : "Join Canvas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}