"use client";

import React, { useState } from "react";
import type { Editor } from "@dgmjs/core";
import {
  CircleIcon,
  Eraser,
  Frame,
  HandIcon,
  HighlighterIcon,
  ImageIcon,
  MousePointer2Icon,
  PencilIcon,
  SlashIcon,
  SplineIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react";

interface ToolbarProps {
  activeHandler?: string;
  onActiveHandlerChange?: (handler: string) => void;
  editor: Editor | null;
  setShowPalette: React.Dispatch<React.SetStateAction<boolean>>;
}

const TOOL_GROUPS = [
  {
    tools: [
      { id: "Select", icon: <MousePointer2Icon className="h-4.5 w-4.5" />, label: "Select (V)" },
      { id: "Hand", icon: <HandIcon className="h-4.5 w-4.5" />, label: "Hand (H)" },
      { id: "Eraser", icon: <Eraser className="h-4.5 w-4.5" />, label: "Eraser (E)" },
    ],
  },
  {
    tools: [
      { id: "Rectangle", icon: <SquareIcon className="h-4.5 w-4.5" />, label: "Rectangle (R)" },
      { id: "Ellipse", icon: <CircleIcon className="h-4.5 w-4.5" />, label: "Ellipse (O)" },
      { id: "Text", icon: <TypeIcon className="h-4.5 w-4.5" />, label: "Text (T)" },
      { id: "Image", icon: <ImageIcon className="h-4.5 w-4.5" />, label: "Image" },
    ],
  },
  {
    tools: [
      { id: "Line", icon: <SlashIcon className="h-4.5 w-4.5" />, label: "Line (L)" },
      { id: "Connector", icon: <SplineIcon className="h-4.5 w-4.5" />, label: "Connector" },
      { id: "Freehand", icon: <PencilIcon className="h-4.5 w-4.5" />, label: "Freehand (P)" },
      { id: "Highlighter", icon: <HighlighterIcon className="h-4.5 w-4.5" />, label: "Highlighter" },
    ],
  },
  {
    tools: [
      { id: "Frame", icon: <Frame className="h-4.5 w-4.5" />, label: "Frame (D)" },
    ],
  },
];

export function Toolbar({
  activeHandler = "Select",
  onActiveHandlerChange,
  setShowPalette,
}: ToolbarProps) {
  const [hovered, setHovered] = useState(false);

  const handleSelect = (handler: string) => {
    if (onActiveHandlerChange) onActiveHandlerChange(handler);
    if (!["Highlighter", "Eraser", "Select", "Hand", "Image"].includes(handler)) {
      setShowPalette(true);
    } else {
      setShowPalette(false);
    }
  };

  return (
    <div className="pointer-events-none absolute top-5 z-30 flex w-full items-center justify-center">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`pointer-events-auto flex items-center gap-0.5 rounded-2xl px-2 py-1.5 backdrop-blur-xl transition-all duration-300 ease-out bg-[#1e1e22]/90 border border-white/8 shadow-2xl ${
          hovered ? "scale-[1.02]" : "scale-100"
        }`}
      >
        {TOOL_GROUPS.map((group, gi) => (
          <div key={gi} className="contents">
            {gi > 0 && <div className="mx-1 h-5 w-px bg-white/10" />}
            {group.tools.map((tool) => (
              <button
                key={tool.id}
                title={tool.label}
                onClick={() => handleSelect(tool.id)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  activeHandler === tool.id
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}