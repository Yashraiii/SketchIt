"use client";

import type { ShapeProps } from "@dgmjs/core";
import { useState } from "react";

const SIZES = [
  { label: "S", fontSize: 16, strokeWidth: 1 },
  { label: "M", fontSize: 20, strokeWidth: 2 },
  { label: "L", fontSize: 28, strokeWidth: 3 },
  { label: "XL", fontSize: 40, strokeWidth: 4 },
];

interface PaletteProps {
  onPropsChange?: (props: ShapeProps) => void;
  isDarkMode: boolean;
  currentPropsRef: ShapeProps;
}

export function Palette({ onPropsChange, isDarkMode, currentPropsRef }: PaletteProps) {
  const strokeColor = [
    { label: "Red", stroke: "#f87171", swatch: "#f87171" },
    { label: "Blue", stroke: "#60a5fa", swatch: "#60a5fa" },
    { label: "Green", stroke: "#4ade80", swatch: "#4ade80" },
    { label: "Gray", stroke: "#9ca3af", swatch: "#9ca3af" },
    { label: "Default", stroke: isDarkMode ? "#ffffff" : "#000000", swatch: isDarkMode ? "#ffffff" : "#000000" },
  ];

  const StrokeFillColor = [
    { label: "Red", fill: "#f87171", swatch: "#f87171" },
    { label: "Blue", fill: "#60a5fa", swatch: "#60a5fa" },
    { label: "Green", fill: "#4ade80", swatch: "#4ade80" },
    { label: "Gray", fill: "#9ca3af", swatch: "#9ca3af" },
    { label: "Default", fill: isDarkMode ? "#ffffff" : "#000000", swatch: isDarkMode ? "#ffffff" : "#000000" },
  ];

  const [activeStrokeColor, setActiveStrokeColor] = useState(1);
  const [activeFillColor, setActiveFillColor] = useState(1);
  const [activeSize, setActiveSize] = useState(1);

  const apply = (strokeIdx: number, fillIdx: number, sizeIdx: number) => {
    const color = strokeColor[strokeIdx];
    const fill = StrokeFillColor[fillIdx];
    const size = SIZES[sizeIdx];
    if (!color || !fill || !size) return;

    onPropsChange?.({
      fillColor: fill.fill,
      strokeColor: color.stroke,
      fontSize: size.fontSize,
      strokeWidth: size.strokeWidth,
    });
  };

  return (
    <div className="absolute left-4 top-20 z-30 w-48 overflow-hidden rounded-2xl backdrop-blur-xl border border-white/8 bg-[#1e1e22]/90 shadow-2xl text-white">
      {/* Stroke Color */}
      <div className="border-b border-white/8 px-3.5 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Stroke Color
        </p>
        <div className="flex gap-2">
          {strokeColor.map((c, i) => (
            <button
              key={c.label}
              onClick={() => {
                setActiveStrokeColor(i);
                apply(i, activeFillColor, activeSize);
              }}
              className={`h-6 w-6 rounded-full transition-transform ${
                activeStrokeColor === i ? "ring-2 ring-white ring-offset-2 ring-offset-[#1e1e22] scale-110" : "opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div className="border-b border-white/8 px-3.5 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Fill Color
        </p>
        <div className="flex gap-2">
          {StrokeFillColor.map((c, i) => (
            <button
              key={c.label}
              onClick={() => {
                setActiveFillColor(i);
                apply(activeStrokeColor, i, activeSize);
              }}
              className={`h-6 w-6 rounded-full transition-transform ${
                activeFillColor === i ? "ring-2 ring-white ring-offset-2 ring-offset-[#1e1e22] scale-110" : "opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="px-3.5 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Size
        </p>
        <div className="flex gap-1">
          {SIZES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => {
                setActiveSize(i);
                apply(activeStrokeColor, activeFillColor, i);
              }}
              className={`flex h-7 flex-1 items-center justify-center rounded-lg text-xs font-medium transition ${
                activeSize === i
                  ? "bg-white/20 text-white font-bold"
                  : "text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}